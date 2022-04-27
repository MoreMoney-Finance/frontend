import { Contract } from '@ethersproject/contracts';
import IERC20 from '@openzeppelin/contracts/build/contracts/IERC20.json';
import {
  ChainId,
  ContractCall,
  useContractCall,
  useContractCalls,
  useContractFunction,
  useEthers,
} from '@usedapp/core';
import { parseEther } from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber, ethers } from 'ethers';
import { getAddress, Interface } from 'ethers/lib/utils';
import ERC20 from '../../contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import IsolatedLending from '../../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json';
import OracleRegistry from '../../contracts/artifacts/contracts/OracleRegistry.sol/OracleRegistry.json';
import Stablecoin from '../../contracts/artifacts/contracts/Stablecoin.sol/Stablecoin.json';
import StableLending from '../../contracts/artifacts/contracts/StableLending.sol/StableLending.json';
import AMMYieldConverter from '../../contracts/artifacts/contracts/strategies/AMMYieldConverter.sol/AMMYieldConverter.json';
import YieldConversionStrategy from '../../contracts/artifacts/contracts/strategies/YieldConversionStrategy.sol/YieldConversionStrategy.json';
import YieldYakStrategy from '../../contracts/artifacts/contracts/strategies/YieldYakStrategy.sol/YieldYakStrategy.json';
import IFeeReporter from '../../contracts/artifacts/interfaces/IFeeReporter.sol/IFeeReporter.json';
import { getTokenFromAddress } from '../tokens';

// import earnedRewards from '../constants/earned-rewards.json';
// import rewardsRewards from '../constants/rewards-rewards.json';

/* eslint-disable */
export const addresses: Record<
  string,
  DeploymentAddresses
> = require('../../contracts/addresses.json');

const COMPOUNDING = 52;

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

export function useWithdrawFees(strategyAddress: string, tokenAddress: string) {
  const contractsABI: Record<string, any> = {
    [useAddresses().YieldYakStrategy]: new Interface(YieldYakStrategy.abi),
    [useAddresses().StableLending]: new Interface(StableLending.abi),
    [useAddresses().IsolatedLending]: new Interface(IsolatedLending.abi),
  };
  const isYY = useAddresses().YieldYakStrategy === strategyAddress;

  const feesContract = new Contract(
    strategyAddress,
    contractsABI[strategyAddress] ?? new Interface(StableLending.abi)
  );
  const { send, state } = useContractFunction(feesContract, 'withdrawFees');

  return {
    sendWithdrawFees:
      contractsABI[strategyAddress] === undefined
        ? null
        : isYY
        ? () => send(tokenAddress)
        : () => send(),
    withdrawState: state,
  };
}

export function useUpdateOraclePrice() {
  const addresses = useAddresses();
  const inAmount = parseEther('1');
  const stable = useStable();

  const strategy = new Contract(
    addresses.OracleRegistry,
    new Interface(OracleRegistry.abi)
  );
  const { send, state } = useContractFunction(strategy, 'getAmountInPeg');

  return {
    sendUpdateOraclePrice: (tokenAddress: string) =>
      send(tokenAddress, inAmount, stable.address),
    updateOraclePriceState: state,
  };
}

export function useApproveTrans(tokenAddress: string) {
  const tokenContract = new Contract(tokenAddress, new Interface(IERC20.abi));
  const { send, state } = useContractFunction(tokenContract, 'approve');

  return {
    sendApprove: (spender: string) =>
      send(spender, ethers.constants.MaxUint256),
    approveState: state,
  };
}

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

const PNG = '0x60781C2586D68229fde47564546784ab3fACA982';
const JOE = '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd';
const USDCe = '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664';
const USDTe = '0xc7198437980c041c805A1EDcbA50c1Ce5db95118';

const ammDefaults: Record<string, { router: string; path: string[] }> = {
  [PNG]: {
    router: '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106',
    path: [PNG, USDCe],
  },
  [JOE]: {
    router: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
    path: [JOE, USDCe],
  },
  [USDTe]: {
    router: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
    path: [USDTe, USDCe],
  },
};

export function useAMMHarvest(strategyAddress: string) {
  const conversionAddress = useAddresses().AMMYieldConverter;
  const conversionContract = new Contract(
    conversionAddress,
    new Interface(AMMYieldConverter.abi)
  );
  const rewardToken: string | undefined = useYieldConversionStrategyView(
    strategyAddress,
    'rewardToken',
    [],
    undefined
  );

  const undefinedArgs = { router: undefined, path: undefined };
  const { router, path } = rewardToken
    ? ammDefaults[getAddress(rewardToken)] ?? undefinedArgs
    : undefinedArgs;
  const { send, state } = useContractFunction(conversionContract, 'harvest');

  return {
    sendAMMHarvest: (yieldBearingToken: string) => {
      // console.log(
      //   'Sending AMM harvest',
      //   strategyAddress,
      //   yieldBearingToken,
      //   router,
      //   path
      // );
      send(strategyAddress, yieldBearingToken, router, path);
    },
    AMMHarvestState: state,
  };
}
