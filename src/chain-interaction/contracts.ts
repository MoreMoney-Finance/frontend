import { parseUnits } from '@ethersproject/units';
import {
  ChainId,
  ContractCall,
  CurrencyValue,
  Token,
  useContractCall,
  useContractCalls,
  useEthers,
} from '@usedapp/core';
import { formatEther } from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber, ethers } from 'ethers';
import { getAddress, Interface, parseBytes32String } from 'ethers/lib/utils';
import { useContext } from 'react';
import { WalletBalancesContext } from '../contexts/WalletBalancesContext';
import ERC20 from '../contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import IsolatedLending from '../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json';
import IsolatedLendingLiquidation from '../contracts/artifacts/contracts/IsolatedLendingLiquidation.sol/IsolatedLendingLiquidation.json';
import OracleRegistry from '../contracts/artifacts/contracts/OracleRegistry.sol/OracleRegistry.json';
import YieldConversionStrategy from '../contracts/artifacts/contracts/strategies/YieldConversionStrategy.sol/YieldConversionStrategy.json';
import IFeeReporter from '../contracts/artifacts/interfaces/IFeeReporter.sol/IFeeReporter.json';
import IStrategy from '../contracts/artifacts/interfaces/IStrategy.sol/IStrategy.json';
import VestingStakingRewards from '../contracts/artifacts/contracts/rewards/VestingStakingRewards.sol/VestingStakingRewards.json';
import { getTokenFromAddress, tokenAmount } from './tokens';
import { YYMetadata, YYMetadataContext } from '../contexts/YYMetadataContext';

/* eslint-disable */
export const addresses: Record<
  string,
  DeploymentAddresses
> = require('../contracts/addresses.json');

export type DeploymentAddresses = {
  Fund: string;
  Roles: string;
  IsolatedLending: string;
  IsolatedLendingLiquidation: string;
  DependencyController: string;
  OracleRegistry: string;
  Stablecoin: string;
  StrategyRegistry: string;
  TrancheIDService: string;
  TraderJoeMasterChefStrategy: string;
  PangolinMiniChefStrategy: string;
  AMMYieldConverter: string;
  WrapNativeIsolatedLending: string;
  CurvePoolRewards: string;
};

export function useAddresses() {
  const { chainId } = useEthers();

  // TODO make the default avalanche once it's supported by useDApp
  const chainIdStr = chainId ? chainId.toString() : '43114';
  return addresses[chainIdStr];
}

export function useIsolatedLendingView(
  method: string,
  args: any[],
  defaultResult: any
) {
  const address = useAddresses().IsolatedLending;
  const abi = new Interface(IsolatedLending.abi);
  return (useContractCall({
    abi,
    address,
    method,
    args,
  }) ?? [defaultResult])[0];
}

type RawStratMetaRow = {
  debtCeiling: BigNumber;
  APF: BigNumber;
  borrowablePer10k: BigNumber;
  mintingFee: BigNumber;
  stabilityFee: BigNumber;
  strategy: string;
  strategyName: string;
  token: string;
  totalCollateral: BigNumber;
  totalDebt: BigNumber;
  valuePer1e18: BigNumber;
  tvl: BigNumber;
  harvestBalance2Tally: BigNumber;
  yieldType: number;
  underlyingStrategy?: string;
};

export enum TxStatus {
  NONE = 'None',
  MINING = 'Mining',
  SUCCESS = 'Success',
}

export enum YieldType {
  REPAYING = 'REPAYING',
  COMPOUNDING = 'COMPOUNDING',
  NOYIELD = 'NO YIELD',
}

export type ParsedStratMetaRow = {
  debtCeiling: CurrencyValue;
  totalDebt: CurrencyValue;
  stabilityFeePercent: number;
  mintingFeePercent: number;
  strategyAddress: string;
  token: Token;
  APY: number;
  totalCollateral: CurrencyValue;
  borrowablePercent: number;
  usdPrice: number;
  strategyName: string;
  tvlInToken: CurrencyValue;
  tvlInPeg: CurrencyValue;
  harvestBalance2Tally: CurrencyValue;
  yieldType: YieldType;
  balance: number;
};

function parseStratMeta(
  chainId: ChainId,
  row: RawStratMetaRow,
  stable: Token,
  balancesCtx: Map<string, CurrencyValue>,
  yyMetadata: YYMetadata
): ParsedStratMetaRow {
  const token = getTokenFromAddress(chainId, row.token);

  const tvlInToken = tokenAmount(chainId, row.token, row.tvl)!;
  const balance =
    balancesCtx.get(token!.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  const strategyAddress = getAddress(row.strategy);
  const underlyingAddress = row.underlyingStrategy
    ? getAddress(row.underlyingStrategy)
    : strategyAddress;

  const APY =
    underlyingAddress in yyMetadata
      ? yyMetadata[strategyAddress].apy * 0.9
      : convertAPF2APY(row.APF);

  return {
    debtCeiling: new CurrencyValue(stable, row.debtCeiling)!,
    totalDebt: new CurrencyValue(stable, row.totalDebt),
    stabilityFeePercent: row.stabilityFee.toNumber() / 100,
    mintingFeePercent: row.mintingFee.toNumber() / 100,
    strategyAddress,
    token,
    APY,
    totalCollateral: tokenAmount(chainId, row.token, row.totalCollateral)!,
    borrowablePercent: row.borrowablePer10k.toNumber() / 100,
    usdPrice:
      parseFloat(formatEther(row.valuePer1e18)) / 10 ** (18 - token.decimals),
    strategyName: parseBytes32String(row.strategyName),
    tvlInToken,
    tvlInPeg: new CurrencyValue(
      stable,
      row.tvl.mul(row.valuePer1e18).div(parseUnits('1', token.decimals))
    ),
    harvestBalance2Tally: new CurrencyValue(stable, row.harvestBalance2Tally),
    yieldType: [YieldType.REPAYING, YieldType.COMPOUNDING, YieldType.NOYIELD][
      row.yieldType
    ],
    balance: parseFloat(
      balance.format({ significantDigits: Infinity, suffix: '' })
    ),
  };
}

const COMPOUNDING = 52;

function convertAPF2APY(APF: BigNumber): number {
  const apf = APF.toNumber();
  return 100 * ((1 + (apf / 10000 - 1) / COMPOUNDING) ** COMPOUNDING - 1);
}

export function useStable() {
  const { chainId } = useEthers();
  const addresses = useAddresses();
  return getTokenFromAddress(
    chainId ? (chainId as unknown as ChainId) : ChainId.Avalanche,
    addresses.Stablecoin
  )!;
}

export type StrategyMetadata = Record<
  string,
  Record<string, ParsedStratMetaRow>
>;

export function useIsolatedStrategyMetadata(): StrategyMetadata {
  const stable = useStable();
  const { chainId } = useEthers();
  const allStratMeta = useIsolatedLendingView(
    'viewAllStrategyMetadata',
    [],
    []
  );

  const balancesCtx = useContext(WalletBalancesContext);
  const yyMetadata = useContext(YYMetadataContext);
  return allStratMeta.reduce(
    (result: StrategyMetadata, row: RawStratMetaRow) => {
      const parsedRow = parseStratMeta(
        chainId!,
        row,
        stable,
        balancesCtx,
        yyMetadata
      );
      const tokenAddress = parsedRow.token.address;
      return {
        ...result,
        [tokenAddress]: {
          [parsedRow.strategyAddress]: parsedRow,
          ...(result[tokenAddress] || {}),
        },
      };
    },
    {}
  );
}

export type ParsedPositionMetaRow = {
  trancheId: number;
  strategy: string;
  collateral: CurrencyValue | undefined;
  debt: CurrencyValue;
  token: Token;
  yield: CurrencyValue;
  collateralValue: CurrencyValue;
  borrowablePercent: number;
  owner: string;
  liquidationPrice: number;
};

type RawPositionMetaRow = {
  trancheId: BigNumber;
  strategy: string;
  collateral: BigNumber;
  debt: BigNumber;
  token: string;
  yield: BigNumber;
  collateralValue: BigNumber;
  borrowablePer10k: BigNumber;
  owner: string;
};

export function calcLiquidationPrice(
  borrowablePercent: number,
  debt: CurrencyValue,
  collateral: CurrencyValue
) {
  const debtNum = parseFloat(
    debt.format({ significantDigits: Infinity, suffix: '' })
  );
  const colNum = parseFloat(
    collateral.format({ significantDigits: Infinity, suffix: '' })
  );

  return calcLiqPriceFromNum(borrowablePercent, debtNum, colNum);
}

export function calcLiqPriceFromNum(
  borrowablePercent: number,
  debtNum: number,
  colNum: number
): number {
  if (colNum > 0) {
    return (100 * debtNum) / (colNum * borrowablePercent);
  } else {
    return 0;
  }
}

function parsePositionMeta(
  row: RawPositionMetaRow,
  stable: Token
): ParsedPositionMetaRow {
  const debt = new CurrencyValue(stable, row.debt);
  const collateral = tokenAmount(stable.chainId, row.token, row.collateral);
  const borrowablePercent = row.borrowablePer10k.toNumber() / 100;

  return {
    trancheId: row.trancheId.toNumber(),
    strategy: row.strategy,
    debt,
    collateral,
    token: getTokenFromAddress(stable.chainId, row.token)!,
    yield: new CurrencyValue(stable, row.yield),
    collateralValue: new CurrencyValue(stable, row.collateralValue),
    borrowablePercent,
    owner: row.owner,
    liquidationPrice: calcLiquidationPrice(
      borrowablePercent,
      debt,
      collateral!
    ),
  };
}

export type TokenStratPositionMetadata = Record<
  string,
  ParsedPositionMetaRow[]
>;
export function useIsolatedPositionMetadata(
  account: string
): TokenStratPositionMetadata {
  const positionMeta = useIsolatedLendingView(
    'viewPositionsByOwner',
    [account],
    []
  );
  const stable = useStable();

  return positionMeta.reduce(
    (result: TokenStratPositionMetadata, row: RawPositionMetaRow) => {
      const parsedRow = parsePositionMeta(row, stable);
      const tokenAddress = parsedRow.token.address;
      const list = result[tokenAddress] || [];
      return {
        ...result,
        [tokenAddress]: [...list, parsedRow],
      };
    },
    {}
  );
}

export function useTotalSupply(
  method: string,
  args: any[],
  defaultResult: any
) {
  const address = useAddresses().Stablecoin;
  const abi = new Interface(ERC20.abi);
  return (useContractCall({
    abi,
    address,
    method,
    args,
  }) ?? [defaultResult])[0];
}

export function useIsolatedLendingLiquidationView(
  method: string,
  args: any[],
  defaultResult: any
) {
  const address = useAddresses().IsolatedLendingLiquidation;
  const abi = new Interface(IsolatedLendingLiquidation.abi);
  return (useContractCall({
    abi,
    address,
    method,
    args,
  }) ?? [defaultResult])[0];
}

export function useYieldConversionStrategyView(
  strategyAddress: string,
  method: string,
  args: any[],
  defaultResult: any
) {
  const abi = new Interface(YieldConversionStrategy.abi);
  return (useContractCall({
    abi,
    address: strategyAddress,
    method,
    args,
  }) ?? [defaultResult])[0];
}

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;
export function useUpdatedPositions(timeStart: number) {
  const endPeriod = Math.floor(Date.now() / 1000 / ONE_WEEK_SECONDS);
  const startPeriod = Math.floor(timeStart / 1000 / ONE_WEEK_SECONDS);
  // console.log('endPeriod', endPeriod);
  // console.log('startPeriod', startPeriod);
  const stable = useStable();
  const iL = useAddresses().IsolatedLending;

  const args = Array(endPeriod - startPeriod)
    .fill(startPeriod)
    .map((x, i) => ({
      abi: new Interface(IsolatedLending.abi),
      address: iL,
      method: 'viewPositionsByTrackingPeriod',
      args: [x + i],
    }));

  const rows = (useContractCalls(args) as RawPositionMetaRow[][][]) ?? [];

  return rows
    .flatMap((x) => x)
    .flatMap((x) => x)
    .filter((x) => x)
    .map((row) => parsePositionMeta(row, stable));
}

export function useRegisteredOracle(tokenAddress?: string) {
  const address = useAddresses().OracleRegistry;
  const abi = new Interface(OracleRegistry.abi);
  const stable = useStable();
  return (useContractCall({
    abi,
    address,
    method: 'tokenOracle',
    args: [tokenAddress, stable.address],
  }) ?? [undefined])[0];
}

export function useAllFeesEver(contracts: string[]) {
  function convert2ContractCall(contract: string) {
    return {
      abi: new Interface(IFeeReporter.abi),
      address: contract,
      method: 'viewAllFeesEver',
      args: [],
    };
  }

  const calls: ContractCall[] = contracts.map(convert2ContractCall);
  console.log('calls', calls);
  const results = useContractCalls(calls) ?? [];

  return results;
}

export function useEstimatedHarvestable(
  strategyAddress: string,
  tokenAddress: string
) {
  const abi = new Interface(IStrategy.abi);
  return (useContractCall({
    abi,
    address: strategyAddress,
    method: 'viewEstimatedHarvestable',
    args: [tokenAddress],
  }) ?? [undefined])[0];
}

export function useStakingMetadata(
  stakingContracts: string[],
  account?: string
): [RawStakingMetadata][] {
  const abi = new Interface(VestingStakingRewards.abi);
  const userAccount = account ?? ethers.constants.AddressZero;
  const calls: ContractCall[] = stakingContracts.map((address) => ({
    abi,
    address,
    method: 'stakingMetadata',
    args: [userAccount],
  }));

  let contractCalls2 = useContractCalls(calls);
  const results = (contractCalls2 ?? []) as unknown as [RawStakingMetadata][];
  return results;
}

type RawStakingMetadata = {
  stakingToken: string;
  rewardsToken: string;
  totalSupply: BigNumber;
  tvl: BigNumber;
  aprPer10k: BigNumber;
  vestingCliff: BigNumber;
  periodFinish: BigNumber;
  stakedBalance: BigNumber;
  vestingStart: BigNumber;
  earned: BigNumber;
  vested: BigNumber;
};

export type ParsedStakingMetadata = {
  stakingToken: Token;
  rewardsToken: Token;
  totalSupply: CurrencyValue;
  tvl: CurrencyValue;
  aprPercent: number;
  vestingCliff: Date;
  periodFinish: Date;
  stakedBalance: CurrencyValue;
  vestingStart: Date;
  earned: CurrencyValue;
  vested: CurrencyValue;
};

export function useParsedStakingMetadata(
  stakingContracts: string[],
  account?: string
): ParsedStakingMetadata[] {
  const { chainId } = useEthers();
  const stable = useStable();
  return useStakingMetadata(stakingContracts, account)
    .filter((x) => x)
    .filter(([x]) => x)
    .map(([stakingMeta]: [RawStakingMetadata]) => {
      const stakingToken = getTokenFromAddress(
        chainId,
        stakingMeta.stakingToken
      )!;
      const rewardsToken = getTokenFromAddress(
        chainId,
        stakingMeta.rewardsToken
      )!;
      return {
        stakingToken,
        rewardsToken,
        totalSupply: new CurrencyValue(stakingToken, stakingMeta.totalSupply),
        tvl: new CurrencyValue(stable, stakingMeta.tvl),
        aprPercent: (100 * stakingMeta.aprPer10k.toNumber()) / 10000,
        vestingCliff: timestamp2Date(stakingMeta.vestingCliff),
        periodFinish: timestamp2Date(stakingMeta.periodFinish),
        stakedBalance: new CurrencyValue(
          stakingToken,
          stakingMeta.stakedBalance
        ),
        vestingStart: timestamp2Date(stakingMeta.vestingStart),
        earned: new CurrencyValue(rewardsToken, stakingMeta.earned),
        vested: new CurrencyValue(rewardsToken, stakingMeta.vested),
      };
    });
}

function timestamp2Date(tstamp: BigNumber) {
  return new Date(tstamp.toNumber() * 1000);
}
