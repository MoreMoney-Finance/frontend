import {
  Box,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';
import DepositBorrow from './DepositBorrow';
import RepayWithdraw from './RepayWithdraw';

export default function EditPosition({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const boxStyle = {
    border: '1px solid transparent',
    borderColor: 'gray.600',
    borderRadius: '3xl',
    borderStyle: 'solid',
    height: 'full',
  };

  return (
    <GridItem rowSpan={2} colSpan={3}>
      <Box {...boxStyle} padding={'16px'}>
        <Tabs>
          <TabList>
            <Tab>Borrow</Tab>
            <Tab>Repay</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DepositBorrow position={position} stratMeta={stratMeta} />
            </TabPanel>
            <TabPanel>
              <RepayWithdraw position={position} stratMeta={stratMeta} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </GridItem>
  );
}
