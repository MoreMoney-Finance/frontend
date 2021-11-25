import { parseUnits } from '@ethersproject/units';
import {
  CurrencyValue,
  Token,
  useContractCall,
  useEthers,
} from '@usedapp/core';
import { formatEther } from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber } from 'ethers';
import { getAddress, Interface, parseBytes32String } from 'ethers/lib/utils';
import { useContext } from 'react';
import { UserAddressContext } from '../contexts/UserAddressContext';
import IsolatedLending from '../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json';
import IsolatedLendingLiquidation from '../contracts/artifacts/contracts/IsolatedLendingLiquidation.sol/IsolatedLendingLiquidation.json';
import YieldConversionBidStrategy from '../contracts/artifacts/contracts/YieldConversionBidStrategy.sol/YieldConversionBidStrategy.json';
import { addressToken, tokenAmount } from './tokens';
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
  PangolinStakingRewardsStrategy: string;
  AMMYieldconverter: string;
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
};

function parseStratMeta(
  row: RawStratMetaRow,
  stable: Token
): ParsedStratMetaRow {
  const tokenAddress = getAddress(row.token);
  const token = addressToken.get(tokenAddress)!;
  const tvlInToken = tokenAmount(row.token, row.tvl)!;
  return {
    debtCeiling: new CurrencyValue(stable, row.debtCeiling)!,
    totalDebt: new CurrencyValue(stable, row.totalDebt),
    stabilityFeePercent: row.stabilityFee.toNumber() / 100,
    mintingFeePercent: row.mintingFee.toNumber() / 100,
    strategyAddress: row.strategy,
    token,
    APY: convertAPF2APY(row.APF),
    totalCollateral: tokenAmount(tokenAddress, row.totalCollateral)!,
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
  };
}

const COMPOUNDING = 52;

function convertAPF2APY(APF: BigNumber): number {
  const apf = APF.toNumber();
  return 100 * ((1 + (apf / 10000 - 1) / COMPOUNDING) ** COMPOUNDING - 1);
}

export function useStable() {
  const addresses = useAddresses();
  return addressToken.get(getAddress(addresses.Stablecoin))!;
}

export type StrategyMetadata = Record<
  string,
  Record<string, ParsedStratMetaRow>
>;

export function useIsolatedStrategyMetadata(): StrategyMetadata {
  const stable = useStable();
  const allStratMeta = useIsolatedLendingView(
    'viewAllStrategyMetadata',
    [],
    []
  );
  return allStratMeta.reduce(
    (result: StrategyMetadata, row: RawStratMetaRow) => {
      const parsedRow = parseStratMeta(row, stable);
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
};

type RawPositionMetaRow = {
  trancheId: BigNumber;
  strategy: string;
  collateral: BigNumber;
  debt: BigNumber;
  token: string;
};

function parsePositionMeta(
  row: RawPositionMetaRow,
  stable: Token
): ParsedPositionMetaRow {
  const tokenAddress = getAddress(row.token);
  return {
    trancheId: row.trancheId.toNumber(),
    strategy: row.strategy,
    debt: new CurrencyValue(stable, row.debt),
    collateral: tokenAmount(tokenAddress, row.collateral),
    token: addressToken.get(tokenAddress)!,
  };
}

export type TokenStratPositionMetadata = Record<
  string,
  ParsedPositionMetaRow[]
>;
export function useIsolatedPositionMetadata(): TokenStratPositionMetadata {
  const account = useContext(UserAddressContext);
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

export function useYieldConversionBidStrategyView(
  strategyAddress: string,
  method: string,
  args: any[],
  defaultResult: any
) {
  const abi = new Interface(YieldConversionBidStrategy.abi);
  return (useContractCall({
    abi,
    address: strategyAddress,
    method,
    args,
  }) ?? [defaultResult])[0];
}
