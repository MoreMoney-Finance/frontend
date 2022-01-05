import { VStack } from '@chakra-ui/react';
import * as React from 'react';
import { useUpdatedPositions } from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { LiquidatablePositionsTable } from './LiquidatablePositionsTable';

export function LiquidatablePositions() {
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

  const liquidatablePositions = updatedPositions.filter(
    (posMeta) => posMeta.liquidationPrice > tokenPrices[posMeta.token.address]
  );
  return (
    <>
      {liquidatablePositions.length > 0 ? (
        <VStack mt="40px">
          <h1>Liquidatable positions</h1>
          <LiquidatablePositionsTable
            positions={liquidatablePositions}
            action={{
              callback: (pos) => console.log('liquidating', pos),
              label: 'Liquidate',
            }}
          />
        </VStack>
      ) : undefined}
    </>
  );
}
