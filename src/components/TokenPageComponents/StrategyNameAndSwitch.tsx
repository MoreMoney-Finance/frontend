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
    <GridItem colSpan={1} rowSpan={1}>
      <Container variant={'token'}>
        <Flex
          flexDirection={'column'}
          alignItems={'center'}
          paddingTop="77px"
          h={'100%'}
        >
          <Text variant="h400" color="whiteAlpha.400">
            Strategy
          </Text>
          <Text variant="bodySmall" marginTop="8px">
            <b>{stratMeta[chosenStrategy].strategyName}</b>
          </Text>
          <br />
          <Button borderRadius={'full'} width={'auto'} marginTop="20px">
            <Text variant="bodySmall">Change</Text>
          </Button>
        </Flex>
      </Container>
    </GridItem>
  );
}
