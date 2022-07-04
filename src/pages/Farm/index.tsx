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
import { formatEther } from '@ethersproject/units';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  iMoneyTotalSupply,
  useAddresses,
  useIMoneyAPR,
  usePlatypusAPR,
  useStable,
} from '../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../chain-interaction/tokens';
import {
  useLPAPR,
  useLPStaked,
  usePendingTokens,
  useTVLMasterMore,
} from '../../chain-interaction/contracts';
import {
  useStakeLPToken,
  useWithdrawLPToken,
} from '../../chain-interaction/transactions';
import { ExternalMetadataContext } from '../../contexts/ExternalMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { WalletBalancesContext } from '../../contexts/WalletBalancesContext';
import { formatNumber } from '../../utils';
import ClaimReward from './components/ClaimReward';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';
import FarmItem from './FarmItem';
import { JLPMasterMore } from '../../constants/addresses';

export default function FarmPage(params: React.PropsWithChildren<unknown>) {
  const account = useContext(UserAddressContext);
  const { chainId } = useEthers();

  const addresses = useAddresses();
  const jlpToken = getTokenFromAddress(chainId, JLPMasterMore);

  const { yieldFarmingData, yieldMonitor } = useContext(
    ExternalMetadataContext
  );
  const avaxMorePayload = Object.values(yieldMonitor).filter(
    (item) => item.lpAddress === '0xb8361d0e3f3b0fc5e6071f3a3c3271223c49e3d9'
  )[0];
  const { APR_MONEY, APR_USDC, MoneyTVL, usdcTVL } = usePlatypusAPR(account!);

  const externalData =
    avaxMorePayload && yieldFarmingData
      ? [
        ...yieldFarmingData,
        // {
        //   asset: 'MORE-AVAX',
        //   stake: 'n/a',
        //   tvl: formatNumber(avaxMorePayload.tvl),
        //   reward: 'MORE + ' + avaxMorePayload.rewardsCoin,
        //   apr: formatNumber(avaxMorePayload.totalApy),
        //   getTokenURL:
        //       'https://traderjoexyz.com/pool/AVAX/0xd9d90f882cddd6063959a9d837b05cb748718a05',
        //   stakeTokenURL:
        //       'https://traderjoexyz.com/farm/0xb8361D0E3F3B0fc5e6071f3a3C3271223C49e3d9-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00?fm=fm',
        // },
        {
          asset: 'MONEY (Platypus)',
          stake: 'n/a',
          tvl: formatNumber(parseFloat(MoneyTVL)),
          reward: 'n/a',
          apr: APR_MONEY.toFixed(2),
          getTokenURL: 'https://app.platypus.finance/pool?pool_group=factory',
          stakeTokenURL:
              'https://app.platypus.finance/pool?pool_group=factory',
        },
        {
          asset: 'USDC (Platypus)',
          stake: 'n/a',
          tvl: formatNumber(parseFloat(usdcTVL)),
          reward: 'n/a',
          apr: APR_USDC.toFixed(2),
          getTokenURL: 'https://app.platypus.finance/pool?pool_group=factory',
          stakeTokenURL:
              'https://app.platypus.finance/pool?pool_group=factory',
        },
      ]
      : [];

  const balanceCtx = React.useContext(WalletBalancesContext);
  const iMoneyAddress = useAddresses().StableLending2InterestForwarder;

  const stable = useStable();
  const iMoneyBalance =
    balanceCtx.get(iMoneyAddress) ??
    new CurrencyValue(stable, BigNumber.from('0'));

  const iMoneyTVL = formatEther(iMoneyTotalSupply(BigNumber.from('0')));

  const { baseRate, boostedRate, avgBoostedRate } = useIMoneyAPR(account!);

  const { sendDepositLPToken, depositState } = useStakeLPToken();
  const { sendWithdrawLPToken, withdrawState } = useWithdrawLPToken();

  const stakedJLP = new CurrencyValue(jlpToken, useLPStaked(account).amount);
  const rewards = usePendingTokens(account);

  const masterMoreTVL = useTVLMasterMore();
  const { baseAPR, boostedAPR } = useLPAPR(account);

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
          <FarmItem
            key={'farmRowMoreAvax'}
            asset="MORE-AVAX"
            stake={`${stakedJLP.format({})}`}
            tvl={`$ ${masterMoreTVL.toFixed(2)}`}
            reward={`MORE`}
            apr={
              account
                ? `${baseAPR.toFixed(1)}%+ ${boostedAPR}% boosted`
                : `${baseAPR.toFixed(1)}%`
            }
            acquire={
              <>
                <Button
                  as={Link}
                  href={
                    'https://traderjoexyz.com/pool/AVAX/0xd9d90f882cddd6063959a9d837b05cb748718a05'
                  }
                  isExternal
                  color={'white'}
                  variant={'primary'}
                >
                  Get LP Token
                  <ExternalLinkIcon />
                </Button>
              </>
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
                      <DepositForm
                        token={jlpToken}
                        stakingAddress={addresses.MasterMore}
                        sendStake={sendDepositLPToken}
                        stakeState={depositState}
                      />
                    </Container>
                  </GridItem>
                  <GridItem width={'100%'} colSpan={5} rowSpan={1}>
                    <Container
                      variant={'token'}
                      padding={'16px'}
                      position="relative"
                    >
                      <WithdrawForm
                        token={jlpToken}
                        stakedBalance={stakedJLP}
                        sendWithdraw={sendWithdrawLPToken}
                        withdrawState={withdrawState}
                      />
                    </Container>
                  </GridItem>
                  <GridItem width={'100%'} colSpan={[5, 5, 5, 3]} rowSpan={1}>
                    <Container
                      variant={'token'}
                      padding={'16px'}
                      position="relative"
                    >
                      <ClaimReward
                        rewards={rewards.pendingMore}
                        token={jlpToken}
                      />
                    </Container>
                  </GridItem>
                </Grid>
              </AccordionPanel>
            }
          />

          {externalData.length > 0 ? (
            externalData.map((item) => (
              <FarmItem
                key={'farmRow' + item.asset}
                asset={item.asset}
                stake={item.stake}
                tvl={`$ ${item.tvl}`}
                reward={`${item.reward}`}
                apr={`${item.apr} %`}
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
          <FarmItem
            key={'farmRow'}
            asset="MONEY staking"
            stake={iMoneyBalance.format({})}
            tvl={`$ ${formatNumber(parseFloat(iMoneyTVL))}`}
            reward={`n/a`}
            apr={
              account
                ? `${baseRate}%+ ${boostedRate}% boosted`
                : `${baseRate}%+ ${avgBoostedRate}% avg boosted`
            }
            acquire={
              <Flex flexDirection={'column'}>
                <Button
                  as={RouterLink}
                  to={'/imoney'}
                  color={'white'}
                  variant={'primary'}
                >
                  Earn MONEY
                </Button>
              </Flex>
            }
          />
        </Accordion>
        {params.children}
      </Box>
    </>
  );
}
