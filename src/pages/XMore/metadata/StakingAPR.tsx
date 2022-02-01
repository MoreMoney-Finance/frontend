import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';

export function StakingAPR(props: React.PropsWithChildren<unknown>) {
  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
      <Container variant={'token'} padding={'35px 20px 20px 20px'}>
        <Flex
          flexDirection={'row'}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text>Staking APR</Text>
          <Text variant={'bodyLarge'}>23.99%</Text>
        </Flex>
        <Flex flexDirection={'row'} alignItems="center" justifyContent="end">
          <Text>Yesterday&apos;s APR</Text>
        </Flex>
        {props?.children}
      </Container>
    </GridItem>
  );
}
