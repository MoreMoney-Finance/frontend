import React from 'react';
import {
  ParsedPositionMetaRow,
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

  const START = new Date(2021, 10, 26).valueOf();
  const updatedPositions = useUpdatedPositions(START);
  console.log('updatedPositions', updatedPositions);

  // liquidationPrice * 1.1
  //check later if the position is liquidated is V

  const parsedPositions = new Map<number, ParsedPositionMetaRow>();

  updatedPositions.forEach((pos) => {
    parsedPositions.set(pos.trancheId, pos);
  });

  const liquidatablePositions = Object.values(parsedPositions).filter(
    (posMeta) => posMeta.liquidationPrice > tokenPrices[posMeta.token.address]
  );

  return (
    <LiquidatablePositionsContext.Provider value={liquidatablePositions}>
      {children}
    </LiquidatablePositionsContext.Provider>
  );
}
