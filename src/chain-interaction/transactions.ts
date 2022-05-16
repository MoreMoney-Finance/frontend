import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import IERC20 from '@openzeppelin/contracts/build/contracts/IERC20.json';
import { useContractCall, useContractFunction } from '@usedapp/core';
import { Token } from '@usedapp/core/dist/esm/src/model';
import {
  parseEther,
  parseUnits,
} from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber, ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useContext } from 'react';
import { UserAddressContext } from '../contexts/UserAddressContext';
import xMore from '../contracts/artifacts/contracts/governance/xMore.sol/xMore.json';
import IsolatedLending from '../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json';
import DirectFlashLiquidation from '../contracts/artifacts/contracts/liquidation/DirectFlashLiquidation.sol/DirectFlashLiquidation.json';
import StableLendingLiquidation from '../contracts/artifacts/contracts/liquidation/StableLendingLiquidation.sol/StableLendingLiquidation.json';
import OracleRegistry from '../contracts/artifacts/contracts/OracleRegistry.sol/OracleRegistry.json';
import CurvePoolRewards from '../contracts/artifacts/contracts/rewards/CurvePoolRewards.sol/CurvePoolRewards.json';
import VestingLaunchReward from '../contracts/artifacts/contracts/rewards/VestingLaunchReward.sol/VestingLaunchReward.json';
import StableLending from '../contracts/artifacts/contracts/StableLending.sol/StableLending.json';
import AMMYieldConverter from '../contracts/artifacts/contracts/strategies/AMMYieldConverter.sol/AMMYieldConverter.json';
import YieldConversionStrategy from '../contracts/artifacts/contracts/strategies/YieldConversionStrategy.sol/YieldConversionStrategy.json';
import YieldYakStrategy from '../contracts/artifacts/contracts/strategies/YieldYakStrategy.sol/YieldYakStrategy.json';
import Strategy from '../contracts/artifacts/contracts/Strategy.sol/Strategy.json';
import WrapNativeIsolatedLending from '../contracts/artifacts/contracts/WrapNativeIsolatedLending.sol/WrapNativeIsolatedLending.json';
import IOracle from '../contracts/artifacts/interfaces/IOracle.sol/IOracle.json';
import VeMore from '../contracts/artifacts/contracts/governance/VeMore.sol/VeMore.json';
import xMoney from '../contracts/artifacts/contracts/governance/xMoney.sol/xMoney.json';
import {
  useAddresses,
  useRegisteredOracle,
  useStable,
  useYieldConversionStrategyView,
} from './contracts';

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

export function useBalanceOfVeMore(account: string) {
  const address = useAddresses().VeMore;
  const abi = new Interface(VeMore.abi);
  return (useContractCall({
    abi,
    address,
    method: 'balanceOf',
    args: [account],
  }) ?? [0])[0];
}

export function useGetStakedMoreVeMore(account: string) {
  const address = useAddresses().VeMore;
  const abi = new Interface(VeMore.abi);
  return (useContractCall({
    abi,
    address,
    method: 'getStakedMore',
    args: [account],
  }) ?? [0])[0];
}

export function useClaimableVeMore(account: string) {
  const address = useAddresses().VeMore;
  const abi = new Interface(VeMore.abi);
  return (useContractCall({
    abi,
    address,
    method: 'claimable',
    args: [account],
  }) ?? [0])[0];
}

export function useClaimVeMore() {
  const addresses = useAddresses();
  const cprAddress = addresses.VeMore;
  const cprContract = new Contract(cprAddress, new Interface(VeMore.abi));
  const { send, state } = useContractFunction(cprContract, 'claim');

  return {
    sendClaim: () => {
      return send();
    },
    claimState: state,
  };
}

export function useUnstakeVeMoreForMore() {
  const addresses = useAddresses();
  const cprAddress = addresses.VeMore;
  const cprContract = new Contract(cprAddress, new Interface(VeMore.abi));
  const { send, state } = useContractFunction(cprContract, 'withdraw');

  return {
    sendUnstake: (unstakeToken: Token, amount: string | number) => {
      const sAmount = parseUnits(amount.toString(), unstakeToken.decimals);
      return send(sAmount);
    },
    unstakeState: state,
  };
}

export function useStakeMoreForVeMore() {
  // TODO: change cprAddress and the ABI to use the correct address
  const addresses = useAddresses();
  const cprAddress = addresses.VeMore;
  const cprContract = new Contract(cprAddress, new Interface(VeMore.abi));
  const { send, state } = useContractFunction(cprContract, 'deposit');

  return {
    sendStake: (stakeToken: Token, amount: string | number) => {
      const sAmount = parseUnits(amount.toString(), stakeToken.decimals);
      return send(sAmount);
    },
    stakeState: state,
  };
}

export function useUnstakeMore() {
  // TODO: change cprAddress and the ABI to use the correct address
  const cprAddress = useAddresses().xMore;
  const cprContract = new Contract(cprAddress, new Interface(xMore.abi));
  const { send, state } = useContractFunction(cprContract, 'leave');

  return {
    sendUnstake: (leaveMoreToken: Token, amount: string | number) => {
      const sAmount = parseUnits(amount.toString(), leaveMoreToken.decimals);
      return send(sAmount);
    },
    unstakeState: state,
  };
}

export function useStakeMore() {
  // TODO: change cprAddress and the ABI to use the correct address
  const cprAddress = useAddresses().xMore;
  const cprContract = new Contract(cprAddress, new Interface(xMore.abi));
  const { send, state } = useContractFunction(cprContract, 'enter');

  return {
    sendStake: (stakeMoreToken: Token, amount: string | number) => {
      const sAmount = parseUnits(amount.toString(), stakeMoreToken.decimals);
      return send(sAmount);
    },
    stakeState: state,
  };
}

export function useClaimReward() {
  const ilAddress = useAddresses().CurvePoolRewards;
  const ilContract = new Contract(
    ilAddress,
    new Interface(CurvePoolRewards.abi)
  );
  const { send, state } = useContractFunction(
    ilContract,
    'withdrawVestedReward'
  );

  return {
    sendClaim: () => {
      return send();
    },
    claimState: state,
  };
}

export function useStakeXMoney() {
  const cprAddress = useAddresses().xMoney;
  const cprContract = new Contract(cprAddress, new Interface(xMoney.abi));
  const { send, state } = useContractFunction(cprContract, 'deposit');

  return {
    sendDepositXMoney: (stakeToken: Token, amount: string | number) => {
      const sAmount = parseUnits(amount.toString(), stakeToken.decimals);
      return send(sAmount);
    },
    depositState: state,
  };
}

export function useWithdrawXMoney() {
  const cprAddress = useAddresses().xMoney;
  const cprContract = new Contract(cprAddress, new Interface(xMoney.abi));
  const { send, state } = useContractFunction(cprContract, 'withdraw');

  return {
    sendWithdrawXMoney: (withdrawToken: Token, amount: string | number) => {
      const wAmount = parseUnits(amount.toString(), withdrawToken.decimals);
      return send(wAmount);
    },
    withdrawState: state,
  };
}

export function useStake() {
  const cprAddress = useAddresses().CurvePoolRewards;
  const cprContract = new Contract(
    cprAddress,
    new Interface(CurvePoolRewards.abi)
  );
  const { send, state } = useContractFunction(cprContract, 'stake');

  return {
    sendStake: (stakeToken: Token, amount: string | number) => {
      const sAmount = parseUnits(amount.toString(), stakeToken.decimals);
      return send(sAmount);
    },
    stakeState: state,
  };
}

export function useWithdraw() {
  const cprAddress = useAddresses().CurvePoolRewards;
  const cprContract = new Contract(
    cprAddress,
    new Interface(CurvePoolRewards.abi)
  );
  const { send, state } = useContractFunction(cprContract, 'withdraw');

  return {
    sendWithdraw: (withdrawToken: Token, amount: string | number) => {
      const wAmount = parseUnits(amount.toString(), withdrawToken.decimals);
      return send(wAmount);
    },
    withdrawState: state,
  };
}

export function useNativeDepositBorrowTrans(
  trancheId: number | null | undefined,
  lendingAddress: string | undefined | null
) {
  const addresses = useAddresses();
  const lendingContract = new Contract(
    lendingAddress === addresses.IsolatedLending
      ? addresses.WrapNativeIsolatedLending
      : addresses.WrapNativeStableLending,
    new Interface(WrapNativeIsolatedLending.abi)
  );
  const { send, state } = useContractFunction(
    lendingContract,
    trancheId ? 'depositAndBorrow' : 'mintDepositAndBorrow'
  );
  const account = useContext(UserAddressContext);

  return {
    sendDepositBorrow: (
      collateralToken: Token,
      strategyAddress: string,
      collateralAmount: string | number,
      borrowAmount: string | number
    ) => {
      const cAmount = parseUnits(
        collateralAmount.toString(),
        collateralToken.decimals
      );
      const bAmount = parseEther(borrowAmount.toString());

      return trancheId
        ? send(trancheId, bAmount, account, { value: cAmount })
        : send(strategyAddress, bAmount, account, { value: cAmount });
    },
    depositBorrowState: state,
  };
}

export function useNativeRepayWithdrawTrans(
  trancheId: number | null | undefined,
  collateralToken: Token | null | undefined,
  lendingAddress: string | undefined | null
) {
  const addresses = useAddresses();
  const lendingContract = new Contract(
    lendingAddress === addresses.IsolatedLending
      ? addresses.WrapNativeIsolatedLending
      : addresses.WrapNativeStableLending,
    new Interface(WrapNativeIsolatedLending.abi)
  );

  const { send, state } = useContractFunction(
    lendingContract,
    'repayAndWithdraw'
  );

  const account = useContext(UserAddressContext);

  return {
    sendRepayWithdraw: (
      collateralAmount: string | number,
      repayAmount: string | number
    ) =>
      account && trancheId && collateralToken
        ? send(
            trancheId,
            parseUnits(collateralAmount.toString(), collateralToken.decimals),
            parseEther(repayAmount.toString()),
            account
          )
        : console.error('Trying to withdraw but parameters not set'),
    repayWithdrawState: state,
  };
}

export function useDepositBorrowTrans(
  trancheId: number | null | undefined,
  lendingAddress: string | undefined | null
) {
  const addresses = useAddresses();
  const lendingContract = new Contract(
    lendingAddress === addresses.IsolatedLending
      ? addresses.IsolatedLending
      : addresses.StableLending,
    new Interface(IsolatedLending.abi)
  );
  const { send, state } = useContractFunction(
    lendingContract,
    trancheId ? 'depositAndBorrow' : 'mintDepositAndBorrow'
  );
  const account = useContext(UserAddressContext);

  return {
    sendDepositBorrow: (
      collateralToken: Token,
      strategyAddress: string,
      collateralAmount: string | number,
      borrowAmount: string | number
    ) => {
      const cAmount = parseUnits(
        collateralAmount.toString(),
        collateralToken.decimals
      );
      const bAmount = parseEther(borrowAmount.toString());

      return trancheId
        ? send(trancheId, cAmount, bAmount, account)
        : send(
            collateralToken.address,
            strategyAddress,
            cAmount,
            bAmount,
            account
          );
    },
    depositBorrowState: state,
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

export function useRepayWithdrawTrans(
  trancheId: number | null | undefined,
  collateralToken: Token | null | undefined,
  lendingAddress: string | undefined | null
) {
  const addresses = useAddresses();
  const lendingContract = new Contract(
    lendingAddress === addresses.IsolatedLending
      ? addresses.IsolatedLending
      : addresses.StableLending,
    new Interface(IsolatedLending.abi)
  );

  const { send, state } = useContractFunction(
    lendingContract,
    'repayAndWithdraw'
  );

  const account = useContext(UserAddressContext);

  return {
    sendRepayWithdraw: (
      collateralAmount: string | number,
      repayAmount: string | number
    ) =>
      account && trancheId && collateralToken
        ? send(
            trancheId,
            parseUnits(collateralAmount.toString(), collateralToken.decimals),
            parseEther(repayAmount.toString()),
            account
          )
        : console.error('Trying to withdraw but parameters not set'),
    repayWithdrawState: state,
  };
}

export function useTallyHarvestBalance(strategyAddress: string) {
  const strategy = new Contract(strategyAddress, new Interface(Strategy.abi));
  const { send, state } = useContractFunction(strategy, 'tallyHarvestBalance');

  return {
    sendTallyHarvestBalance: (tokenAddress: string) => send(tokenAddress),
    tallyHarvestState: state,
  };
}

export function useConvertReward2Stable(contractAddress: string) {
  const strategy = new Contract(
    contractAddress,
    new Interface(YieldConversionStrategy.abi)
  );
  const { send, state } = useContractFunction(strategy, 'convertReward2Stable');

  return {
    sendConvertReward2Stable: (rewardAmount: BigNumber, targetBid: BigNumber) =>
      send(rewardAmount, targetBid),
    convertReward2StableState: state,
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

export function useHarvestPartially(strategyAddress: string) {
  const strategy = new Contract(
    strategyAddress,
    new Interface(YieldConversionStrategy.abi)
  );
  const { send, state } = useContractFunction(strategy, 'harvestPartially');
  return {
    sendHarvestPartially: (tokenAddress: string) => send(tokenAddress),
    harvestPartiallyState: state,
  };
}

export function useMigrateStrategy(
  lendingContractAddress: string | undefined | null
) {
  const addresses = useAddresses();
  const lendingAddress =
    lendingContractAddress ??
    addresses.StableLending ??
    addresses.IsolatedLending;

  const strategy = new Contract(
    lendingAddress,
    new Interface(IsolatedLending.abi)
  );
  const { send, state } = useContractFunction(strategy, 'migrateStrategy');

  return {
    sendMigrateStrategy: (
      trancheId: number,
      targetStrategy: string,
      stable: Token,
      account: string
    ) => send(trancheId, targetStrategy, stable.address, account),
    migrateStrategyState: state,
  };
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

export function useUpdatePriceOracle(token?: Token) {
  const oracleAddress = useRegisteredOracle(token?.address);
  const oracleContract =
    oracleAddress && new Contract(oracleAddress, IOracle.abi);
  const stable = useStable();

  const { send, state } = useContractFunction(oracleContract, 'getAmountInPeg');
  return {
    sendUpdatePriceOracle: () =>
      token && send(token.address, parseEther('1'), stable.address),
    updatePriceOracleState: state,
  };
}

export async function viewBidTarget(
  trancheId: number,
  lendingAddress: string,
  requestedColVal: string,
  defaultResult: any
) {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://api.avax.network/ext/bc/C/rpc'
  );

  const liquidationContract = new ethers.Contract(
    lendingAddress,
    new Interface(StableLendingLiquidation.abi),
    provider
  );

  const result = await liquidationContract.viewBidTarget(
    trancheId,
    parseEther(requestedColVal)
  );
  return result ?? defaultResult;
}

export function usePrimitiveLiquidationTrans(contractAddress: string) {
  const addresses = useAddresses();
  const lendingAddress =
    contractAddress === addresses.IsolatedLending
      ? addresses.IsolatedLendingLiquidation
      : addresses.StableLendingLiquidation;
  const liquidationContract = new Contract(
    lendingAddress,
    new Interface(StableLendingLiquidation.abi)
  );
  const { send, state } = useContractFunction(liquidationContract, 'liquidate');

  return {
    sendLiquidation: (
      trancheId: number,
      collateralRequested: string,
      rebalancingBid: string,
      recipient: string
    ) =>
      send(
        trancheId,
        parseEther(collateralRequested),
        rebalancingBid,
        recipient
      ),
    liquidationState: state,
  };
}

export function useLiquidationTrans(contractAddress: string) {
  const liquidationContract = new Contract(
    contractAddress,
    new Interface(DirectFlashLiquidation.abi)
  );
  const { send, state } = useContractFunction(liquidationContract, 'liquidate');

  return {
    sendLiquidation: send,
    liquidationState: state,
  };
}

export function useWithdrawLaunchVestingTrans() {
  const addresses = useAddresses();
  return useContractFunction(
    new Contract(
      addresses.VestingLaunchReward,
      new Interface(VestingLaunchReward.abi)
    ),
    'burn'
  );
}
