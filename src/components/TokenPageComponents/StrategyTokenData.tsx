import { Button, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';

export default function StrategyTokenData({
  position,
  stratMetaData,
}: {
  position: ParsedPositionMetaRow;
  stratMetaData: ParsedStratMetaRow;
}) {
  const boxStyle = {
    border: '1px solid transparent',
    borderColor: 'gray.600',
    borderRadius: '3xl',
    borderStyle: 'solid',
    height: 'full',
  };
  console.log(position, stratMetaData);
  return (
    <GridItem colSpan={2}>
      <Flex
        {...boxStyle}
        flexDirection={'column'}
        justifyContent={'center'}
        alignContent={'center'}
        alignItems={'center'}
      >
        <Text>Strategy</Text>
        <Text fontSize={'2xl'}>
          <b>Selfrepaying loan</b>
        </Text>
        <br />
        <Button borderRadius={'15px'} width={'auto'}>
          Change
        </Button>
      </Flex>
    </GridItem>
  );
}
