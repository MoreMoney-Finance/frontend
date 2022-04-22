import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Accordion,
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
  useSpecialRewardsData,
} from '../../chain-interaction/contracts';
import { useWithdrawLaunchVestingTrans } from '../../chain-interaction/transactions';
import { TokenDescription } from '../../components/tokens/TokenDescription';
import {
  ExternalMetadataContext,
  YieldFarmingData,
} from '../../contexts/ExternalMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import farminfo from '../../contracts/farminfo.json';
import { formatNumber } from '../../utils';
import ClaimReward from './components/ClaimReward';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';
import FarmItem from './FarmItem';

export default function FarmPage(params: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);

  const stakeMeta: ParsedStakingMetadata[] = useParsedStakingMetadata(
    [useAddresses().CurvePoolRewards],
    account ?? ethers.constants.AddressZero
  ).flat(1);

  const { yieldFarmingData, yieldMonitor } = useContext(
    ExternalMetadataContext
  );
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

  const externalData: YieldFarmingData[] =
    avaxMorePayload && yieldFarmingData
      ? [
        ...yieldFarmingData,
        {
          asset: 'MORE-AVAX',
          stake: 'n/a',
          tvl: avaxMorePayload.tvl,
          reward: 'MORE + ' + avaxMorePayload.rewardsCoin,
          apr: avaxMorePayload.totalApy,
          getTokenURL:
              'https://traderjoexyz.com/pool/AVAX/0xd9d90f882cddd6063959a9d837b05cb748718a05',
          stakeTokenURL:
              'https://traderjoexyz.com/farm/0xb8361D0E3F3B0fc5e6071f3a3C3271223C49e3d9-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00?fm=fm',
        },
      ]
      : [];

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
          display={['none', 'none', 'none', 'grid']}
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
            <FarmItem
              key={'farmRow'}
              asset="Special Launch Rewards"
              stake={'n/a'}
              tvl={`$ ${stakeMeta[0].tvl.format({ suffix: '' })}`}
              reward={`${balance.format()}`}
              apr={'n/a'}
              acquire={
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
              }
            />
          ) : (
            <></>
          )}
          {externalData.length > 0 ? (
            externalData.map((item) => (
              <FarmItem
                key={'farmRow' + item.asset}
                asset={item.asset}
                stake={item.stake}
                tvl={`$ ${formatNumber(item.tvl)}`}
                reward={`${item.reward}`}
                apr={`${formatNumber(item.apr)} %`}
                acquire={
                  <Flex flexDirection={'column'}>
                    <Button
                      as={Link}
                      href={item.getTokenURL}
                      isExternal
                      color={'white'}
                      variant={'primary'}
                    >
                      Get LP Token
                      <ExternalLinkIcon />
                    </Button>
                    <Button
                      as={Link}
                      href={item.stakeTokenURL}
                      isExternal
                      color={'white'}
                      variant={'primary'}
                      marginTop={'8px'}
                    >
                      Stake LP Token
                      <ExternalLinkIcon />
                    </Button>
                  </Flex>
                }
              />
            ))
          ) : (
            <></>
          )}
          {stakeMeta.map((item, index) => {
            const { totalRewards } = item;
            return (
              <FarmItem
                key={'farmRowStakeMeta' + index}
                asset={<TokenDescription token={item.stakingToken} />}
                stake={`${item.stakedBalance.format({ suffix: '' })}`}
                tvl={`$ ${item.tvl.format({ suffix: '' })}`}
                reward={
                  totalRewards.isZero() ? (
                    <Box w={'fit-content'}>
                      <TokenDescription token={item.rewardsToken} />
                    </Box>
                  ) : (
                    totalRewards.format()
                  )
                }
                apr={`${item.aprPercent.toFixed(1)} %`}
                acquire={
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
                }
                content={
                  <AccordionPanel mt={'16px'} width="full">
                    <Grid
                      templateColumns={[
                        'repeat(1, 1fr)',
                        'repeat(1, 1fr)',
                        'repeat(1, 1fr)',
                        'repeat(13, 1fr)',
                      ]}
                      templateRows={[
                        'repeat(3, 1fr)',
                        'repeat(3, 1fr)',
                        'repeat(3, 1fr)',
                        '1fr',
                      ]}
                      gap={6}
                    >
                      <GridItem width={'100%'} colSpan={5} rowSpan={1}>
                        <Container
                          variant={'token'}
                          padding={'16px'}
                          position="relative"
                        >
                          <DepositForm stakeMeta={item} />
                        </Container>
                      </GridItem>
                      <GridItem width={'100%'} colSpan={5} rowSpan={1}>
                        <Container
                          variant={'token'}
                          padding={'16px'}
                          position="relative"
                        >
                          <WithdrawForm stakeMeta={item} />
                        </Container>
                      </GridItem>
                      <GridItem
                        width={'100%'}
                        colSpan={[5, 5, 5, 3]}
                        rowSpan={1}
                      >
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
                }
              />
            );
          })}
        </Accordion>
        {params.children}
      </Box>
    </>
  );
}
