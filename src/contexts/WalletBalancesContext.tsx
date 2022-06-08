import {
  Call,
  CurrencyValue,
  ERC20Interface,
  Token,
  useCalls,
  useEthers,
} from '@usedapp/core';
import { Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import React, { useContext } from 'react';
import { getTokensInQuestion } from '../chain-interaction/tokens';
import { UserAddressContext } from './UserAddressContext';

export const WalletBalancesContext = React.createContext<
  Map<string, CurrencyValue>
>(new Map<string, CurrencyValue>());

export function WalletBalancesCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);

  const tokenBalances = new Map<string, CurrencyValue>();

  function convert2ContractCall(aT: [string, Token]) {
    return {
      contract: new Contract(aT[0], ERC20Interface),
      method: 'balanceOf',
      args: [account],
    };
  }
  const tokensInQuestion = getTokensInQuestion(chainId!);
  const calls: Call[] = account
    ? tokensInQuestion.map(convert2ContractCall)
    : [];
  const results = (useCalls(calls) ?? []).map((x) => (x ?? { value: undefined }).value);
  results?.forEach((result: any[] | undefined, index: number) => {
    if (result) {
      const [tokenAddress, token] = tokensInQuestion[index];
      tokenBalances.set(
        getAddress(tokenAddress),
        new CurrencyValue(token, result[0])
      );
      // console.log(
      //   `Set balance for ${token.name}: ${result[0]} (${tokenAddress})`
      // );
      // } else {
      //   const [tokenAddress, token] = tokensInQuestion[index];
      //   console.log(`No result for ${token.name} at ${tokenAddress}`);
    }
  });

  return (
    <WalletBalancesContext.Provider value={tokenBalances}>
      {children}
    </WalletBalancesContext.Provider>
  );
}

export function useWalletBalance(tokenAddress: string | undefined | null) {
  const account = useContext(UserAddressContext);
  const ctxAccount = useContext(UserAddressContext);
  const balancesCtx = useContext(WalletBalancesContext);

  return tokenAddress && account === ctxAccount
    ? balancesCtx.get(getAddress(tokenAddress))
    : undefined;
}
