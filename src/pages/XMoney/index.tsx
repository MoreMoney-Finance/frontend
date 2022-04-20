import {
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import * as React from 'react';
import { StakeMoney } from './components/StakeMoney';
import { UnstakeMoney } from './components/UnstakeMoney';

export function XMoneyPage(props: React.PropsWithChildren<unknown>) {
  return (
    <Flex
      alignItems="center"
      justifyContent={'center'}
      justify="center"
      align={'center'}
      alignContent={'center'}
    >
      <Container
        width={'500px'}
        variant={'token'}
        padding={'35px 20px 20px 20px'}
      >
        <Tabs variant={'primary'}>
          <TabList>
            <Tab>Stake MONEY</Tab>
            <Tab>Unstake</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <StakeMoney />
            </TabPanel>
            <TabPanel>
              <UnstakeMoney />
            </TabPanel>
          </TabPanels>
        </Tabs>
        {props.children}
      </Container>
    </Flex>
  );
}
