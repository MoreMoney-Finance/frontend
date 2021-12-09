import * as React from 'react';
import { useParams } from 'react-router-dom';

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { TokenDescription } from '../components/TokenDescription';
import { getTokenFromAddress } from '../chain-interaction/tokens';
import { useEthers } from '@usedapp/core';
import { ArrowBackIcon } from '@chakra-ui/icons';

export function TokenPageRedesign() {
  const { chainId } = useEthers();
  const params = useParams<'tokenAddress'>();
  const tokenAddress = params.tokenAddress;
  const token = tokenAddress
    ? getTokenFromAddress(chainId!, tokenAddress)
    : undefined;

  const boxStyle = {
    border: '1px solid transparent',
    borderColor: 'gray.600',
    borderRadius: '3xl',
    borderStyle: 'solid',
    width: 'full',
    height: 'full',
  };

  return (
    <VStack spacing="8" margin="8">
      <Flex flexDirection={'row'} w={'full'} alignContent={'center'}>
        <Box marginRight={'10px'}>
          <Flex flexDirection={'row'}>
            <Text>
              <ArrowBackIcon />
            </Text>
            <Text>Back</Text>
          </Flex>
        </Box>
        <Box>
          {token ? (
            <TokenDescription token={token} iconSize="xs" textSize="6xl" />
          ) : undefined}
        </Box>
      </Flex>
      <Grid
        w={'full'}
        h="500px"
        width={'1200px'}
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(7, 1fr)"
        gap={4}
      >
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
        <GridItem colSpan={2}>
          <Flex
            {...boxStyle}
            flexDirection={'column'}
            justifyContent={'center'}
          >
            <Text>Your Collateral APY</Text>
            <Text fontSize={'5xl'}>
              {' '}
              <b>0.5 %</b>
            </Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={2}>
          <Flex
            {...boxStyle}
            flexDirection={'column'}
            justifyContent={'center'}
            alignContent={'center'}
            alignItems={'center'}
          >
            <Text>Strategy</Text>
            <Text fontSize={'2xl'}>
              <b>Selfrepaying loan</b>
            </Text>
            <br />
            <Button borderRadius={'15px'} width={'auto'}>
              Change
            </Button>
          </Flex>
        </GridItem>
        <GridItem colSpan={4}>
          <Flex
            {...boxStyle}
            flexDirection={'column'}
            justifyContent={'center'}
            alignContent={'center'}
            alignItems={'center'}
            paddingLeft={'100px'}
            paddingRight={'100px'}
          >
            <Box w={'full'}>
              <Flex w={'full'}>
                <Text>Borrow Fee</Text>
                <Spacer />
                <Text>
                  <b>0.5%</b>
                </Text>
              </Flex>
              <br />
              <Flex w={'full'}>
                <Text>Borrow Fee</Text>
                <Spacer />
                <Text>
                  <b>150%</b>
                </Text>
              </Flex>
              <br />
              <Flex w={'full'}>
                <Text>Liquidation Fee</Text>
                <Spacer />
                <Text>
                  <b>12%</b>
                </Text>
              </Flex>
              <br />
              <Flex w={'full'}>
                <Text>Interest</Text>
                <Spacer />
                <Text>
                  <b>8%</b>
                </Text>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
      <Box
        borderWidth="1px"
        width={'full'}
        height={'150px'}
        borderRadius={'lg'}
      >
        <Grid
          templateColumns="repeat(6, 1fr)"
          gap={2}
          height={'full'}
          justifyContent={'center'}
          alignContent={'center'}
          alignItems={'center'}
          justifyItems={'center'}
        >
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              {' '}
              COLLATERAL (USD){' '}
            </Text>
            <Text fontSize="md"> $1,000,000 </Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              POSITION APY
            </Text>
            <Text fontSize="md"> 20%</Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              DEBT
            </Text>
            <Text fontSize="md"> $200</Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              CRATIO
            </Text>
            <Text fontSize="md"> 150%</Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              LIQUIDATION PRICE
            </Text>
            <Text fontSize="md"> $200</Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              Strategy
            </Text>
            <Text fontSize="lg" textDecoration={'underline'}>
              {' '}
              <a href="#">self repaying loan</a>
            </Text>
          </Box>
        </Grid>
      </Box>
    </VStack>
  );
}
