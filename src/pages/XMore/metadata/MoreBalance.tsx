import { Text, GridItem, Container, Flex } from '@chakra-ui/react';
import * as React from 'react';

export function MoreBalance(props: React.PropsWithChildren<unknown>) {
  return (
    <GridItem rowSpan={[12, 12, 2]} colSpan={[12, 12, 1]}>
      <Container variant={'token'} padding={'35px 20px 20px 20px'}>
        <Flex flexDirection={'column'} h={''}>
          <Text variant={'bodyLarge'}>Balance</Text>
          <Flex flexDirection={'row'}>
            <img
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
              alt="MoreMoney Logo"
              width="100px"
              height="100px"
              style={{ borderRadius: '10%' }}
            />
            <Flex direction={'column'} padding="16px">
              <Text>-</Text>
              <Text>xMORE</Text>
            </Flex>
          </Flex>
          <Text variant={'bodyLarge'}>Balance</Text>
          <Flex flexDirection={'row'}>
            <img
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
              alt="MoreMoney Logo"
              width="100px"
              height="100px"
              style={{ borderRadius: '10%' }}
            />
            <Flex direction={'column'} padding="16px">
              <Text>-</Text>
              <Text>xMORE</Text>
            </Flex>
          </Flex>
        </Flex>
        {props.children}
      </Container>
    </GridItem>
  );
}
