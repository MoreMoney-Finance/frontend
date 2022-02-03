import { CurrencyValue } from '@usedapp/core';
import { parseEther } from '@usedapp/core/node_modules/@ethersproject/units';
import React from 'react';
import {
  ParsedPositionMetaRow,
  useStable,
  useUpdatedPositions,
} from '../chain-interaction/contracts';
import { StrategyMetadataContext } from './StrategyMetadataContext';

export const LiquidatablePositionsContext = React.createContext<
  ParsedPositionMetaRow[] | []
>([]);

export function LiquidatablePositionsCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const tokenPrices = Object.fromEntries(
    Object.entries(React.useContext(StrategyMetadataContext))
      .filter((row) => Object.values(row[1]).length > 0)
      .map(([tokenAddress, stratMeta]) => [
        tokenAddress,
        Object.values(stratMeta)[0].usdPrice,
      ])
  );
  const stable = useStable();
  const START = new Date(2021, 12, 30).valueOf();
  const updatedPositions = useUpdatedPositions(START);
  console.log('updatedPositions', updatedPositions);

  // liquidationPrice * 1.1
  //check later if the position is liquidated is V

  const parsedPositions = new Map<number, ParsedPositionMetaRow>();
  for (let index = 0; index < updatedPositions.length; index++) {
    const pos = updatedPositions[index];
    parsedPositions.set(pos.trancheId, pos);
  }
  // console.log(parsedPositions);
  // console.log(tokenPrices);

  const dollar = new CurrencyValue(stable, parseEther('1'));

  const liquidatablePositions = React.useMemo(
    () =>
      Array.from(parsedPositions.values()).filter(
        (posMeta) =>
          posMeta.liquidationPrice > tokenPrices[posMeta.token.address] &&
          posMeta.debt.gt(dollar)
      ),
    []
  );

  return (
    <LiquidatablePositionsContext.Provider value={liquidatablePositions}>
      {children}
    </LiquidatablePositionsContext.Provider>
  );
}
