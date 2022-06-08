import {
  Container,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import * as React from 'react';
import ClaimVeMore from './ClaimiMoney';
import { StakeMoreIMoney } from './StakeMoreiMoney';
import { UnstakeMoreIMoney } from './UnstakeMoreiMoney';

export function EditMoreIMoney(props: React.PropsWithChildren<unknown>) {
  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
      <Container variant={'token'} padding={'35px 20px 20px 20px'}>
        <Tabs variant={'primary'}>
          <TabList>
            <Tab>Stake</Tab>
            <Tab>Unstake</Tab>
            <Tab>Claim</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <StakeMoreIMoney />
            </TabPanel>
            <TabPanel>
              <UnstakeMoreIMoney />
            </TabPanel>
            <TabPanel>
              <ClaimVeMore />
            </TabPanel>
          </TabPanels>
        </Tabs>
        {props.children}
      </Container>
    </GridItem>
  );
}
