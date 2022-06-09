import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  YieldType,
} from '../../../../chain-interaction/contracts';
import { hiddenStrategies } from '../../../../constants/hidden-strategies';
import ChangeStrategyModal from './ChangeStrategyModal';

export default function StrategyNameAndSwitch({
  position,
  chooseStrategy,
  stratMeta,
  chosenStrategy,
}: {
  position?: ParsedPositionMetaRow;
  chooseStrategy: (strategyToChoose: string) => void;
  stratMeta: Record<string, ParsedStratMetaRow>;
  chosenStrategy: string;
}) {

  const stratLabel =
    stratMeta[chosenStrategy].yieldType === YieldType.REPAYING
      ? 'Self-repaying loan'
      : stratMeta[chosenStrategy].underlyingStrategyName ?? 'Compound collateral';

  const options = Object.values(stratMeta).filter((strat) =>
    stratFilter(strat, position)
  );

  const multipleOptions = options.length > 1;
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

export function stratFilter(
  strat: ParsedStratMetaRow,
  position?: ParsedPositionMetaRow
) {
  if (position && position.trancheId == 60200000002) {
    if (position.strategy === strat.strategyAddress) {
      return true;
    } else {
      return false;
    }
  } else if (hiddenStrategies[strat.token.address]) {
    //if the strategy is hidden
    if (hiddenStrategies[strat.token.address].includes(strat.strategyAddress)) {
      //if the strategy that is hidden has a position opened for that
      if (position?.strategy === strat.strategyAddress) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return true;
  }
}
