import * as React from 'react';
import { TokenDataTable } from '../components/TokenDataTable';
import { MintNewTranche } from '../components/MintNewTranche';
import { Button, VStack, Wrap, Box } from '@chakra-ui/react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../chain-interaction/contracts';
import { BigNumber } from 'ethers';
import { StrategyDataTable } from './StrategyDataTable';
import { MigrateStrategy } from './MigrateStrategy';

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
  console.log('In position body pos:', position);

  const boxStyle = {
    border: '1px solid transparent',
    borderColor: 'gray.600',
    borderRadius: '3xl',
    borderStyle: 'solid',
  };

  return (
    <Wrap spacing="8" align="center" justify="center" padding="8">
      <Box {...boxStyle}>
        <TokenDataTable
          tokenData={
            Object.keys(stratMeta).length > 0
              ? stratMeta[firstStrat]
              : undefined
          }
          liquidationFee={liquidationRewardPer10k}
        />
      </Box>
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
