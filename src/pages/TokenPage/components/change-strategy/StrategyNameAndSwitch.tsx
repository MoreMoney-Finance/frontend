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
      : 'Compound collateral';

  const options = Object.values(stratMeta).filter((strat) => {
    //if there's a position opened with the hiddenStrategy then show it anyway
    if (
      position &&
      hiddenStrategies[strat.token.address].includes(position.strategy)
    ) {
      return strat;
    } else if (
      !hiddenStrategies[strat.token.address] &&
      !hiddenStrategies[strat.token.address].includes(strat.strategyAddress)
    ) {
      return strat;
    }
  });
  
  const multipleOptions = options.length > 0;
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
