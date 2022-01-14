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
} from '../../../chain-interaction/contracts';
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
    <GridItem rowSpan={[12, 12, 2]} colSpan={[12, 12, 2]}>
      {/* <GridItem rowSpan={2} colSpan={1}> */}
      <Container variant={'token'} padding={'35px 20px 20px 20px'}>
        <Tabs variant={'primary'}>
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
