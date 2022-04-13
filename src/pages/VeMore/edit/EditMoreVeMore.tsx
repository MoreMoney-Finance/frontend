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
import { StakeMoreVeMore } from './StakeMoreVeMore';
import { UnstakeMoreVeMore } from './UnstakeMoreVeMore';

export function EditMoreVeMore(props: React.PropsWithChildren<unknown>) {
  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
      <Container variant={'token'} padding={'35px 20px 20px 20px'}>
        <Tabs variant={'primary'}>
          <TabList>
            <Tab>Stake MORE</Tab>
            <Tab>Unstake</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <StakeMoreVeMore />
            </TabPanel>
            <TabPanel>
              <UnstakeMoreVeMore />
            </TabPanel>
          </TabPanels>
        </Tabs>
        {props.children}
      </Container>
    </GridItem>
  );
}
