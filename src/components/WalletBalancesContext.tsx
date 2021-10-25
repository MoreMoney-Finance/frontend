import { ContractCall, CurrencyValue, ERC20Interface, Token, useContractCalls, useEthers } from '@usedapp/core';
import React, { useContext } from 'react';
import { addressToken } from '../chain-interaction/tokens';
import { UserAddressContext } from './UserAddressContext';

export const WalletBalancesContext = React.createContext<Map<string, CurrencyValue>>(new Map<string, CurrencyValue>());

export function WalletBalancesCtxProvider({ children }: React.PropsWithChildren<any>) {
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);

  const tokenBalances = new Map<string, CurrencyValue>();

  function convert2ContractCall(aT:[string, Token]) {
    return { abi: ERC20Interface,
      address: aT[0],
      method: 'balanceOf',
      args: [account]
    };
  }
  const calls: ContractCall[] = Array.from(addressToken.entries()).filter((aT) => aT[1].chainId === chainId).map(convert2ContractCall);
  useContractCalls(calls);

  return (
    <WalletBalancesContext.Provider value={tokenBalances}>
      { children }
    </WalletBalancesContext.Provider>
  )
}

export function useWalletBalance(tokenAddress:string|undefined|null) {
  const { account } = useEthers();
  const ctxAccount = useContext(UserAddressContext);
  const balancesCtx =  useContext(WalletBalancesContext);
  return tokenAddress && account == ctxAccount ? balancesCtx.get(tokenAddress) : undefined;
}