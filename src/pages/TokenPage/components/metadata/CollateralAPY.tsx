import { InfoIcon } from '@chakra-ui/icons';
import { Container, Tooltip, Flex, GridItem, Text } from '@chakra-ui/react';
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
  const textVariant = 'bodySmall';
  const underlyingAPY = stratMeta[chosenStrategy].underlyingAPY;
  const customAPY =
    stratMeta[chosenStrategy].underlyingAPY !== undefined
      ? stratMeta[chosenStrategy].underlyingAPY! + stratMeta[chosenStrategy].APY
      : stratMeta[chosenStrategy].APY;
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
          <Flex>
            <Text variant={textVariant} color="whiteAlpha.400">
              Collateral APY &nbsp;
            </Text>
            {underlyingAPY ? (
              <Tooltip
                hasArrow
                closeOnClick={false}
                label={
                  <>
                    underlying: {underlyingAPY}%<br /> compounding:{' '}
                    {stratMeta[chosenStrategy].APY.toFixed(2)}%
                  </>
                }
                bg="gray.300"
                color="black"
                placement="right-end"
              >
                <InfoIcon />
              </Tooltip>
            ) : null}
          </Flex>
          <Text variant="bodyExtraLarge">
            {' '}
            <b>{customAPY.toFixed(2)}%</b>
          </Text>
          {multipleOptions ? (
            <Flex flexDirection={'column'} alignItems="center">
              <Flex flexDirection={'row'}>
                <Text color="white">
                  {stratMeta[chosenStrategy].compoundingAPY.toFixed(2)}%
                </Text>
                <Text variant={'bodySmall'} color="whiteAlpha.400">
                  &nbsp;
                  {stratMeta[chosenStrategy].underlyingStrategyName ??
                    'Compounding'}
                </Text>
              </Flex>
              <Flex flexDirection={'row'}>
                <Text color="white">
                  {stratMeta[chosenStrategy].selfRepayingAPY.toFixed(2)}%
                </Text>
                <Text variant={'bodySmall'} color="whiteAlpha.400">
                  &nbsp;{'Self-Repaying'}
                </Text>
              </Flex>
            </Flex>
          ) : null}
        </Flex>
      </Container>
    </GridItem>
  );
}
