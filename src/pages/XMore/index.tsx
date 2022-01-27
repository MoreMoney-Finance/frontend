import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { EnsureWalletConnected } from '../../components/account/EnsureWalletConnected';
import { TokenAmountInputField } from '../../components/tokens/TokenAmountInputField';

export default function XMorePage(props: React.PropsWithChildren<unknown>) {
  /*
.parent {
display: grid;
grid-template-columns: repeat(5, 1fr);
grid-template-rows: repeat(5, 1fr);
grid-column-gap: 0px;
grid-row-gap: 0px;
}

.div1 { grid-area: 2 / 2 / 3 / 4; }
.div2 { grid-area: 3 / 2 / 5 / 4; }
.div3 { grid-area: 2 / 4 / 5 / 6; }
	*/

  const { register: registerDepForm, setValue: setValueDepForm } = useForm();

  return (
    <Box margin={['0px', '0px', '60px 100px 100px']}>
      <Flex flexDirection={'row'}>
        <Container>
          <Flex flexDirection={'column'}>
            <Text fontSize={'20px'}>
              <b>Maximize yield by staking MORE for xMORE</b>
            </Text>
            <br />
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
              exercitationem quas amet adipisci earum nesciunt repellendus ullam
              aliquam veritatis laboriosam dolorem, tempore rerum, quia iusto
              vitae aperiam consectetur! Expedita, laboriosam.
            </Text>
          </Flex>
        </Container>
        <Container>
          <Flex width={'full'} justifyContent="center">
            <img
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
              alt="MoreMoney Logo"
              width="100px"
              height="100px"
              style={{ borderRadius: '100%' }}
            />
          </Flex>
        </Container>
      </Flex>
      <Grid
        templateColumns={[
          'repeat(1, 1fr)',
          'repeat(5, 1fr)',
          '240px 240px 520px',
        ]}
        templateRows={[
          'repeat(2, 1fr)',
          'repeat(2, 1fr)',
          'auto 340px 240px 310px ',
        ]}
        w={'full'}
        gap={'20px'}
        marginTop={'30px'}
      >
        <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
          {/* <GridItem rowSpan={2} colSpan={1}> */}
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <Flex
              flexDirection={'row'}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text>Staking APR</Text>
              <Text variant={'bodyLarge'}>23.99%</Text>
            </Flex>
            <Flex
              flexDirection={'row'}
              alignItems="center"
              justifyContent="space-between"
            >
              <Button>View Stats</Button>
              <Text>Yesterday&apos;s APR</Text>
            </Flex>
          </Container>
        </GridItem>
        <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 2]}>
          {/* <GridItem rowSpan={2} colSpan={1}> */}
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <Flex
              flexDirection={'column'}
              //   justifyContent={'center'}
              //   alignItems={'center'}
              h={''}
            >
              <Text variant={'bodyLarge'}>Balance</Text>
              <Flex flexDirection={'row'}>
                <img
                  src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
                  alt="MoreMoney Logo"
                  width="100px"
                  height="100px"
                  style={{ borderRadius: '10%' }}
                />
                <Flex direction={'column'} padding="16px">
                  <Text>-</Text>
                  <Text>xMORE</Text>
                </Flex>
              </Flex>
              <Text variant={'bodyLarge'}>Balance</Text>
              <Flex flexDirection={'row'}>
                <img
                  src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
                  alt="MoreMoney Logo"
                  width="100px"
                  height="100px"
                  style={{ borderRadius: '10%' }}
                />
                <Flex direction={'column'} padding="16px">
                  <Text>-</Text>
                  <Text>xMORE</Text>
                </Flex>
              </Flex>
            </Flex>
          </Container>
        </GridItem>
        <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <Tabs variant={'primary'}>
              <TabList>
                <Tab>Stake MORE</Tab>
                <Tab>Unstake</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <form>
                    <Flex flexDirection={'column'} justify={'start'}>
                      <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
                        <Text
                          variant={'bodyExtraSmall'}
                          color={'whiteAlpha.600'}
                          lineHeight={'14px'}
                        >
                          Stake MORE
                        </Text>
                      </Box>
                      <TokenAmountInputField
                        name="amount-stake"
                        width="full"
                        // max={'100'}
                        isDisabled={false}
                        placeholder={'Deposit'}
                        registerForm={registerDepForm}
                        setValueForm={setValueDepForm}
                      />
                    </Flex>
                    <Box marginTop={'10px'}>
                      <EnsureWalletConnected>
                        <Button
                          width={'full'}
                          variant={'submit-primary'}
                          isLoading={false}
                        >
                          Approve
                        </Button>
                      </EnsureWalletConnected>
                    </Box>
                  </form>
                </TabPanel>
                <TabPanel>
                  <form>
                    <Flex flexDirection={'column'} justify={'start'}>
                      <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
                        <Text
                          variant={'bodyExtraSmall'}
                          color={'whiteAlpha.600'}
                          lineHeight={'14px'}
                        >
                          Unstake
                        </Text>
                      </Box>
                      <TokenAmountInputField
                        name="amount-stake"
                        width="full"
                        // max={'100'}
                        isDisabled={false}
                        placeholder={'Deposit'}
                        registerForm={registerDepForm}
                        setValueForm={setValueDepForm}
                      />
                    </Flex>
                    <Box marginTop={'10px'}>
                      <EnsureWalletConnected>
                        <Button
                          width={'full'}
                          variant={'submit-primary'}
                          isLoading={false}
                        >
                          Approve
                        </Button>
                      </EnsureWalletConnected>
                    </Box>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </GridItem>
      </Grid>
      {props?.children}
    </Box>
  );
}
