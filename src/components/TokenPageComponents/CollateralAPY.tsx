import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';

export default function CollateralAPY({
  stratMetaData,
}: {
  stratMetaData: ParsedStratMetaRow;
}) {

  return (
    <GridItem colSpan={2} rowSpan={2}>
      <Container variant={'token'}>
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          h={'100%'}
        >
          <Text>Collateral APY</Text>
          <Text fontSize={'5xl'}>
            {' '}
            <b>{stratMetaData.APY.toFixed(2)} %</b>
          </Text>
        </Flex>
      </Container>
    </GridItem>
  );
}
