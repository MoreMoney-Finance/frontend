import { Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';

export default function CollateralAPY({
  stratMetaData,
}: {
  stratMetaData: ParsedStratMetaRow;
}) {
  const boxStyle = {
    border: '1px solid transparent',
    borderColor: 'gray.600',
    borderRadius: '3xl',
    borderStyle: 'solid',
    height: 'full',
  };

  return (
    <GridItem colSpan={2}>
      <Flex
        {...boxStyle}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Text>Collateral APY</Text>
        <Text fontSize={'5xl'}>
          {' '}
          <b>{stratMetaData.APY.toFixed(2)} %</b>
        </Text>
      </Flex>
    </GridItem>
  );
}
