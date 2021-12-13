import {
  ContractCall,
  CurrencyValue,
  ERC20Interface,
  Token,
  useContractCalls,
  useEthers,
} from '@usedapp/core';
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
      abi: ERC20Interface,
      address: aT[0],
      method: 'balanceOf',
      args: [account],
    };
  }
  const tokensInQuestion = getTokensInQuestion(chainId!);
  const calls: ContractCall[] = account ? tokensInQuestion.map(convert2ContractCall) : [];
  const results = useContractCalls(calls) ?? [];
  results?.forEach((result: any[] | undefined, index: number) => {
    if (result) {
      const [tokenAddress, token] = tokensInQuestion[index];
      tokenBalances.set(
        getAddress(tokenAddress),
        new CurrencyValue(token, result[0])
      );
      console.log(
        `Set balance for ${token.name}: ${result[0]} (${tokenAddress})`
      );
    } else {
      const [tokenAddress, token] = tokensInQuestion[index];
      console.log(`No result for ${token.name} at ${tokenAddress}`);
    }
  });

  return (
    <WalletBalancesContext.Provider value={tokenBalances}>
      {children}
    </WalletBalancesContext.Provider>
  );
}

export function useWalletBalance(tokenAddress: string | undefined | null) {
  const { account } = useEthers();
  const ctxAccount = useContext(UserAddressContext);
  const balancesCtx = useContext(WalletBalancesContext);

  return tokenAddress && account === ctxAccount
    ? balancesCtx.get(getAddress(tokenAddress))
    : undefined;
}
