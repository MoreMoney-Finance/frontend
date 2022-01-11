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
import { ethers } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import {
  ParsedStakingMetadata,
  useAddresses,
  useParsedStakingMetadata,
} from '../../chain-interaction/contracts';
import ClaimReward from '../../components/FarmPageComponents/ClaimReward';
import DepositForm from '../../components/FarmPageComponents/DepositForm';
import WithdrawForm from '../../components/FarmPageComponents/WithdrawForm';
import { TokenDescription } from '../../components/TokenDescription';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import farminfo from '../../contracts/farminfo.json';

export function FarmPage(params: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);

  const stakeMeta: ParsedStakingMetadata[] = useParsedStakingMetadata(
    [useAddresses().CurvePoolRewards],
    account ?? ethers.constants.AddressZero
  ).flat(1);

  const farmInfoIdx = (chainId?.toString() ?? '43114') as keyof typeof farminfo;
  const getLPTokenLinks = [
    `https://avax.curve.fi/factory/${farminfo[farmInfoIdx].curvePoolIdx}/deposit`,
  ];

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
          {stakeMeta.map((item, index) => {
            const totalRewards = item.rewards.add(item.earned);
            return (
              <div key={'item' + index}>
                <AccordionItem
                  width={'full'}
                  style={{
                    content: '""',
                    borderRadius: '10px',
                    marginTop: '10px',
                    boxSizing: 'border-box',
                    border: '1px solid transparent',
                    backgroundClip: 'padding-box, border-box',
                    backgroundOrigin: 'padding-box, border-box',
                    backgroundImage:
                      'linear-gradient(hsla(227, 12%, 15%, 1), hsla(227, 12%, 15%, 1)), linear-gradient(to right, hsla(0, 100%, 64%, 0.3) 0%, hsla(193, 100%, 50%, 0.3) 100%)',
                    zIndex: 'var(--chakra-zIndices-hide)',
                    fontSize: '18px',
                    lineHeight: '27px',
                    padding: '16px 30px',
                  }}
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
                      <Box>{item.aprPercent} %</Box>
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
