import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedStratMetaRow,
  YieldType,
} from '../../../chain-interaction/contracts';
import ChangeStrategyModal from './ChangeStrategyModal';

export default function StrategyNameAndSwitch({
  chooseStrategy,
  stratMeta,
  chosenStrategy,
}: {
  chooseStrategy: (strategyToChoose: string) => void;
  stratMeta: Record<string, ParsedStratMetaRow>;
  chosenStrategy: string;
}) {
  const stratLabel =
    stratMeta[chosenStrategy].yieldType === YieldType.REPAYING
      ? 'Self-repaying loan'
      : 'Compound collateral';

  const multipleOptions = Object.values(stratMeta).length > 1;
  const textVariant = multipleOptions ? 'bodySmall' : 'bodyLarge';

  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
      <Container variant={'token'}>
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          h={'100%'}
        >
          <Text variant="h400" color="whiteAlpha.400">
            Strategy
          </Text>
          <Text variant={textVariant} marginTop="8px" mx="20px" align="center">
            <b>{stratLabel}</b>
          </Text>
          <br />
          {multipleOptions && (
            <ChangeStrategyModal
              stratMeta={stratMeta}
              chooseStrategy={chooseStrategy}
              currentStrategy={chosenStrategy}
            />
          )}
        </Flex>
      </Container>
    </GridItem>
  );
}
