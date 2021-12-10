import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';

export default function BorrowDeposit({
  stratMeta,
  liquidationRewardPer10k,
  position,
}: React.PropsWithChildren<{
  stratMeta: Record<string, ParsedStratMetaRow>;
  liquidationRewardPer10k: BigNumber;
  position?: ParsedPositionMetaRow;
}>) {
  console.log(stratMeta, liquidationRewardPer10k, position);
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
              <Flex flexDirection={'column'} justify={'start'}>
                <Box w={'full'} textAlign={'start'}>
                  <Text fontSize={'sm'}>Deposit Collateral</Text>
                </Box>
                <Input />
              </Flex>
              <Flex flexDirection={'column'} justify={'start'}>
                <Box w={'full'} textAlign={'start'}>
                  <Text fontSize={'sm'}>Borrow Money</Text>
                </Box>
                <Input />
              </Flex>
              <br />
              <Grid templateColumns="repeat(5, 1fr)" gap={2} w={'full'}>
                <Button borderRadius={'xl'}>25%</Button>
                <Button borderRadius={'xl'} bg={'green'}>
                  50%
                </Button>
                <Button borderRadius={'xl'}>70%</Button>
                <Button borderRadius={'xl'}>90%</Button>
                <Button borderRadius={'xl'}>Custom</Button>
              </Grid>
              <br />
              <Grid templateColumns="repeat(3, 1fr)" gap={2} w={'full'}>
                <Box textAlign={'center'}>
                  <Text fontSize="sm" color={'gray'}>
                    Amount
                  </Text>
                  <Text fontSize="md"> -$0.00</Text>
                </Box>
                <Box textAlign={'center'}>
                  <Text fontSize="sm" color={'gray'}>
                    Expected Liquidation Price
                  </Text>
                  <Text fontSize="md"> -$0.00</Text>
                </Box>
                <Box textAlign={'center'}>
                  <Text fontSize="sm" color={'gray'}>
                    cRatio
                  </Text>
                  <Text fontSize="md"> -100.00%</Text>
                </Box>
              </Grid>
              <br />
              <Flex>
                <Text fontSize={'sm'}>Price:</Text>
                <Text fontSize={'sm'}>1 WAVAX-WETHe= $2000</Text>
              </Flex>
              <Button w={'full'}>Deposit & Borrow</Button>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </GridItem>
  );
}
