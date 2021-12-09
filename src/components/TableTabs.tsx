import { Tab, Tabs, TabList, Box } from '@chakra-ui/react';
import * as React from 'react';

export function TableTabs() {
  return (
    <Box py={'2'}>
      <Tabs variant="soft-rounded">
        <TabList>
          <Tab>All Assets</Tab>
          <Tab>Single Asset</Tab>
          <Tab>LP Tokens</Tab>
          <Tab>My position</Tab>
        </TabList>
      </Tabs>
    </Box>
  );
}
