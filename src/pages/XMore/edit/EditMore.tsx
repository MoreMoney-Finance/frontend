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
import { StakeMore } from './StakeMore';
import { UnstakeMore } from './UnstakeMore';

export function EditMore(props: React.PropsWithChildren<unknown>) {
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
              <StakeMore />
            </TabPanel>
            <TabPanel>
              <UnstakeMore />
            </TabPanel>
          </TabPanels>
        </Tabs>
        {props.children}
      </Container>
    </GridItem>
  );
}
