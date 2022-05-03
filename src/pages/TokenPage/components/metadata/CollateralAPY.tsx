import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedStratMetaRow,
  YieldType,
} from '../../../../chain-interaction/contracts';

export default function CollateralAPY({
  stratMeta,
}: {
  stratMeta: Record<string, ParsedStratMetaRow>;
}) {
  const options = Object.values(stratMeta);

  const multipleOptions = options.length > 1;
  const textVariant = multipleOptions ? 'bodySmall' : 'bodyLarge';

  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
      {/* <GridItem colSpan={2}> */}
      <Container variant={'token'} padding={['16px', '0px', '0px']}>
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          h={'100%'}
        >
          {Object.keys(stratMeta).map((strat) => {
            const stratLabel =
              stratMeta[strat].yieldType === YieldType.REPAYING
                ? 'Self-repaying loan'
                : 'Compound collateral';

            return (
              <>
                <Text variant={textVariant} color="whiteAlpha.400">
                  Collateral APY
                </Text>
                <Text>{stratLabel}</Text>
                <Text variant={textVariant}>
                  <b>{stratMeta[strat].APY.toFixed(2)}%</b>
                </Text>
                <br />
              </>
            );
          })}
        </Flex>
      </Container>
    </GridItem>
  );
}
