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

  return (
    <GridItem rowSpan={3} colSpan={3}>
      <Container variant={'token'} padding={'16px'}>
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
      </Container>
    </GridItem>
  );
}
