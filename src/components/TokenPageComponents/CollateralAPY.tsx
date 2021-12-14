import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';

export default function CollateralAPY({
  stratMetaData,
}: {
  stratMetaData: ParsedStratMetaRow;
}) {
  return (
    <GridItem colSpan={1} rowSpan={1}>
      <Container variant={'token'}>
        <Flex
          flexDirection={'column'}
          alignItems={'center'}
          h={'100%'}
          paddingTop='77px'
        >
          <Text variant="h400" color="brand.whiteAlpha40">
            Collateral APY
          </Text>
          <Text variant="bodyExtraLarge">
            {' '}
            <b>{stratMetaData.APY.toFixed(2)}%</b>
          </Text>
        </Flex>
      </Container>
    </GridItem>
  );
}
