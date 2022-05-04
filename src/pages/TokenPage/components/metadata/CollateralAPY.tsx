import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../../../chain-interaction/contracts';

export default function CollateralAPY({
  stratMeta,
  chosenStrategy,
}: {
  stratMeta: Record<string, ParsedStratMetaRow>;
  chosenStrategy: string;
}) {
  const multipleOptions =
    stratMeta[chosenStrategy].selfRepayingAPY > 0 &&
    stratMeta[chosenStrategy].compoundingAPY > 0;
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
          <Text variant={textVariant} color="whiteAlpha.400">
            Collateral APY
          </Text>
          <br />
          {stratMeta[chosenStrategy].selfRepayingAPY > 0 ? (
            <>
              <Text>{'Self Repaying APR'}</Text>
              <Text variant={textVariant}>
                <b>{stratMeta[chosenStrategy].selfRepayingAPY.toFixed(2)}%</b>
              </Text>
              <br />
            </>
          ) : null}
          {stratMeta[chosenStrategy].compoundingAPY > 0 ? (
            <>
              <Text>{'Compound APY'}</Text>
              <Text variant={textVariant}>
                <b>{stratMeta[chosenStrategy].compoundingAPY.toFixed(2)}%</b>
              </Text>
            </>
          ) : null}
        </Flex>
      </Container>
    </GridItem>
  );
}
