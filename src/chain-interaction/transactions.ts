import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { useContractFunction } from '@usedapp/core';
import { Token } from '@usedapp/core/dist/esm/src/model';
import { useAddresses } from './contracts';

import IsolatedLending from '../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json';
import Strategy from '../contracts/artifacts/contracts/Strategy.sol/Strategy.json';
import YieldConversionBidStrategy from '../contracts/artifacts/contracts/YieldConversionBidStrategy.sol/YieldConversionBidStrategy.json';
import { useContext } from 'react';
import { UserAddressContext } from '../contexts/UserAddressContext';

import IWETH from '../contracts/artifacts/interfaces/IWETH.sol/IWETH.json';
import IERC20 from '../contracts/artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json';
import {
  parseEther,
  parseUnits,
} from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber, ethers } from 'ethers';

export function useDepositBorrowTrans(trancheId: number | null | undefined) {
  const ilAddress = useAddresses().IsolatedLending;
  const ilContract = new Contract(
    ilAddress,
    new Interface(IsolatedLending.abi)
  );
  const { send, state } = useContractFunction(
    ilContract,
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

export function useWrapNative() {
  // const { chainId } = useEthers();
  const wrapperAddress = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'; // wrappedNativeCurrency.get(chainId ?? ChainId.Localhost)!.address;
  const wrapperContract = new Contract(
    wrapperAddress,
    new Interface(IWETH.abi)
  );

  const { send, state } = useContractFunction(wrapperContract, 'deposit', {
    transactionName: 'Wrap',
  });

  return {
    sendWrapNative: (wrapAmount: number) =>
      send({ value: parseEther(wrapAmount.toString()) }),
    wrapNativeState: state,
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
  collateralToken: Token | null | undefined
) {
  const ilAddress = useAddresses().IsolatedLending;
  const ilContract = new Contract(
    ilAddress,
    new Interface(IsolatedLending.abi)
  );

  const { send, state } = useContractFunction(ilContract, 'repayAndWithdraw');

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
    new Interface(YieldConversionBidStrategy.abi)
  );
  const { send, state } = useContractFunction(strategy, 'convertReward2Stable');

  return {
    sendConvertReward2Stable: (rewardAmount: BigNumber, targetBid: BigNumber) =>
      send(rewardAmount, targetBid),
    convertReward2StableState: state,
  };
}
