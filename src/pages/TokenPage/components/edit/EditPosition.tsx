import {
  Container,
  Image,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
} from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../../../chain-interaction/contracts';
import DepositBorrow from './DepositBorrow';
import DepositForm from './DepositForm';
import RepayWithdraw from './RepayWithdraw';
import GroupIcon from '../../../../assets/icons/Group.svg';

export default function EditPosition({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 2]}>
      {/* <GridItem rowSpan={2} colSpan={1}> */}
      <Container variant={'token'} padding={'35px 20px 20px 20px'}>
        <Tabs variant={'primary'}>
          <TabList>
            <Flex justifyContent="space-between" w="full">
              <Flex w="full">
                <Tab>Deposit</Tab>
                <Image src={GroupIcon} />
                <Tab>Borrow</Tab>
              </Flex>
              <Flex w="full">
                <Tab>Repay</Tab>
                <Image src={GroupIcon} />
                <Tab>Withdraw</Tab>
              </Flex>
            </Flex>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DepositForm position={position} stratMeta={stratMeta} />
            </TabPanel>
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
