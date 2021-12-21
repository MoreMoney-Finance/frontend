import {
  ContractCall,
  CurrencyValue,
  Token,
  useContractCalls,
  useEthers,
} from '@usedapp/core';
import { getAddress, Interface } from 'ethers/lib/utils';
import React, { useContext } from 'react';
import { getTokensInQuestion } from '../chain-interaction/tokens';
import { UserAddressContext } from './UserAddressContext';
import IsolatedLendingLiquidation from '../contracts/artifacts/contracts/IsolatedLendingLiquidation.sol/IsolatedLendingLiquidation.json';

export const TokenFeesContext = React.createContext<Map<string, CurrencyValue>>(
  new Map<string, CurrencyValue>()
);

export function TokenFeesCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);

  const tokenFees = new Map<string, CurrencyValue>();

  function convert2ContractCall(aT: [string, Token]) {
    return {
      abi: new Interface(IsolatedLendingLiquidation.abi),
      address: aT[0],
      method: 'viewLiquidationFeePer10k',
      args: [aT[1].address],
    };
  }
  const tokensInQuestion = getTokensInQuestion(chainId!);
  const calls: ContractCall[] = account
    ? tokensInQuestion.map(convert2ContractCall)
    : [];
  const results = useContractCalls(calls) ?? [];
  results?.forEach((result: any[] | undefined, index: number) => {
    if (result) {
      const [tokenAddress, token] = tokensInQuestion[index];
      tokenFees.set(
        getAddress(tokenAddress),
        new CurrencyValue(token, result[0])
      );
      console.log(`Set Fee for ${token.name}: ${result[0]} (${tokenAddress})`);
    } else {
      const [tokenAddress, token] = tokensInQuestion[index];
      console.log(`No result fee for ${token.name} at ${tokenAddress}`);
    }
  });

  return (
    <TokenFeesContext.Provider value={tokenFees}>
      {children}
    </TokenFeesContext.Provider>
  );
}
