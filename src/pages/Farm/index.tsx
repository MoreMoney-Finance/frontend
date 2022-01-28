import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Link,
  Text,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { BigNumber, ethers } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import {
  ParsedStakingMetadata,
  useAddresses,
  useParsedStakingMetadata,
  useSpecialRewardsData,
} from '../../chain-interaction/contracts';
import { useWithdrawLaunchVestingTrans } from '../../chain-interaction/transactions';
import { TokenDescription } from '../../components/tokens/TokenDescription';
import { ExternalMetadataContext } from '../../contexts/ExternalMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import farminfo from '../../contracts/farminfo.json';
import ClaimReward from './components/ClaimReward';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';

export default function FarmPage(params: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);

  const stakeMeta: ParsedStakingMetadata[] = useParsedStakingMetadata(
    [useAddresses().CurvePoolRewards],
    account ?? ethers.constants.AddressZero
  ).flat(1);

  const { yieldMonitor } = useContext(ExternalMetadataContext);
  const avaxMorePayload = Object.values(yieldMonitor).filter(
    (item) => item.lpAddress === '0xb8361d0e3f3b0fc5e6071f3a3c3271223c49e3d9'
  )[0];

  const { balance, vested } = useSpecialRewardsData(
    account ?? ethers.constants.AddressZero
  );
  const { send: sendSpecialWithdraw } = useWithdrawLaunchVestingTrans();

  const farmInfoIdx = (chainId?.toString() ?? '43114') as keyof typeof farminfo;
  const getLPTokenLinks = [
    `https://avax.curve.fi/factory/${farminfo[farmInfoIdx].curvePoolIdx}/deposit`,
  ];

  const accordionStyling = {
    content: '""',
    borderRadius: '10px',
    marginTop: '10px',
    border: '1px solid transparent',
    backgroundClip: 'padding-box, border-box',
    backgroundOrigin: 'padding-box, border-box',
    backgroundImage:
      'linear-gradient(hsla(227, 12%, 15%, 1), hsla(227, 12%, 15%, 1)), linear-gradient(to right, hsla(0, 100%, 64%, 0.3) 0%, hsla(193, 100%, 50%, 0.3) 100%)',
    zIndex: 'var(--chakra-zIndices-hide)',
    fontSize: '18px',
    lineHeight: '27px',
    padding: '16px 30px',
  };

  return (
    <>
      <Box padding={'12'} width={'full'}>
        <Box textAlign="center" margin="100px 0">
          <Text fontSize="48" lineHeight="56px">
            Yield Farming is easy, stake your
          </Text>
          <Text fontSize="48" lineHeight="56px">
            token, sit back and relax!
          </Text>
        </Box>
        <Grid
          templateColumns="repeat(6, 1fr)"
          w={'auto'}
          padding={'0px 45px'}
          alignContent={'center'}
          verticalAlign={'center'}
        >
          <Text textAlign={'center'}>Asset</Text>
          <Text textAlign={'center'}>Stake</Text>
          <Text textAlign={'center'}>TVL</Text>
          <Text textAlign={'center'}>Reward</Text>
          <Text textAlign={'center'}>APR</Text>
          <Text textAlign={'center'}>Acquire</Text>
        </Grid>
        <Accordion
          allowToggle
          allowMultiple
          width={'full'}
          variant={'farm'}
          defaultIndex={0}
        >
          {!balance.isZero() ? (
            <AccordionItem
              width={'full'}
              style={{ boxSizing: 'border-box', ...accordionStyling }}
            >
              <AccordionButton width={'full'}>
                <Grid
                  templateColumns="repeat(6, 1fr)"
                  gap={2}
                  w={'full'}
                  alignContent={'center'}
                  verticalAlign={'center'}
                >
                  <Flex w={'full'} justifyContent={'center'}>
                    <Box w={'fit-content'}>Special Launch Rewards</Box>
                  </Flex>
                  <Box>
                    <Text>n/a</Text>
                  </Box>
                  <Box>
                    <Text>$ {stakeMeta[0].tvl.format({ suffix: '' })}</Text>
                  </Box>
                  <Flex w={'full'} justifyContent={'center'}>
                    {balance.format()}
                  </Flex>
                  <Box>n/a</Box>
                  <Box>
                    <Button
                      color={'white'}
                      variant={'primary'}
                      onClick={() => {
                        console.log(`Claiming vested`, vested.format());
                        sendSpecialWithdraw(vested.value);
                      }}
                    >
                      {vested.format({ suffix: '' })} Vested
                    </Button>
                  </Box>
                </Grid>
              </AccordionButton>
            </AccordionItem>
          ) : (
            <></>
          )}
          {avaxMorePayload != null ? (
            <AccordionItem
              width={'full'}
              style={{ boxSizing: 'border-box', ...accordionStyling }}
            >
              <Link
                href={
                  'https://traderjoexyz.com/farm/0xb8361D0E3F3B0fc5e6071f3a3C3271223C49e3d9-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00?fm=fm'
                }
                color="white"
                isExternal
              >
                <AccordionButton width={'full'} color={'white'}>
                  <Grid
                    templateColumns="repeat(6, 1fr)"
                    gap={2}
                    w={'full'}
                    alignContent={'center'}
                    verticalAlign={'center'}
                  >
                    <Flex w={'full'} justifyContent={'center'}>
                      <Box w={'fit-content'}>MORE-AVAX</Box>
                    </Flex>

                    <Box>
                      <Text>n/a</Text>
                    </Box>

                    <Box>
                      <Text>
                        ${BigNumber.from(avaxMorePayload.tvl).toString()}
                      </Text>
                    </Box>

                    <Flex w={'full'} justifyContent={'center'}>
                      {avaxMorePayload.rewardsCoin}
                    </Flex>

                    <Box>{avaxMorePayload.totalApy.toString()} %</Box>

                    <Box>
                      <Button
                        as={Link}
                        href={
                          'https://traderjoexyz.com/pool/AVAX/0xd9d90f882cddd6063959a9d837b05cb748718a05'
                        }
                        isExternal
                        color={'white'}
                        variant={'primary'}
                      >
                        Get LP Token &nbsp;
                        <ExternalLinkIcon />
                      </Button>
                    </Box>
                  </Grid>
                </AccordionButton>
              </Link>
            </AccordionItem>
          ) : (
            <></>
          )}
          {stakeMeta.map((item, index) => {
            const { totalRewards } = item;
            return (
              <div key={'item' + index}>
                <AccordionItem
                  width={'full'}
                  style={{ boxSizing: 'border-box', ...accordionStyling }}
                >
                  <AccordionButton width={'full'}>
                    <Grid
                      templateColumns="repeat(6, 1fr)"
                      gap={2}
                      w={'full'}
                      alignContent={'center'}
                      verticalAlign={'center'}
                    >
                      <Flex w={'full'} justifyContent={'center'}>
                        <Box w={'fit-content'}>
                          <TokenDescription token={item.stakingToken} />
                        </Box>
                      </Flex>
                      <Box>
                        <Text>{item.stakedBalance.format({ suffix: '' })}</Text>
                      </Box>
                      <Box>
                        <Text>$ {item.tvl.format({ suffix: '' })}</Text>
                      </Box>
                      <Flex w={'full'} justifyContent={'center'}>
                        {totalRewards.isZero() ? (
                          <Box w={'fit-content'}>
                            <TokenDescription token={item.rewardsToken} />
                          </Box>
                        ) : (
                          totalRewards.format()
                        )}
                      </Flex>
                      <Box>{item.aprPercent.toFixed(1)} %</Box>
                      <Box>
                        <Button
                          as={Link}
                          href={getLPTokenLinks[index]}
                          isExternal
                          color={'white'}
                          variant={'primary'}
                        >
                          Get LP Token &nbsp;
                          <ExternalLinkIcon />
                        </Button>
                      </Box>
                    </Grid>
                  </AccordionButton>
                  <AccordionPanel mt="16px">
                    <Grid templateColumns="repeat(13, 1fr)" gap={6}>
                      <GridItem w="100%" colSpan={5}>
                        <Container
                          variant={'token'}
                          padding={'16px'}
                          position="relative"
                        >
                          <DepositForm stakeMeta={item} />
                        </Container>
                      </GridItem>
                      <GridItem w="100%" colSpan={5}>
                        <Container
                          variant={'token'}
                          padding={'16px'}
                          position="relative"
                        >
                          <WithdrawForm stakeMeta={item} />
                        </Container>
                      </GridItem>
                      <GridItem colSpan={3} w="110%">
                        <Container
                          variant={'token'}
                          padding={'16px'}
                          position="relative"
                        >
                          <ClaimReward
                            stakeMeta={item}
                            token={item.rewardsToken}
                          />
                        </Container>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>
              </div>
            );
          })}
        </Accordion>
        {params.children}
      </Box>
    </>
  );
}
