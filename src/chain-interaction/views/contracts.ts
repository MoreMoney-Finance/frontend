import {
  ChainId,
  ContractCall,
  useContractCall,
  useContractCalls,
  useEthers,
} from '@usedapp/core';
import { BigNumber } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import ERC20 from '../../contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import IsolatedLending from '../../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json';
import OracleRegistry from '../../contracts/artifacts/contracts/OracleRegistry.sol/OracleRegistry.json';
import Stablecoin from '../../contracts/artifacts/contracts/Stablecoin.sol/Stablecoin.json';
import YieldConversionStrategy from '../../contracts/artifacts/contracts/strategies/YieldConversionStrategy.sol/YieldConversionStrategy.json';
import IFeeReporter from '../../contracts/artifacts/interfaces/IFeeReporter.sol/IFeeReporter.json';
import { getTokenFromAddress } from '../tokens';

// import earnedRewards from '../constants/earned-rewards.json';
// import rewardsRewards from '../constants/rewards-rewards.json';

/* eslint-disable */
export const addresses: Record<
  string,
  DeploymentAddresses
> = require('../../contracts/addresses.json');

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

  CurvePoolSL: string;
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

export function useCurvePoolSLDeposited() {
  // const address = useAddresses().CurvePoolSL;
  return 0;
}
