import { Button, Container, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';

export default function StrategyNameAndSwitch({
  stratMeta,
  chosenStrategy,
}: {
  stratMeta: Record<string, ParsedStratMetaRow>;
  chosenStrategy: string;
}) {
  return (
    <GridItem colSpan={2} rowSpan={2}>
      <Container variant={'token'}>
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignContent={'center'}
          alignItems={'center'}
          h={'100%'}
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
      </Container>
    </GridItem>
  );
}
