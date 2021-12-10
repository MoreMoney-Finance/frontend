import { Box, Button, VStack, Wrap } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../chain-interaction/contracts';
import { MintNewTranche } from '../components/MintNewTranche';
import { MigrateStrategy } from './MigrateStrategy';
import { StrategyDataTable } from './StrategyDataTable';

export function PositionBody({
  stratMeta,
  liquidationRewardPer10k,
  position,
}: React.PropsWithChildren<{
  stratMeta: Record<string, ParsedStratMetaRow>;
  liquidationRewardPer10k: BigNumber;
  position?: ParsedPositionMetaRow;
}>) {
  const firstStrat = Object.keys(stratMeta)[0];
  console.log(
    'In position body pos:',
    position,
    firstStrat,
    liquidationRewardPer10k
  );

  const boxStyle = {
    border: '1px solid transparent',
    borderColor: 'gray.600',
    borderRadius: '3xl',
    borderStyle: 'solid',
  };

  return (
    <Wrap spacing="8" align="center" justify="center" padding="8">
      {Object.values(stratMeta).map((meta, i) => (
        <Box key={i} {...boxStyle}>
          <VStack>
            {position ? (
              position.strategy !== meta.strategyAddress ? (
                <MigrateStrategy {...meta} {...position} />
              ) : (
                <VStack>
                  <Button visibility="hidden">.</Button>
                  <StrategyDataTable {...meta} />
                </VStack>
              )
            ) : (
              <Box padding="4">
                <MintNewTranche {...meta} />
              </Box>
            )}
          </VStack>
        </Box>
      ))}
    </Wrap>
  );
}
