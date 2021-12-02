import { Tab, Tabs, TabList, Box } from '@chakra-ui/react';
import * as React from 'react';

export function TableTabs() {
  return (
    <Box p={'2'}>
      <Tabs variant="soft-rounded">
        <TabList>
          <Tab>All Assets</Tab>
          <Tab>Stablecoins</Tab>
          <Tab>LP Tokens</Tab>
        </TabList>
      </Tabs>
    </Box>
  );
}
