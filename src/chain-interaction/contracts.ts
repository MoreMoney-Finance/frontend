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
import {
  formatEther,
  parseEther,
} from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber, ethers } from 'ethers';
import { getAddress, Interface, parseBytes32String } from 'ethers/lib/utils';
import React, { useContext, useState } from 'react';
import {
  ExternalMetadataContext,
  YieldMonitorMetadata,
  YYMetadata,
} from '../contexts/ExternalMetadataContext';
import { WalletBalancesContext } from '../contexts/WalletBalancesContext';
import ERC20 from '../contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import xMore from '../contracts/artifacts/contracts/governance/xMore.sol/xMore.json';
import IsolatedLending from '../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json';
import OracleRegistry from '../contracts/artifacts/contracts/OracleRegistry.sol/OracleRegistry.json';
import VestingLaunchReward from '../contracts/artifacts/contracts/rewards/VestingLaunchReward.sol/VestingLaunchReward.json';
import VestingStakingRewards from '../contracts/artifacts/contracts/rewards/VestingStakingRewards.sol/VestingStakingRewards.json';
import Stablecoin from '../contracts/artifacts/contracts/Stablecoin.sol/Stablecoin.json';
import StableLending from '../contracts/artifacts/contracts/StableLending.sol/StableLending.json';
import YieldConversionStrategy from '../contracts/artifacts/contracts/strategies/YieldConversionStrategy.sol/YieldConversionStrategy.json';
import StrategyViewer from '../contracts/artifacts/contracts/StrategyViewer.sol/StrategyViewer.json';
import IFeeReporter from '../contracts/artifacts/interfaces/IFeeReporter.sol/IFeeReporter.json';
import IStrategy from '../contracts/artifacts/interfaces/IStrategy.sol/IStrategy.json';
import { parseFloatCurrencyValue } from '../utils';
import { getTokenFromAddress, tokenAmount } from './tokens';
// import earnedRewards from '../constants/earned-rewards.json';
// import rewardsRewards from '../constants/rewards-rewards.json';

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
  TraderJoeMasterChef2Strategy: string;
  YieldYakAVAXStrategy: string;
  SimpleHoldingStrategy: string;
  YieldYakStrategy: string;
  PangolinMiniChefStrategy: string;
  AMMYieldConverter: string;
  WrapNativeIsolatedLending: string;
  CurvePoolRewards: string;
  DirectFlashLiquidation: string;
  LPTFlashLiquidation: string;

  MoreToken: string;
  xMore: string;

  StableLending: string;
  StableLendingLiquidation: string;
  DirectFlashStableLiquidation: string;
  LPTFlashStableLiquidation: string;
  wsMAXIStableLiquidation: string;
  xJoeStableLiquidation: string;
  WrapNativeStableLending: string;
  sJoeStrategy: string;

  VestingLaunchReward: string;

  CurvePool: string;
  CurvePoolSL: string;
  CurvePoolSL2: string;
  StrategyViewer: string;

  LiquidYieldStrategy: string;
  MultiTraderJoeMasterChef3Strategy: string;
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
  const addresses = useAddresses();

  const abi = new Interface(IsolatedLending.abi);

  return {
    legacy: (useContractCall({
      abi,
      address:
        'IsolatedLending' in addresses
          ? addresses.IsolatedLending
          : addresses.StableLending,
      method,
      args,
    }) ?? [defaultResult])[0],
    current: (useContractCall({
      abi,
      address:
        'StableLending' in addresses
          ? addresses.StableLending
          : addresses.IsolatedLending,
      method,
      args,
    }) ?? [defaultResult])[0],
  };
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
  selfRepayingAPY: number;
  compoundingAPY: number;
};

function parseStratMeta(
  chainId: ChainId,
  row: RawStratMetaRow,
  stable: Token,
  balancesCtx: Map<string, CurrencyValue>,
  yyMetadata: YYMetadata,
  globalMoneyAvailable: BigNumber,
  yieldMonitor: Record<string, YieldMonitorMetadata>,
  additionalYield: Record<string, Record<string, number>>
): ParsedStratMetaRow | undefined {
  const token = getTokenFromAddress(chainId, row.token);
  if (token) {
    const tvlInToken = tokenAmount(chainId, row.token, row.tvl)!;
    const balance =
      balancesCtx.get(token!.address) ??
      new CurrencyValue(token, BigNumber.from('0'));

    const strategyAddress = getAddress(row.strategy);
    const underlyingAddress = row.underlyingStrategy
      ? getAddress(row.underlyingStrategy)
      : strategyAddress;

    const APY =
      strategyAddress === addresses[chainId].LiquidYieldStrategy
        ? token.address === '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
          ? (yieldMonitor['0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d']
              .totalApy *
              0.65 *
              0.8) /
            0.5
          : (yieldMonitor['0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d']
              .totalApy *
              0.3 *
              0.8) /
              0.5 +
            7.2
        : underlyingAddress in yyMetadata
        ? yyMetadata[underlyingAddress].apy * 0.9
        : token.address in yieldMonitor
        ? yieldMonitor[token.address].totalApy
        : token.address in additionalYield &&
          strategyAddress in additionalYield[token.address]
        ? additionalYield[token.address][strategyAddress]
        : 0;

    const selfRepayingAPY =
      row.yieldType === 0
        ? strategyAddress === addresses[chainId].LiquidYieldStrategy
          ? token.address === '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
            ? ((yieldMonitor['0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d']
                .totalApy -
                parseFloat(
                  yieldMonitor[
                    '0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d'
                  ].apy.toString()
                )) *
                0.65 *
                0.8) /
              0.5
            : ((yieldMonitor['0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d']
                .totalApy -
                parseFloat(
                  yieldMonitor[
                    '0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d'
                  ].apy.toString()
                )) *
                0.3 *
                0.8) /
              0.5
          : token.address in yieldMonitor
          ? yieldMonitor[token.address].totalApy -
            parseFloat(yieldMonitor[token.address].apy.toString())
          : token.address in additionalYield &&
            strategyAddress in additionalYield[token.address]
          ? additionalYield[token.address][strategyAddress]
          : 0
        : 0;

    const compoundingAPY =
      strategyAddress === addresses[chainId].LiquidYieldStrategy &&
      token.address !== '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
        ? 7.2
        : row.yieldType === 0 && token.address in yieldMonitor
        ? parseFloat(yieldMonitor[token.address].apy.toString())
        : strategyAddress === addresses[chainId].YieldYakStrategy ||
          strategyAddress === addresses[chainId].YieldYakAVAXStrategy
        ? APY
        : 0;

    let syntheticDebtCeil = globalMoneyAvailable.add(row.totalDebt);

    const trueOne = parseUnits('1', token.decimals);
    const valPerOne = trueOne.mul(row.valuePer1e18).div(parseEther('1'));

    return {
      debtCeiling: new CurrencyValue(
        stable,
        row.debtCeiling.gt(syntheticDebtCeil)
          ? syntheticDebtCeil
          : row.debtCeiling
      ),
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
      tvlInPeg: new CurrencyValue(stable, row.tvl.mul(valPerOne).div(trueOne)),
      harvestBalance2Tally: new CurrencyValue(stable, row.harvestBalance2Tally),
      yieldType: [YieldType.REPAYING, YieldType.COMPOUNDING, YieldType.NOYIELD][
        row.yieldType
      ],
      balance: parseFloatCurrencyValue(balance),
      selfRepayingAPY: selfRepayingAPY,
      compoundingAPY: compoundingAPY,
    };
  }
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

// export async function queryStratMeta(library: any) {
//   const wsm = (await new ethers.Contract('0x21c971d78e1a398710d964ed1ac4c80e5940ed25', new Interface(IStrategy.abi), library).viewStrategyMetadata(
//     '0x2148D1B21Faa7eb251789a51B404fc063cA6AAd6'
//   ));

//   console.log('wsm', wsm);

//   for (let contract of [
//     '0xdfa3bcda5f954a1e6cef247bdfa89f15702a7473',
//     // '0x21c971d78e1a398710d964ed1ac4c80e5940ed25',
//     // '0x0db20d1643112fa00c4d3ddb58369ad26c1f7c1d',
//     '0xaa3ea561a656cbe310f2e10981085da2d989f17e',
//     '0x888fc8d90177a4097e196ef6bbdc7d2e8cffdb17',
//     '0x10d71115360f9129623096e8108bc6856cf86d3a',
//   ]) {
//     const contrac = new ethers.Contract(
//       contract,
//       new Interface(IsolatedLending.abi),
//       library
//     );
//     console.log('querying', contract);
//     const result = await contrac.viewAllStrategyMetadata();
//     console.log('Returened strat meta', contract, result);
//   }
//   return undefined;
// }

export function useIsolatedStrategyMetadata(): StrategyMetadata {
  const [stratMeta, setStratMeta] = useState<StrategyMetadata>({});
  const stable = useStable();
  const { chainId } = useEthers();

  const globalDebtCeiling = useGlobalDebtCeiling(
    'globalDebtCeiling',
    [],
    BigNumber.from(0)
  );
  const totalSupply = useTotalSupply('totalSupply', [], BigNumber.from(0));

  const balancesCtx = useContext(WalletBalancesContext);
  const { yyMetadata, yieldMonitor, additionalYieldData } = useContext(
    ExternalMetadataContext
  );

  const addresses = useAddresses();

  const token2Strat = {
    ['0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE']:
      addresses.LiquidYieldStrategy,
    ['0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7']:
      addresses.YieldYakAVAXStrategy,
    ['0x60781C2586D68229fde47564546784ab3fACA982']: addresses.YieldYakStrategy,
    ['0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7']: addresses.YieldYakStrategy,
    ['0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd']: addresses.YieldYakStrategy,
    ['0xd586e7f844cea2f87f50152665bcbc2c279d8d70']: addresses.YieldYakStrategy,
    ['0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5']: addresses.YieldYakStrategy,
    ['0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664']: addresses.YieldYakStrategy,
    ['0xA389f9430876455C36478DeEa9769B7Ca4E3DDB1']: addresses.YieldYakStrategy,
    ['0xeD8CBD9F0cE3C6986b22002F03c6475CEb7a6256']: addresses.YieldYakStrategy,
    ['0x454E67025631C065d3cFAD6d71E6892f74487a15']:
      addresses.TraderJoeMasterChefStrategy,
    ['0x2148D1B21Faa7eb251789a51B404fc063cA6AAd6']:
      addresses.SimpleHoldingStrategy,
    ['0xCDFD91eEa657cc2701117fe9711C9a4F61FEED23']:
      addresses.MultiTraderJoeMasterChef3Strategy,
  };

  const masterChef2Tokens = [
    '0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33',
    '0xa389f9430876455c36478deea9769b7ca4e3ddb1',
    '0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256',
  ].map(getAddress);

  const tokens = Object.keys(token2Strat);
  tokens.push('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7');
  const strats = Object.values(token2Strat);
  strats.push(addresses.LiquidYieldStrategy);

  tokens.push('0x454E67025631C065d3cFAD6d71E6892f74487a15');
  strats.push(addresses.YieldYakStrategy);

  const globalMoneyAvailable = globalDebtCeiling.sub(totalSupply);

  tokens.push('0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd');
  strats.push(addresses.sJoeStrategy);

  React.useEffect(() => {
    async function getData() {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://api.avax.network/ext/bc/C/rpc'
      );

      const stratViewer = new ethers.Contract(
        addresses.StrategyViewer,
        StrategyViewer.abi,
        provider
      );

      const normalResults = await stratViewer.viewMetadata(
        addresses.StableLending,
        tokens,
        strats
      );
      const noHarvestBalanceResults =
        await stratViewer.viewMetadataNoHarvestBalance(
          addresses.StableLending,
          addresses.OracleRegistry,
          addresses.Stablecoin,
          masterChef2Tokens,
          Array(masterChef2Tokens.length).fill(
            addresses.TraderJoeMasterChef2Strategy
          )
        );

      const results = [...normalResults, ...noHarvestBalanceResults];

      const reduceFn = (result: StrategyMetadata, row: RawStratMetaRow) => {
        const parsedRow = parseStratMeta(
          chainId ?? 43114,
          row,
          stable,
          balancesCtx,
          yyMetadata,
          globalMoneyAvailable,
          yieldMonitor,
          additionalYieldData
        );

        return parsedRow
          ? {
              ...result,
              [parsedRow.token.address]: {
                [parsedRow.strategyAddress]: parsedRow,
                ...(result[parsedRow.token.address] || {}),
              },
            }
          : result;
      };

      setStratMeta(results?.reduce(reduceFn, {}) ?? {});
    }
    if (
      chainId &&
      stable &&
      balancesCtx &&
      yyMetadata &&
      globalMoneyAvailable != 0 &&
      yieldMonitor &&
      Object.values(stratMeta).length === 0
    ) {
      getData();
    }
  }, [
    chainId,
    stable,
    balancesCtx,
    yyMetadata,
    globalMoneyAvailable,
    yieldMonitor,
    stratMeta,
  ]);

  return stratMeta;
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
  trancheContract: string;
  liquidateButton?: boolean;
  positionHealth?: string;
  positionHealthColor?: string;
  parsedPositionHealth?: string;
  positionHealthOrder?: number;
};

export type RawPositionMetaRow = {
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
  const debtNum = parseFloatCurrencyValue(debt);
  const colNum = parseFloatCurrencyValue(collateral);

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

export function parsePositionMeta(
  row: RawPositionMetaRow,
  stable: Token,
  trancheContract: string
): ParsedPositionMetaRow {
  const debt = new CurrencyValue(stable, row.debt);
  const posYield = new CurrencyValue(stable, row.yield);
  const collateral =
    tokenAmount(stable.chainId, row.token, row.collateral) ??
    new CurrencyValue(
      new Token('', '', stable.chainId, row.token),
      row.collateral
    );

  const borrowablePercent = row.borrowablePer10k.toNumber() / 100;

  return {
    trancheContract,
    trancheId: row.trancheId.toNumber(),
    strategy: row.strategy,
    debt,
    collateral,
    token: getTokenFromAddress(stable.chainId, row.token)!,
    yield: posYield,
    collateralValue: new CurrencyValue(stable, row.collateralValue),
    borrowablePercent,
    owner: row.owner,
    liquidationPrice: debt.gt(posYield)
      ? calcLiquidationPrice(borrowablePercent, debt.sub(posYield), collateral!)
      : 0,
  };
}

export type TokenStratPositionMetadata = Record<
  string,
  ParsedPositionMetaRow[]
>;
export function useIsolatedPositionMetadata(
  account: string
): TokenStratPositionMetadata {
  const { legacy, current } = useIsolatedLendingView(
    'viewPositionsByOwner',
    [account],
    []
  );
  const stable = useStable();

  function reduceFn(trancheContract: string) {
    return (result: TokenStratPositionMetadata, row: RawPositionMetaRow) => {
      const parsedRow = parsePositionMeta(row, stable, trancheContract);
      const tokenAddress = parsedRow.token?.address;
      const list = result[tokenAddress] || [];
      return {
        ...result,
        [tokenAddress]: [...list, parsedRow],
      };
    };
  }

  const addresses = useAddresses();
  const legacyResults =
    'IsolatedLending' in addresses
      ? legacy.reduce(reduceFn(addresses.IsolatedLending), {})
      : {};
  return 'StableLending' in addresses
    ? current.reduce(reduceFn(addresses.StableLending), legacyResults)
    : legacyResults;
}

export function xMoreTotalSupply(
  method: string,
  args: any[],
  defaultResult: any
) {
  const address = useAddresses().xMore;
  const abi = new Interface(xMore.abi);
  return (useContractCall({
    abi,
    address,
    method,
    args,
  }) ?? [defaultResult])[0];
}

export function useGlobalDebtCeiling(
  method: string,
  args: any[],
  defaultResult: any
) {
  const address = useAddresses().Stablecoin;
  const abi = new Interface(Stablecoin.abi);
  return (useContractCall({
    abi,
    address,
    method,
    args,
  }) ?? [defaultResult])[0];
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
  const endPeriod = 1 + Math.round(Date.now() / 1000 / ONE_WEEK_SECONDS);
  const startPeriod = Math.floor(timeStart / 1000 / ONE_WEEK_SECONDS) - 2;
  // console.log('endPeriod', endPeriod);
  // console.log('startPeriod', startPeriod);
  const stable = useStable();
  const addresses = useAddresses();

  function args(trancheContract: string) {
    return Array(endPeriod - startPeriod)
      .fill(startPeriod)
      .map((x, i) => ({
        abi: new Interface(IsolatedLending.abi),
        address: trancheContract,
        method: 'viewPositionsByTrackingPeriod',
        args: [x + i],
      }));
  }

  const legacyRows =
    (useContractCalls(
      args(addresses.IsolatedLending)
    ) as RawPositionMetaRow[][][]) || [];
  const currentRows =
    (useContractCalls(
      args(addresses.StableLending)
    ) as RawPositionMetaRow[][][]) || [];

  function parseRows(rows: RawPositionMetaRow[][][], trancheContract: string) {
    return rows
      .flatMap((x) => x)
      .flatMap((x) => x)
      .filter((x) => x)
      .map((row) => parsePositionMeta(row, stable, trancheContract));
  }
  return [
    ...((legacyRows.length > 0 &&
      parseRows(legacyRows, addresses.IsolatedLending)) ||
      []),
    ...((currentRows.length > 0 &&
      parseRows(currentRows, addresses.StableLending)) ||
      []),
  ];
}

export function useUpdatedMetadataLiquidatablePositions(
  positions?: ParsedPositionMetaRow[]
) {
  const abi = {
    [useAddresses().IsolatedLending]: new Interface(IsolatedLending.abi),
    [useAddresses().StableLending]: new Interface(StableLending.abi),
  };

  const positionCalls: ContractCall[] = positions!.map((pos) => {
    return {
      abi: abi[pos.trancheContract],
      address: pos.trancheContract,
      method: 'viewPositionMetadata',
      args: [pos.trancheId],
    };
  });

  const updatedData = useContractCalls(positionCalls);

  return updatedData.filter((x) => x !== undefined);
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
  // console.log('calls', calls);
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
  rewards: BigNumber;
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
  rewards: CurrencyValue;
  totalRewards: CurrencyValue;
};

// function unifyRewards(account?: string): BigNumber {
//   const lcAccount = account ? account.toLowerCase() : undefined;
//   const earned =
//     lcAccount && lcAccount in earnedRewards
//       ? BigNumber.from(earnedRewards[lcAccount as keyof typeof earnedRewards])
//       : BigNumber.from(0);

//   const rewards =
//     lcAccount && lcAccount in rewardsRewards
//       ? BigNumber.from(rewardsRewards[lcAccount as keyof typeof rewardsRewards])
//       : BigNumber.from(0);

//   // console.log('unifying', formatEther(earned), formatEther(rewards));

//   return earned.add(rewards);
// }

export function useParsedStakingMetadata(
  stakingContracts: string[],
  account?: string
): ParsedStakingMetadata[] {
  const { chainId } = useEthers();
  const stable = useStable();
  return useStakingMetadata(stakingContracts, account)
    .filter((x) => x)
    .filter(([x]) => x)
    .map(([stakingMeta]: [RawStakingMetadata], i) => {
      const stakingToken = getTokenFromAddress(
        chainId,
        stakingMeta.stakingToken
      )!;
      const rewardsToken = getTokenFromAddress(
        chainId,
        stakingMeta.rewardsToken
      )!;

      const earned = new CurrencyValue(rewardsToken, stakingMeta.earned);
      const rewards = new CurrencyValue(rewardsToken, stakingMeta.rewards);
      // console.log('unifying with earned', formatEther(earned.value));

      const rawTotalRewards = earned.add(rewards);
      const totalRewards = rawTotalRewards;
      // i === 0
      //   ? new CurrencyValue(
      //       rewardsToken,
      //       rawTotalRewards.value.add(
      //         rawTotalRewards.value.sub(unifyRewards(account)).mul(4)
      //       )
      //     )
      //   : rawTotalRewards;

      const rawAprPercent = (100 * stakingMeta.aprPer10k.toNumber()) / 10000;
      const aprPercent = rawAprPercent; //i === 0 ? rawAprPercent * 5 : rawAprPercent;

      return {
        stakingToken,
        rewardsToken,
        totalSupply: new CurrencyValue(stakingToken, stakingMeta.totalSupply),
        tvl: new CurrencyValue(stable, stakingMeta.tvl),
        aprPercent,
        vestingCliff: timestamp2Date(stakingMeta.vestingCliff),
        periodFinish: timestamp2Date(stakingMeta.periodFinish),
        stakedBalance: new CurrencyValue(
          stakingToken,
          stakingMeta.stakedBalance
        ),
        vestingStart: timestamp2Date(stakingMeta.vestingStart),
        earned,
        vested: new CurrencyValue(rewardsToken, stakingMeta.vested),
        rewards,
        totalRewards,
      };
    });
}

export function useSpecialRewardsData(account: string) {
  const addresses = useAddresses();
  const address = addresses.VestingLaunchReward;
  const abi = new Interface(VestingLaunchReward.abi);
  const { chainId } = useEthers();
  const moreToken = getTokenFromAddress(chainId, addresses.MoreToken);

  const balance = (useContractCall({
    address,
    abi,
    method: 'balanceOf',
    args: [account],
  }) ?? [BigNumber.from(0)])[0];

  const vested = (useContractCall({
    address,
    abi,
    method: 'burnableByAccount',
    args: [account],
  }) ?? [BigNumber.from(0)])[0];

  return {
    balance: new CurrencyValue(moreToken, balance),
    vested: new CurrencyValue(moreToken, vested),
  };
}

function timestamp2Date(tstamp: BigNumber) {
  return new Date(tstamp.toNumber() * 1000);
}

export function useCurvePoolSLDeposited() {
  const addressCurvePool = useAddresses().CurvePoolSL;
  const addressCurvePool2 = useAddresses().CurvePoolSL2;

  const balance1 = (useContractCall({
    address: useAddresses().CurvePool,
    abi: new Interface(ERC20.abi),
    method: 'balanceOf',
    args: [addressCurvePool],
  }) ?? [BigNumber.from(0)])[0];

  const balance2 = (useContractCall({
    address: useAddresses().CurvePool,
    abi: new Interface(ERC20.abi),
    method: 'balanceOf',
    args: [addressCurvePool2],
  }) ?? [BigNumber.from(0)])[0];

  return balance1.add(balance2);
}
