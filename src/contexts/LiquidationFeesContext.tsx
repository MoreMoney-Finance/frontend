import {
  ContractCall,
  Token,
  useContractCalls,
  useEthers,
} from '@usedapp/core';
import { getAddress, Interface } from 'ethers/lib/utils';
import React, { useContext } from 'react';
import { getTokensInQuestion } from '../chain-interaction/tokens';
import { UserAddressContext } from './UserAddressContext';
import IsolatedLendingLiquidation from '../contracts/artifacts/contracts/IsolatedLendingLiquidation.sol/IsolatedLendingLiquidation.json';
import { useAddresses } from '../chain-interaction/contracts';

export const LiquidationFeesContext = React.createContext<Map<string, number>>(
  new Map<string, number>()
);

export function LiquidationFeesCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);
  const address = useAddresses().IsolatedLendingLiquidation;
  const tokenFees = new Map<string, number>();

  function convert2ContractCall(aT: [string, Token]) {
    return {
      abi: new Interface(IsolatedLendingLiquidation.abi),
      address: address,
      method: 'viewLiquidationFeePer10k',
      args: [aT[0]],
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
      tokenFees.set(getAddress(tokenAddress), result[0].toNumber() / 100);
      console.log(`Set Fee for ${token.name}: ${result[0]} (${tokenAddress})`);
    } else {
      const [tokenAddress, token] = tokensInQuestion[index];
      console.log(`No result fee for ${token.name} at ${tokenAddress}`);
    }
  });

  return (
    <LiquidationFeesContext.Provider value={tokenFees}>
      {children}
    </LiquidationFeesContext.Provider>
  );
}
