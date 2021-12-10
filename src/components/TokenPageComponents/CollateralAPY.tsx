import { Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';

export default function CollateralAPY({
  position,
  stratMetaData,
}: {
  position: ParsedPositionMetaRow;
  stratMetaData: ParsedStratMetaRow;
}) {
  console.log(position);
  const boxStyle = {
    border: '1px solid transparent',
    borderColor: 'gray.600',
    borderRadius: '3xl',
    borderStyle: 'solid',
    height: 'full',
  };

  return (
    <GridItem colSpan={2}>
      <Flex {...boxStyle} flexDirection={'column'} justifyContent={'center'}>
        <Text>Your Collateral APY</Text>
        <Text fontSize={'5xl'}>
          {' '}
          <b>{stratMetaData.APY} %</b>
        </Text>
      </Flex>
    </GridItem>
  );
}
