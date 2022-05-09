import { VStack } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { getAddress } from 'ethers/lib/utils';
import * as React from 'react';
import { useContext } from 'react';
import { useAddresses } from '../../chain-interaction/contracts';
import {
  getLiquidationParams,
  LiquidationType,
} from '../../chain-interaction/tokens';
import { useLiquidationTrans } from '../../chain-interaction/transactions';
import { LiquidatablePositionsContext } from '../../contexts/LiquidatablePositionsContext';
import { LiquidatablePositionsTable } from './LiquidatablePositionsTable';

export default function LiquidatablePositions() {
  const addresses = useAddresses();
  const { sendLiquidation: sendDirectLiquidationLegacy } = useLiquidationTrans(
    'IsolatedLending' in addresses
      ? addresses.DirectFlashLiquidation
      : addresses.DirectFlashStableLiquidation
  );
  const { sendLiquidation: sendDirectLiquidationCurrent } = useLiquidationTrans(
    'StableLending' in addresses
      ? addresses.DirectFlashStableLiquidation
      : addresses.DirectFlashLiquidation
  );
  const { sendLiquidation: sendLPTLiquidationLegacy } = useLiquidationTrans(
    'IsolatedLending' in addresses
      ? addresses.LPTFlashLiquidation
      : addresses.LPTFlashStableLiquidation
  );
  const { sendLiquidation: sendLPTLiquidationCurrent } = useLiquidationTrans(
    'StableLending' in addresses
      ? addresses.LPTFlashStableLiquidation
      : addresses.LPTFlashLiquidation
  );

  const { sendLiquidation: sendWsMaxiLiquidation } = useLiquidationTrans(
    'wsMAXIStableLiquidation' in addresses
      ? addresses.wsMAXIStableLiquidation
      : addresses.DirectFlashLiquidation
  );
  const { sendLiquidation: sendXJoeLiquidation } = useLiquidationTrans(
    'xJoeStableLiquidation' in addresses
      ? addresses.xJoeStableLiquidation
      : addresses.DirectFlashLiquidation
  );

  const lending2Liquidation: Record<
    string,
    Record<LiquidationType, (...args: any[]) => Promise<void>>
  > = {
    ...('IsolatedLending' in addresses
      ? {
        [addresses.IsolatedLending]: {
          [LiquidationType.LPT]: sendLPTLiquidationLegacy,
          [LiquidationType.Direct]: sendDirectLiquidationLegacy,
        },
      }
      : {}),
    ...('StableLending' in addresses
      ? {
        [addresses.StableLending]: {
          [LiquidationType.LPT]: sendLPTLiquidationCurrent,
          [LiquidationType.Direct]: sendDirectLiquidationCurrent,
        },
      }
      : {}),
  };

  const token2Liquidation = {
    [getAddress('0x2148D1B21Faa7eb251789a51B404fc063cA6AAd6')]:
      sendWsMaxiLiquidation,
    [getAddress('0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33')]:
      sendXJoeLiquidation,
  };
  // in this case using account is OK
  const { account } = useEthers();

  const liquidatablePositions = useContext(LiquidatablePositionsContext);

  return (
    <>
      {liquidatablePositions.length > 0 && false ? (
        <VStack mt="40px">
          <h1>Liquidatable positions</h1>
          <LiquidatablePositionsTable
            positions={liquidatablePositions}
            action={{
              callback: (pos) => {
                const { liqType, router } = getLiquidationParams(
                  pos
                );
                console.log('liquidating', pos, liqType, router);
                console.log(lending2Liquidation);
                if (getAddress(pos.token.address) in token2Liquidation) {
                  token2Liquidation[getAddress(pos.token.address)](
                    pos.trancheId,
                    router,
                    account
                  );
                } else {
                  lending2Liquidation[pos.trancheContract][liqType](
                    pos.trancheId,
                    router,
                    account
                  );
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
