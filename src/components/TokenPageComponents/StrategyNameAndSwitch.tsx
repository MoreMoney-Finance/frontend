import { Button, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';

export default function StrategyNameAndSwitch({
  stratMeta,
  chosenStrategy,
}: {
  stratMeta: Record<string, ParsedStratMetaRow>;
  chosenStrategy: string;
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
        alignContent={'center'}
        alignItems={'center'}
      >
        <Text>Strategy</Text>
        <Text fontSize={'2xl'}>
          <b>{stratMeta[chosenStrategy].strategyName}</b>
        </Text>
        <br />
        <Button borderRadius={'15px'} width={'auto'}>
          Change
        </Button>
      </Flex>
    </GridItem>
  );
}
