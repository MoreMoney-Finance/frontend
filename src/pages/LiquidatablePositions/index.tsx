import { VStack } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import { useContext } from 'react';
import {
  getLiquidationParams,
  LiquidationType,
} from '../../chain-interaction/tokens';
import {
  useDirectLiquidationTrans,
  useLPTLiquidationTrans,
} from '../../chain-interaction/transactions';
import { LiquidatablePositionsContext } from '../../contexts/LiquidatablePositionsContext';
import { LiquidatablePositionsTable } from './LiquidatablePositionsTable';

export default function LiquidatablePositions() {
  const { sendDirectLiquidation } = useDirectLiquidationTrans();
  const { sendLPTLiquidation } = useLPTLiquidationTrans();

  // in this case using account is OK
  const { account } = useEthers();

  const liquidatablePositions = useContext(LiquidatablePositionsContext);

  return (
    <>
      {liquidatablePositions.length > 0 ? (
        <VStack mt="40px">
          <h1>Liquidatable positions</h1>
          <LiquidatablePositionsTable
            positions={liquidatablePositions}
            action={{
              callback: (pos) => {
                console.log('liquidating', pos);
                const { liqType, router } = getLiquidationParams(
                  pos.token.address
                );
                if (liqType === LiquidationType.LPT) {
                  sendLPTLiquidation(pos.trancheId, router, account);
                } else {
                  sendDirectLiquidation(pos.trancheId, router, account);
                }
              },
              label: 'Liquidate',
            }}
          />
        </VStack>
      ) : undefined}
    </>
  );
}
