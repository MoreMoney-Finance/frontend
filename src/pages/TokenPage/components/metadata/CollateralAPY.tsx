import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../../../chain-interaction/contracts';

export default function CollateralAPY({
  stratMetaData,
}: {
  stratMetaData: ParsedStratMetaRow;
}) {
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
          <Text variant="h400" color="whiteAlpha.400">
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
