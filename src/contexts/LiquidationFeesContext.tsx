import {
  ContractCall,
  Token,
  useContractCalls,
  useEthers,
} from '@usedapp/core';
import { getAddress, Interface } from 'ethers/lib/utils';
import React from 'react';
import { useAddresses } from '../chain-interaction/contracts';
import { getTokensInQuestion } from '../chain-interaction/tokens';
import IsolatedLendingLiquidation from '../contracts/artifacts/contracts/IsolatedLendingLiquidation.sol/IsolatedLendingLiquidation.json';

export const LiquidationFeesContext = React.createContext<Map<string, number>>(
  new Map<string, number>()
);

export function LiquidationFeesCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const { chainId } = useEthers();
  const address = useAddresses().StableLending2Liquidation;
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
  const calls: ContractCall[] = tokensInQuestion.map(convert2ContractCall);
  const results = useContractCalls(calls) ?? [];
  results?.forEach((result: any[] | undefined, index: number) => {
    if (result) {
      const [tokenAddress] = tokensInQuestion[index];
      tokenFees.set(getAddress(tokenAddress), result[0].toNumber() / 100);
      // console.log(`Set Fee for ${token.name}: ${result[0]} (${tokenAddress}): ${result[0].toNumber()}`);
    } else {
      // const [tokenAddress, token] = tokensInQuestion[index];
      // console.log(`No result fee for ${token.name} at ${tokenAddress}`);
    }
  });

  return (
    <LiquidationFeesContext.Provider value={tokenFees}>
      {children}
    </LiquidationFeesContext.Provider>
  );
}
