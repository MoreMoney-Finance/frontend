import { Interface } from '@ethersproject/abi';
import { parseUnits } from '@ethersproject/units';
import {
  ContractCall,
  CurrencyValue,
  Token,
  useContractCall,
  useContractCalls,
  useContractFunction,
  useEthers,
} from '@usedapp/core';
import { BigNumber, Contract, ethers } from 'ethers';
import xMore from '../../contracts/artifacts/contracts/governance/xMore.sol/xMore.json';
import CurvePoolRewards from '../../contracts/artifacts/contracts/rewards/CurvePoolRewards.sol/CurvePoolRewards.json';
import VestingLaunchReward from '../../contracts/artifacts/contracts/rewards/VestingLaunchReward.sol/VestingLaunchReward.json';
import VestingStakingRewards from '../../contracts/artifacts/contracts/rewards/VestingStakingRewards.sol/VestingStakingRewards.json';
import IStrategy from '../../contracts/artifacts/interfaces/IStrategy.sol/IStrategy.json';
import { getTokenFromAddress } from '../tokens';
import { useAddresses, useStable } from './contracts';

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

  const contractCalls2 = useContractCalls(calls);
  const results = (contractCalls2 ?? []) as unknown as [RawStakingMetadata][];
  return results;
}

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

export function useXMoreTotalSupply(
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

function timestamp2Date(tstamp: BigNumber) {
  return new Date(tstamp.toNumber() * 1000);
}

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
