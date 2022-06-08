import {
  Call,
  Token,
  useCalls,
  useEthers,
} from '@usedapp/core';
import { Contract } from 'ethers';
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
      contract: new Contract(address, new Interface(IsolatedLendingLiquidation.abi)),
      method: 'viewLiquidationFeePer10k',
      args: [aT[0]],
    };
  }
  const tokensInQuestion = getTokensInQuestion(chainId!);
  const calls: Call[] = tokensInQuestion.map(convert2ContractCall);
  const results = useCalls(calls).map((x) => (x ?? {value: undefined}).value) ?? [];
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
