import { Interface } from '@ethersproject/abi';
import { parseUnits } from '@ethersproject/units';
import { Token, useContractFunction } from '@usedapp/core';
import { Contract } from 'ethers';
import xMore from '../../contracts/artifacts/contracts/governance/xMore.sol/xMore.json';
import CurvePoolRewards from '../../contracts/artifacts/contracts/rewards/CurvePoolRewards.sol/CurvePoolRewards.json';
import { useAddresses } from './contracts';

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
