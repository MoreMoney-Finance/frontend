import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from '@ethersproject/units';
import {
  Call,
  ChainId,
  CurrencyValue,
  ERC20Interface,
  Token,
  useCall,
  useCalls,
  useEthers,
} from '@usedapp/core';
import { BigNumber, Contract, ethers } from 'ethers';
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
import InterestRateController from '../contracts/artifacts/contracts/InterestRateController.sol/InterestRateController.json';
import OracleRegistry from '../contracts/artifacts/contracts/OracleRegistry.sol/OracleRegistry.json';
import iMoney from '../contracts/artifacts/contracts/rewards/iMoney.sol/iMoney.json';
import VestingLaunchReward from '../contracts/artifacts/contracts/rewards/VestingLaunchReward.sol/VestingLaunchReward.json';
import VestingStakingRewards from '../contracts/artifacts/contracts/rewards/VestingStakingRewards.sol/VestingStakingRewards.json';
import Stablecoin from '../contracts/artifacts/contracts/Stablecoin.sol/Stablecoin.json';
import StableLending2 from '../contracts/artifacts/contracts/StableLending2.sol/StableLending2.json';
import NFTContract from '../contracts/artifacts/contracts/NFTContract.sol/NFTContract.json';
import YieldConversionStrategy from '../contracts/artifacts/contracts/strategies/YieldConversionStrategy.sol/YieldConversionStrategy.json';
import StrategyViewer from '../contracts/artifacts/contracts/StrategyViewer.sol/StrategyViewer.json';
import IFeeReporter from '../contracts/artifacts/interfaces/IFeeReporter.sol/IFeeReporter.json';
import StableLending2InterestForwarder from '../contracts/artifacts/contracts/rewards/StableLending2InterestForwarder.sol/StableLending2InterestForwarder.json';
import IStrategy from '../contracts/artifacts/interfaces/IStrategy.sol/IStrategy.json';
import { getContractNames, parseFloatCurrencyValue, sqrt } from '../utils';
import { getTokenFromAddress, tokenAmount } from './tokens';
import { useCoingeckoPrice } from '@usedapp/coingecko';
import {
  masterPlatypusPool,
  tokenPerSecMoneyAddress,
  tokenPerSecUSDCAddress,
  tvlMoneyAddress,
  tvlUSDCAddress,
} from '../constants/platypus-pool';
import { handleCallResultDefault } from './wrapper';
import { JLPMasterMore, WAVAX } from '../constants/addresses';
import MasterMore from '../contracts/artifacts/contracts/rewards/MasterMore.sol/MasterMore.json';
import { useAPRforPTPPoolInPTP, useBalanceOfVeMoreToken } from './transactions';
import { strategyNames } from '../constants/strategies-naming';
import { underlyingYield } from '../constants/underlying-yield';
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
  DirectFlashLiquidation: string;
  LPTFlashLiquidation: string;

  MoreToken: string;
  xMore: string;

  StableLendingLiquidation: string;
  DirectFlashStableLiquidation: string;
  DirectFlashStable2Liquidation: string;
  LPTFlashStableLiquidation: string;
  LPTFlashStable2Liquidation: string;
  wsMAXIStableLiquidation: string;
  xJoeStableLiquidation: string;
  WrapNativeStableLending: string;
  sJoeStrategy: string;

  VestingLaunchReward: string;

  CurvePool: string;
  CurvePoolSL: string;
  CurvePoolSL2: string;
  StrategyViewer: string;
  LegacyStrategyViewer: string;

  LiquidYieldStrategy: string;
  MultiTraderJoeMasterChef3Strategy: string;
  InterestRateController: string;
  VeMoreToken: string;
  VeMoreStaking: string;
  StableLending2: string;
  YieldYakAVAXStrategy2: string;
  AltYieldYakAVAXStrategy2: string;
  YieldYakStrategy2: string;
  WrapNativeStableLending2: string;
  StableLending2Liquidation: string;
  StableLending2InterestForwarder: string;
  iMoney: string;
  OldYieldYakAVAXStrategy2: string;
  CurvePoolRewards: string;
  StableLending: string;

  AltYieldYakStrategy2: string;
  YieldYakPermissiveStrategy2: string;
  MasterMore: string;
  BigMigrateStableLending2: string;
  YieldYakCompounderStrategy: string;
  NFTContract: string;
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

  const abi = new Interface(StableLending2.abi);
  const contract = new Contract(addresses.StableLending2, abi);
  return {
    legacy: handleCallResultDefault(
      useCall({
        contract,
        method,
        args,
      }),
      defaultResult,
      'legacy isolated lending view'
    ),
    current: handleCallResultDefault(
      useCall({
        contract,
        method,
        args,
      }),
      defaultResult,
      'current isolated lending view'
    ),
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
  underlyingAPY?: number;
  underlyingStrategy: string;
  underlyingStrategyName: string | undefined;
};

function parseStratMeta(
  chainId: ChainId,
  row: RawStratMetaRow,
  stable: Token,
  balancesCtx: Map<string, CurrencyValue>,
  yyMetadata: YYMetadata,
  globalMoneyAvailable: BigNumber,
  yieldMonitor: Record<string, YieldMonitorMetadata>,
  additionalYield: Record<string, Record<string, number>>,
  underlyingStrategyName: string | undefined,
  underlyingAPYs: Record<string, number>
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
              ?.totalApy *
              0.65 *
              0.8) /
            0.5
          : (yieldMonitor['0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d']
              ?.totalApy *
              0.3 *
              0.2) /
              0.5 +
            7.2
        : underlyingAddress in yyMetadata
        ? yyMetadata[underlyingAddress]?.apy * 0.9
        : token.address in yieldMonitor
        ? yieldMonitor[token.address]?.totalApy
        : token.address in additionalYield &&
          strategyAddress in additionalYield[token.address]
        ? additionalYield[token.address][strategyAddress]
        : 0;
    const selfRepayingAPY =
      row.yieldType === 0
        ? strategyAddress === addresses[chainId].LiquidYieldStrategy
          ? token.address === '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
            ? ((yieldMonitor['0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d']
                ?.totalApy -
                parseFloat(
                  yieldMonitor[
                    '0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d'
                  ]?.apy.toString()
                )) *
                0.65 *
                0.8) /
              0.5
            : ((yieldMonitor['0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d']
                ?.totalApy -
                parseFloat(
                  yieldMonitor[
                    '0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d'
                  ]?.apy.toString()
                )) *
                0.3 *
                0.2) /
              0.5
          : token.address in yieldMonitor
          ? yieldMonitor[token.address]?.totalApy -
            parseFloat(yieldMonitor[token.address]?.apy.toString())
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
        ? parseFloat(yieldMonitor[token.address]?.apy.toString())
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
      underlyingAPY: underlyingAPYs[row.token],
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
      underlyingStrategy: underlyingAddress,
      underlyingStrategyName,
    };
  }
}

export function useIsTimeLimitOver(defaultResult: boolean) {
  const addresses = useAddresses();
  const abi = new Interface(NFTContract.abi);
  const contract = new Contract(addresses.NFTContract, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'isTimeLimitOver',
      args: [],
    }),
    defaultResult,
    'useIsTimeLimitOver'
  );
}

export function useHasMinimumDebt(defaultResult: boolean) {
  const addresses = useAddresses();
  const abi = new Interface(NFTContract.abi);
  const contract = new Contract(addresses.NFTContract, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'hasMinimumDebt',
      args: [],
    }),
    defaultResult,
    'useHasMinimumDebt'
  );
}

export function useHasAvailableNFT(defaultResult: boolean) {
  const addresses = useAddresses();
  const abi = new Interface(NFTContract.abi);
  const contract = new Contract(addresses.NFTContract, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'hasAvailableNFT',
      args: [],
    }),
    defaultResult,
    'useHasAvailableNFT'
  );
}

export function useTokenIdByTrancheId(
  trancheId: number,
  defaultResult: number
) {
  const addresses = useAddresses();
  const abi = new Interface(NFTContract.abi);
  const contract = new Contract(addresses.NFTContract, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'tokenIdByTrancheId',
      args: [trancheId],
    }),

    defaultResult,
    'usetokenIdByTrancheId',
    true
  );
}

export function useHasDuplicateNFTs(defaultResult: boolean) {
  const addresses = useAddresses();
  const abi = new Interface(NFTContract.abi);
  const contract = new Contract(addresses.NFTContract, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'hasDuplicateNFTs',
      args: [],
    }),
    defaultResult,
    'useHasDuplicateNFTs'
  );
}

export function useTotalDebt(defaultResult: any) {
  const addresses = useAddresses();
  const abi = new Interface(StableLending2.abi);
  const contract = new Contract(addresses.StableLending2, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'totalDebt',
      args: [],
    }),
    defaultResult,
    'useTotalDebt'
  );
}

export type IMoneyAccountInfo = {
  depositAmount: BigNumber;
  lastCumulRewardSimple: number;
  lastCumulRewardWeighted: number;
  factor: BigNumber;
};
export function useIMoneyAccountInfo(account: string): IMoneyAccountInfo {
  const addresses = useAddresses();
  const abi = new Interface(iMoney.abi);
  const contract = new Contract(addresses.iMoney, abi);
  const res = handleCallResultDefault(
    useCall({
      contract,
      method: 'accounts',
      args: [account],
    }),
    {},
    'useIMoneyAccountInfo',
    true
  );

  return {
    depositAmount: res?.depositAmount ?? BigNumber.from(0),
    lastCumulRewardSimple: res?.lastCumulRewardSimple ?? 0,
    lastCumulRewardWeighted: res?.lastCumulRewardWeighted ?? 0,
    factor: res?.factor ?? BigNumber.from(0),
  };
}

export function useIMoneyTotalWeights(defaultResult: any) {
  const addresses = useAddresses();
  const abi = new Interface(iMoney.abi);
  const contract = new Contract(addresses.iMoney, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'totalWeights',
      args: [],
    }),
    defaultResult,
    'useIMoneyTotalWeights'
  );
}

export function useBoostedSharePer10k(defaultResult: any) {
  const addresses = useAddresses();
  const abi = new Interface(iMoney.abi);
  const contract = new Contract(addresses.iMoney, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'boostedSharePer10k',
      args: [],
    }),
    defaultResult,
    'useBoostedSharePer10k'
  );
}

export function useInterestRate(defaultResult: any) {
  const addresses = useAddresses();
  const abi = new Interface(InterestRateController.abi);
  const contract = new Contract(addresses.InterestRateController, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'currentRatePer10k',
      args: [],
    }),
    defaultResult,
    'useInterestRate'
  );
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

const requestedStrategyNames = new Set<string>();
let underlyingStrategyNames = new Map<string, string>();

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
  const { yyAvaxAPY, yyMetadata, yieldMonitor, additionalYieldData } =
    useContext(ExternalMetadataContext);
  const apr = useAPRforPTPPoolInPTP();
  const yyAvaxPlatypusAPY = apr
    ? parseFloat(formatUnits(apr.baseAPR.add(apr.boostedAPR), 8)) + yyAvaxAPY
    : 0;

  const addresses = useAddresses();

  const token2Strat = {
    ['0xE5e9d67e93aD363a50cABCB9E931279251bBEFd0']: addresses.YieldYakStrategy2,
    ['0x152b9d0FdC40C096757F570A51E494bd4b943E50']: addresses.YieldYakStrategy2,
    ['0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE']: addresses.YieldYakStrategy2,
    ['0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7']:
      addresses.YieldYakAVAXStrategy2,
    ['0x9e295B5B976a184B14aD8cd72413aD846C299660']:
      addresses.YieldYakPermissiveStrategy2,
    ['0xF7D9281e8e363584973F946201b82ba72C965D27']:
      addresses.SimpleHoldingStrategy,
    ['0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd']:
      addresses.AltYieldYakStrategy2,
  };

  // const masterChef2Tokens = [
  //   '0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33',
  //   '0xa389f9430876455c36478deea9769b7ca4e3ddb1',
  //   '0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256',
  // ].map(getAddress);

  const tokens = Object.keys(token2Strat);
  const strats = Object.values(token2Strat);

  tokens.push('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7');
  strats.push(addresses.AltYieldYakAVAXStrategy2);
  tokens.push('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7');
  strats.push(addresses.OldYieldYakAVAXStrategy2);
  tokens.push('0x152b9d0FdC40C096757F570A51E494bd4b943E50');
  strats.push(addresses.AltYieldYakStrategy2);
  tokens.push('0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE');
  strats.push(addresses.AltYieldYakStrategy2);
  tokens.push('0xF7D9281e8e363584973F946201b82ba72C965D27');
  strats.push(addresses.YieldYakStrategy2);
  tokens.push('0xF7D9281e8e363584973F946201b82ba72C965D27');
  strats.push(addresses.YieldYakCompounderStrategy);

  const globalMoneyAvailable = globalDebtCeiling.sub(totalSupply);

  React.useEffect(() => {
    const underlyingAddresses = new Set(
      Object.values(stratMeta)
        .flatMap((rowsPerToken) =>
          Object.values(rowsPerToken).map((row) => row.underlyingStrategy)
        )
        .filter((x) => x)
    );

    for (const extant of requestedStrategyNames) {
      underlyingAddresses.delete(extant);
    }

    if (underlyingAddresses.size > 0) {
      for (const newAddress of underlyingAddresses) {
        requestedStrategyNames.add(newAddress);
      }
      getContractNames(underlyingAddresses).then((names) => {
        const newUnderlyingNames = new Map([
          ...underlyingStrategyNames,
          ...names,
        ]);
        underlyingStrategyNames = newUnderlyingNames;
        setStratMeta(
          Object.fromEntries(
            Object.entries(stratMeta).map(([t, rows]) => [
              t,
              Object.fromEntries(
                Object.entries(rows).map(([s, row]) => [
                  s,
                  {
                    ...row,
                    underlyingStrategyName:
                      strategyNames[row.underlyingStrategy] ??
                      newUnderlyingNames.get(row.underlyingStrategy),
                  },
                ])
              ),
            ])
          )
        );
      });
    }
  }, [stratMeta]);

  React.useEffect(() => {
    async function getData() {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://api.avax.network/ext/bc/C/rpc'
      );

      const stratViewer = new ethers.Contract(
        addresses.StrategyViewer,
        new Interface(StrategyViewer.abi),
        provider
      );
      const normalResults = await stratViewer.viewMetadata(
        addresses.StableLending2,
        tokens,
        strats
      );
      // const noHarvestBalanceResults =
      //   await stratViewer.viewMetadataNoHarvestBalance(
      //     addresses.StableLending2,
      //     addresses.OracleRegistry,
      //     addresses.Stablecoin,  const [underlyingStrategyNames, setUnderLyingStrategyNames] = React.useState(new Map<string, string>());
      //     masterChef2Tokens,
      //     []
      //     // Array(masterChef2Tokens.length).fill(
      //     //   addresses.TraderJoeMasterChef2Strategy
      //     // )
      //   );

      // const results = [...normalResults, ...noHarvestBalanceResults];
      const results = [...normalResults];

      const reduceFn = (result: StrategyMetadata, row: RawStratMetaRow) => {
        const parsedRow = parseStratMeta(
          chainId ?? 43114,
          row,
          stable,
          balancesCtx,
          yyMetadata,
          globalMoneyAvailable,
          yieldMonitor,
          additionalYieldData,
          row.underlyingStrategy &&
            underlyingStrategyNames.get(row.underlyingStrategy),
          {
            ...underlyingYield,
            '0xF7D9281e8e363584973F946201b82ba72C965D27':
              row.strategy === addresses.YieldYakCompounderStrategy
                ? 0
                : yyAvaxAPY,
          }
        );

        return parsedRow
          ? {
              ...result,
              [parsedRow.token.address]: {
                [parsedRow.strategyAddress]: {
                  ...parsedRow,
                  APY:
                    parsedRow.strategyAddress ===
                    addresses.YieldYakCompounderStrategy
                      ? yyAvaxPlatypusAPY
                      : parsedRow.APY,
                },
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
    underlyingStrategyNames,
  ]);

  return stratMeta;
}

export function useLegacyIsolatedStrategyMetadata(): StrategyMetadata {
  const [legacyStratMeta, setLegacyStratMeta] = useState<StrategyMetadata>({});
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

  //legacy
  const legacyToken2Strat = {
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
  // const masterChef2Tokens = [
  //   '0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33',
  //   '0xa389f9430876455c36478deea9769b7ca4e3ddb1',
  //   '0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256',
  // ].map(getAddress);

  const legacyTokens = Object.keys(legacyToken2Strat);
  const legacyStrats = Object.values(legacyToken2Strat);

  //legacy
  legacyTokens.push('0x454E67025631C065d3cFAD6d71E6892f74487a15');
  legacyStrats.push(addresses.YieldYakStrategy);
  legacyTokens.push('0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd');
  legacyStrats.push(addresses.sJoeStrategy);

  const globalMoneyAvailable = globalDebtCeiling.sub(totalSupply);

  React.useEffect(() => {
    async function getData() {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://api.avax.network/ext/bc/C/rpc'
      );

      const stratViewer = new ethers.Contract(
        addresses.LegacyStrategyViewer,
        new Interface(StrategyViewer.abi),
        provider
      );
      const normalResults = await stratViewer.viewMetadata(
        addresses.StableLending,
        legacyTokens,
        legacyStrats
      );

      const results = [...normalResults];

      const reduceFn = (result: StrategyMetadata, row: RawStratMetaRow) => {
        const parsedRow = parseStratMeta(
          chainId ?? 43114,
          row,
          stable,
          balancesCtx,
          yyMetadata,
          globalMoneyAvailable,
          yieldMonitor,
          additionalYieldData,
          '0x0000000000000000000000000000000000000000',
          { '': 0 }
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

      setLegacyStratMeta(results?.reduce(reduceFn, {}) ?? {});
    }
    if (
      chainId &&
      stable &&
      balancesCtx &&
      yyMetadata &&
      globalMoneyAvailable != 0 &&
      yieldMonitor &&
      Object.values(legacyStratMeta).length === 0
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
    legacyStratMeta,
    underlyingStrategyNames,
  ]);

  return legacyStratMeta;
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
  const legacyResults = {};
  return current.reduce(reduceFn(addresses.StableLending2), legacyResults);
}
export function useCustomTotalSupply(address: string, defaultResult: any) {
  const contract = new Contract(address, ERC20Interface);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'totalSupply',
      args: [],
    }),
    defaultResult,
    'useCustomTotalSupply'
  );
}
export function iMoneyTotalSupply(defaultResult: any) {
  const address = useAddresses().iMoney;
  const abi = new Interface(iMoney.abi);
  const contract = new Contract(address, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'totalSupply',
      args: [],
    }),
    defaultResult,
    'iMoneyTotalSupply'
  );
}

export function xMoreTotalSupply(
  method: string,
  args: any[],
  defaultResult: any
) {
  const address = useAddresses().xMore;
  const abi = new Interface(xMore.abi);
  const contract = new Contract(address, abi);
  return (
    useCall({
      contract,
      method,
      args,
    }) ?? { value: [defaultResult] }
  ).value[0];
}

export function useGlobalDebtCeiling(
  method: string,
  args: any[],
  defaultResult: any
) {
  const address = useAddresses().Stablecoin;
  const abi = new Interface(Stablecoin.abi);
  const contract = new Contract(address, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method,
      args,
    }),
    defaultResult,
    'useGlobalDebtCeiling'
  );
}

export function useBalanceOfToken(
  address: string,
  args: any[],
  defaultResult: any
) {
  return handleCallResultDefault(
    useCall({
      contract: new Contract(address, ERC20Interface),
      method: 'balanceOf',
      args,
    }),
    defaultResult,
    'useBalanceOfToken'
  );
}

export function useTVLMasterMore() {
  /*
    Get lptBalance = JOELPT.balanceOf(MasterMore)
    TVL = priceOfLPTAmount(lptBalance)
  */
  const addresses = useAddresses();
  const lptBalance = handleCallResultDefault(
    useCall({
      contract: new Contract(JLPMasterMore, ERC20Interface),
      method: 'balanceOf',
      args: [addresses.MasterMore],
    }),
    BigNumber.from(0),
    'MasterMore useTVLMasterMore'
  );
  return usePriceOfLPTAmount(lptBalance);
}
export function usePriceOfLPTAmount(lptAmount: BigNumber) {
  /*
    Get wavaxPoolBalance = WAVAX.balanceOf(LPT)
    Get totalLPT = LPT.totalSupply()
    Get Avax price from coingecko
    return lptAmount * 2 * avaxPrice * wavaxPoolBalance
    To check: TVL = 2 * wavaxPoolBalance * lptBalance / totalLPT
  */
  const wavaxPoolBalance = handleCallResultDefault(
    useCall({
      contract: new Contract(WAVAX, ERC20Interface),
      method: 'balanceOf',
      args: [JLPMasterMore],
    }),
    BigNumber.from(1),
    'MasterMore usePriceOfLpTAmount'
  );
  const totalLPT = handleCallResultDefault(
    useCall({
      contract: new Contract(JLPMasterMore, ERC20Interface),
      method: 'totalSupply',
      args: [],
    }),
    BigNumber.from(1),
    'MasterMore usePriceOfLpTAmount'
  );
  const avaxPrice = useCoingeckoPrice('avalanche-2', 'usd') ?? 1;
  return (
    (parseFloat(formatEther(lptAmount)) *
      2 *
      parseFloat(avaxPrice.toString()) *
      parseFloat(formatEther(wavaxPoolBalance))) /
    parseFloat(formatEther(totalLPT.add(1)))
  );
}

export function useLPAPR(account: string | undefined | null) {
  /*
    Get morePerSec
    Get totalAllocPoint
    For the pool get poolInfo
    For the user get MasterMore.userInfo
    Express this using bignumber operations: poolRewardPerYear = 365 * 24 * 60 * 60 * poolInfo.allocPoint / totalAllocPoint
    Get the coingecko price of MORE
    Get MasterMore.dilutingRepartition
    baseAPR = MasterMore.dilutingRepartition() * 100 * poolRewardPerYear * coinGeckoPrice(MORE) / priceOfLPTAmount(LPT, LPT.balanceOf(MasterMore)) / 1000
    boostedAPR = MasterMore.nonDilutingRepartition() * 100 * poolRewardPerYiear * coinGeckoPrice(MORE) * MasterMore.userInfo(userAddress).factor / priceOfLPTAmount(LPT, LPT.balanceOf(MasterMore)) / poolInfo.sumOfFactors / 1000
  */
  const addresses = useAddresses();
  const abi = new Interface(MasterMore.abi);
  const contract = new Contract(addresses.MasterMore, abi);
  const totalAllocPoint = handleCallResultDefault(
    useCall({
      contract,
      method: 'totalAllocPoint',
      args: [],
    }),
    BigNumber.from(1),
    'useLPAPR totalAllocPoint'
  );
  const morePerSec = handleCallResultDefault(
    useCall({
      contract,
      method: 'morePerSec',
      args: [],
    }),
    BigNumber.from(0),
    'useLPAPR morePerSec'
  );
  const poolInfo = handleCallResultDefault(
    useCall({
      contract,
      method: 'poolInfo',
      args: [0],
    }),
    {
      allocPoint: BigNumber.from(1),
      sumOfFactors: BigNumber.from(1),
    },
    'useLPAPR poolInfo',
    true
  );
  const userInfo = handleCallResultDefault(
    useCall({
      contract,
      method: 'userInfo',
      args: [0, account],
    }),
    { factor: BigNumber.from(1), amount: BigNumber.from(0) },
    'useLPAPR userInfo',
    true
  );
  const poolRewardPerYear = poolInfo?.allocPoint
    .mul(morePerSec)
    .mul(365)
    .mul(24)
    .mul(60)
    .mul(60)
    .div(totalAllocPoint);
  const morePrice = parseFloat(useCoingeckoPrice('more-token', 'usd') ?? '1');
  const dilutingRepartition = handleCallResultDefault(
    useCall({
      contract,
      method: 'dilutingRepartition',
      args: [],
    }),
    BigNumber.from(1),
    'useLPAPR dilutingRepartition'
  );
  const nonDilutingRepartition = handleCallResultDefault(
    useCall({
      contract,
      method: 'nonDilutingRepartition',
      args: [],
    }),
    BigNumber.from(1),
    'useLPAPR nonDilutingRepartition'
  );
  const lptBalance = handleCallResultDefault(
    useCall({
      contract: new Contract(JLPMasterMore, ERC20Interface),
      method: 'balanceOf',
      args: [addresses.MasterMore],
    }),
    BigNumber.from(1),
    'MasterMore useTVLMasterMore'
  );
  const priceLPT = usePriceOfLPTAmount(lptBalance);

  const baseAPR =
    (dilutingRepartition *
      100 *
      parseFloat(formatEther(poolRewardPerYear)) *
      morePrice) /
    priceLPT /
    1000;

  const veMoreBalance = useBalanceOfVeMoreToken(account);
  const putativeDepositAmount = userInfo.amount.isZero()
    ? parseEther('10')
    : userInfo.amount;
  const factor = sqrt(putativeDepositAmount.mul(veMoreBalance));
  const boostedAPR =
    parseFloat(
      factor
        .mul(
          Math.round(
            nonDilutingRepartition *
              100 *
              parseFloat(formatEther(poolRewardPerYear)) *
              morePrice
          )
        )
        .mul(lptBalance)
        .div(poolInfo.sumOfFactors.add(1))
        .div(putativeDepositAmount)
        .toString()
    ) /
    priceLPT /
    1000;

  return { baseAPR, boostedAPR };
}

export function usePendingTokens(account: string | undefined | null) {
  const address = useAddresses().MasterMore;
  const abi = new Interface(MasterMore.abi);
  const contract = new Contract(address, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'pendingTokens',
      args: [0, account],
    }),
    { pendingMore: BigNumber.from(1) },
    'MasterMore usePendingTokens',
    true
  );
}

export function useLPStaked(account: string | undefined | null) {
  const address = useAddresses().MasterMore;
  const abi = new Interface(MasterMore.abi);
  const contract = new Contract(address, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'userInfo',
      args: [0, account],
    }),
    { amount: BigNumber.from(0) },
    'MasterMore useLPStaked',
    true
  );
}

export function usePlatypusAPR(account: string) {
  /*
  APR = (rewarder tokenPerSec * MORE price * 606024365 / (TVL in MONEY or USDC MONEY or USDC price) - 1 )* 100%
  tokenPerSec: from rewarder contract. 
    USDC rewarder: 0x032e09C819ed14314eD62Ea91c41151A228BdAb4 
    MONEY rewarder: 0x77286ac09F4e0b7E6D37B4B77cd2D0Fb6b49323D
  token price: from coingecko
  TVL: check balance from these contracts. 
    USDC: 0x551C259Bf4D88edFdAbb04179342a73dAa759583 
    MONEY: 0xE08947eE864Af325D9F98743B3b905875Ae0Ec99 
  */
  /*
    MasterPlatypus.ptpPerSec() * MasterPlatypus.poolInfo(pid).baseAllocPoint / MasterPlatypus.totalAllocPoints()
    our PIDs are:
      USDC: 5
      MONEY: 4
    MasterPlatypus is at: 0x7125b4211357d7c3a90f796c956c12c681146ebb
    you need to replace tokensPerSec with morePerSec and ptpPerSec and morePrice with ptpPrice (in the case of ptpPerSec), run the same formula on both and add them up 
*/
  const tokenPerSecUsdc = formatEther(
    useTokenPerSecPlatypus(tokenPerSecUSDCAddress, BigNumber.from(0))
  );
  const tokenPerSecMoney = formatEther(
    useTokenPerSecPlatypus(tokenPerSecMoneyAddress, BigNumber.from(0))
  );
  const ptpPerSec = formatEther(usePtpPerSec(BigNumber.from(0)));
  const totalAllocPoints = useTotalAllocPoints(BigNumber.from(0));
  const ptpPerSecMoney = useTokenPerSecPoolInfo(
    parseFloat(ptpPerSec.toString()),
    4,
    BigNumber.from(0),
    parseFloat(totalAllocPoints.toString())
  );
  const ptpPerSecUsdc = useTokenPerSecPoolInfo(
    parseFloat(ptpPerSec.toString()),
    5,
    BigNumber.from(0),
    parseFloat(totalAllocPoints.toString())
  );

  const morePrice = useCoingeckoPrice('more-token', 'usd');
  const ptpPrice = useCoingeckoPrice('platypus-finance', 'usd');
  const MoneyTVL = formatEther(
    useCustomTotalSupply(tvlMoneyAddress, BigNumber.from('0'))
  );
  const usdcTVL = formatUnits(
    useCustomTotalSupply(tvlUSDCAddress, BigNumber.from('0')),
    6
  ).toString();
  const APR_USDC_MORE = calculatePlatypusAPR(
    tokenPerSecUsdc,
    morePrice ?? '1',
    usdcTVL
  );
  const APR_MONEY_MORE = calculatePlatypusAPR(
    tokenPerSecMoney,
    morePrice ?? '1',
    MoneyTVL
  );

  const APR_USDC_PTP = calculatePlatypusAPR(
    ptpPerSecUsdc.toString(),
    ptpPrice ?? '1',
    usdcTVL
  );
  const APR_MONEY_PTP = calculatePlatypusAPR(
    ptpPerSecMoney.toString(),
    ptpPrice ?? '1',
    MoneyTVL
  );

  return {
    APR_MONEY: APR_MONEY_MORE + APR_MONEY_PTP,
    APR_USDC: APR_USDC_MORE + APR_USDC_PTP,
    MoneyTVL,
    usdcTVL,
  };
}
function calculatePlatypusAPR(
  tokenPerSecMoney: string,
  tokenPrice: string,
  tvl: string
) {
  return (
    ((parseFloat(tokenPerSecMoney.toString()) *
      parseFloat(tokenPrice.toString() ?? '1') *
      60 *
      60 *
      24 *
      365) /
      parseFloat(tvl)) *
    100
  );
}

function useTokenPerSecPoolInfo(
  ptpPerSec: number,
  poolId: number,
  defaultResult: any,
  totalAllocPoints: number
) {
  const abi = new Interface([
    {
      inputs: [{ name: '', type: 'uint256' }],
      name: 'poolInfo',
      outputs: [
        {
          name: 'lpToken',
          type: 'address',
        },
        {
          name: 'baseAllocPoint',
          type: 'uint256',
        },
        {
          name: 'lastRewardTimestamp',
          type: 'uint256',
        },
        {
          name: 'accPtpPerShare',
          type: 'uint256',
        },
        {
          name: 'rewarder',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ]);
  const contract = new Contract(masterPlatypusPool, abi);
  const res = handleCallResultDefault(
    useCall({
      contract,
      method: 'poolInfo',
      args: [poolId],
    }),
    {
      baseAllocPoint: defaultResult,
    },
    'useTokenPerSecPoolInfo',
    true
  );
  return (ptpPerSec * res.baseAllocPoint) / totalAllocPoints;
}

function useTotalAllocPoints(defaultResult: any) {
  const abi = new Interface([
    {
      inputs: [],
      name: 'totalBaseAllocPoint',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ]);
  const contract = new Contract(masterPlatypusPool, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'totalBaseAllocPoint',
      args: [],
    }),
    defaultResult,
    'useTotalAllocPoints'
  );
}

function usePtpPerSec(defaultResult: any) {
  const abi = new Interface([
    {
      inputs: [],
      name: 'ptpPerSec',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ]);
  const contract = new Contract(masterPlatypusPool, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'ptpPerSec',
      args: [],
    }),
    defaultResult,
    'usePtpPerSec'
  );
}

function useTokenPerSecPlatypus(address: string, defaultResult: any) {
  const abi = new Interface([
    {
      inputs: [],
      name: 'tokenPerSec',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ]);
  const contract = new Contract(address, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'tokenPerSec',
      args: [],
    }),
    defaultResult,
    'useTokenPerSecPlatypus'
  );
}

function useTreasurySharePer10k() {
  const contract = new Contract(
    useAddresses().StableLending2InterestForwarder,
    new Interface(StableLending2InterestForwarder.abi)
  );
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'treasurySharePer10k',
      args: [],
    }),
    BigNumber.from(5000),
    'useTreasurySharePer10k'
  );
}

export function useIMoneyAPR(account: string) {
  const totalDebt = useTotalDebt(BigNumber.from(0));
  const totalSupplyIMoney = useTotalSupplyIMoney(BigNumber.from(1));
  const currentRatePer10k = useInterestRate(BigNumber.from(0));
  const treasurySharePer10k = useTreasurySharePer10k().toNumber();
  const boostedSharePer10k = useBoostedSharePer10k(
    BigNumber.from(0)
  ).toNumber();
  const accountInfo = useIMoneyAccountInfo(account!);

  const putativeDepositAmount = accountInfo.depositAmount.isZero()
    ? parseEther('1000')
    : accountInfo.depositAmount;
  const weight = sqrt(accountInfo.factor.mul(putativeDepositAmount));
  const totalWeights = useIMoneyTotalWeights(parseEther('100'));

  const ratio =
    (totalDebt.mul(currentRatePer10k).div(totalSupplyIMoney).toNumber() *
      (10000 - treasurySharePer10k)) /
    10000 /
    10000;
  const baseRate = (100 * (ratio * (10000 - boostedSharePer10k))) / 10000;
  const boostedRate =
    (weight
      .mul(Math.round(ratio * boostedSharePer10k))
      .mul(totalSupplyIMoney)
      .div(totalWeights)
      .div(putativeDepositAmount)
      .toNumber() *
      100) /
    10000;

  const avgBoostedRate = (100 * (ratio * boostedSharePer10k)) / 10000;
  return { baseRate, boostedRate, avgBoostedRate };
}

export function useTotalSupplyIMoney(defaultResult: any) {
  const abi = new Interface(iMoney.abi);
  const contract = new Contract(useAddresses().iMoney, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'totalSupply',
      args: [],
    }),
    defaultResult,
    'useTotalSupplyIMoney'
  );
}

export function useTotalSupplyToken(
  address: string,
  method: string,
  args: any[],
  defaultResult: any
) {
  const abi = new Interface(ERC20.abi);
  const contract = new Contract(address, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method,
      args,
    }),
    defaultResult,
    'useTotalSupplyToken'
  );
}

export function useTotalSupply(
  method: string,
  args: any[],
  defaultResult: any
) {
  const address = useAddresses().Stablecoin;
  const abi = new Interface(ERC20.abi);
  const contract = new Contract(address, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method,
      args,
    }),
    defaultResult,
    'useTotalSupply'
  );
}

export function useYieldConversionStrategyView(
  strategyAddress: string,
  method: string,
  args: any[],
  defaultResult: any
) {
  const abi = new Interface(YieldConversionStrategy.abi);
  const contract = new Contract(strategyAddress, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method,
      args,
    }),
    defaultResult,
    'useYieldConversionStrategyView'
  );
}

const TWELVE_HOURS_SECONDS = 43200;
export function useUpdatedPositions(timeStart: number) {
  const endPeriod = 1 + Math.round(Date.now() / 1000 / TWELVE_HOURS_SECONDS);
  const startPeriod = Math.floor(timeStart / 1000 / TWELVE_HOURS_SECONDS) - 2;
  // console.log('endPeriod', endPeriod);
  // console.log('startPeriod', startPeriod);
  const stable = useStable();
  const addresses = useAddresses();
  const contract = new Contract(
    addresses.StableLending2,
    new Interface(StableLending2.abi)
  );

  function args(trancheContract: string) {
    return Array(endPeriod - startPeriod)
      .fill(startPeriod)
      .map((x, i) => ({
        contract,
        address: trancheContract,
        method: 'viewPositionsByTrackingPeriod',
        args: [x + i],
      }));
  }

  const currentRows =
    (useCalls(args(addresses.StableLending2)).map(
      (x) => (x ?? { value: undefined }).value
    ) as RawPositionMetaRow[][][]) || [];

  function parseRows(rows: RawPositionMetaRow[][][], trancheContract: string) {
    return rows
      .flatMap((x) => x)
      .flatMap((x) => x)
      .filter((x) => x)
      .map((row) => parsePositionMeta(row, stable, trancheContract));
  }
  return [
    ...((currentRows.length > 0 &&
      parseRows(currentRows, addresses.StableLending2)) ||
      []),
  ];
}

export function useUpdatedMetadataLiquidatablePositions(
  positions?: ParsedPositionMetaRow[]
) {
  const abi = {
    [useAddresses().StableLending2]: new Interface(StableLending2.abi),
  };

  const positionCalls: Call[] = positions!.map((pos) => {
    return {
      contract: new Contract(pos.trancheContract, abi[pos.trancheContract]),
      method: 'viewPositionMetadata',
      args: [pos.trancheId],
    };
  });

  const updatedData = useCalls(positionCalls).map(
    (x) => (x ?? { value: undefined }).value
  );

  return updatedData.filter((x) => x !== undefined);
}

export function useRegisteredOracle(tokenAddress?: string) {
  const address = useAddresses().OracleRegistry;
  const abi = new Interface(OracleRegistry.abi);
  const contract = new Contract(address, abi);
  const stable = useStable();
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'tokenOracle',
      args: [tokenAddress, stable.address],
    }),
    undefined,
    'useRegisteredOracle'
  );
}

export function useAllFeesEver(contracts: string[]) {
  function convert2ContractCall(contract: string) {
    return {
      contract: new Contract(contract, new Interface(IFeeReporter.abi)),
      method: 'viewAllFeesEver',
      args: [],
    };
  }

  const calls: Call[] = contracts.map(convert2ContractCall);
  // console.log('calls', calls);
  const results =
    useCalls(calls).map((x) => (x ?? { value: undefined }).value) ?? [];

  return results;
}

export function useEstimatedHarvestable(
  strategyAddress: string,
  tokenAddress: string
) {
  const abi = new Interface(IStrategy.abi);
  const contract = new Contract(strategyAddress, abi);
  return handleCallResultDefault(
    useCall({
      contract,
      method: 'viewEstimatedHarvestable',
      args: [tokenAddress],
    }),
    undefined,
    'useEstimatedHarvestable'
  );
}

export function useStakingMetadata(
  stakingContracts: string[],
  account?: string
): [RawStakingMetadata][] {
  const abi = new Interface(VestingStakingRewards.abi);
  const userAccount = account ?? ethers.constants.AddressZero;

  const calls: Call[] = stakingContracts.map((address) => ({
    contract: new Contract(address, abi),
    method: 'stakingMetadata',
    args: [userAccount],
  }));

  let contractCalls2 = useCalls(calls);
  const results = (contractCalls2.map(
    (x) => (x ?? { value: undefined }).value
  ) ?? []) as unknown as [RawStakingMetadata][];
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
  const contract = new Contract(address, abi);

  const balance = handleCallResultDefault(
    useCall({
      contract,
      method: 'balanceOf',
      args: [account],
    }),
    BigNumber.from(0),
    'useSpecialRewardsData | balance'
  );

  const vested = handleCallResultDefault(
    useCall({
      contract,
      method: 'burnableByAccount',
      args: [account],
    }),
    BigNumber.from(0),
    'useSpecialRewardsData | vested'
  );

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
  const contract = new Contract(
    useAddresses().CurvePool,
    new Interface(ERC20.abi)
  );
  const balance1 = handleCallResultDefault(
    useCall({
      contract,
      method: 'balanceOf',
      args: [addressCurvePool],
    }),
    BigNumber.from(0),
    'useCurvePoolSLDeposited | balance1'
  );

  const balance2 = handleCallResultDefault(
    useCall({
      contract,
      method: 'balanceOf',
      args: [addressCurvePool2],
    }),
    BigNumber.from(0),
    'useCurvePoolSLDeposited | balance2'
  );

  return balance1.add(balance2);
}
