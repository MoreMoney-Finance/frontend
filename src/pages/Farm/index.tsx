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
import { formatEther, parseEther } from '@ethersproject/units';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber, ethers } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import {
  iMoneyTotalSupply,
  useAddresses,
  useBoostedSharePer10k,
  useIMoneyAccountInfo,
  useIMoneyTotalWeights,
  useInterestRate,
  useSpecialRewardsData,
  useStable,
} from '../../chain-interaction/contracts';
import {
  useStakeIMoney,
  useWithdrawIMoney,
  useWithdrawLaunchVestingTrans,
} from '../../chain-interaction/transactions';
import {
  ExternalMetadataContext,
  YieldFarmingData,
} from '../../contexts/ExternalMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { WalletBalancesContext } from '../../contexts/WalletBalancesContext';
import { formatNumber, sqrt } from '../../utils';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';
import FarmItem from './FarmItem';

export default function FarmPage(params: React.PropsWithChildren<unknown>) {
  const account = useContext(UserAddressContext);

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

  const balanceCtx = React.useContext(WalletBalancesContext);
  const iMoneyAddress = useAddresses().StableLending2InterestForwarder;

  const { sendDepositIMoney, depositState } = useStakeIMoney();
  const { sendWithdrawIMoney, withdrawState: withdrawIMoneyState } =
    useWithdrawIMoney();

  const stable = useStable();
  const iMoneyBalance =
    balanceCtx.get(iMoneyAddress) ??
    new CurrencyValue(stable, BigNumber.from('0'));

  const iMoneyTVL = formatEther(iMoneyTotalSupply(BigNumber.from('0')));

  const currentRate = useInterestRate(BigNumber.from(0));
  const boostedShare = useBoostedSharePer10k(BigNumber.from(0));
  const accountInfo = useIMoneyAccountInfo(account!);
  const weight = sqrt(
    accountInfo.factor.mul(
      accountInfo.depositAmount.isZero()
        ? parseEther('100')
        : accountInfo.depositAmount
    )
  );
  const totalWeights = useIMoneyTotalWeights(parseEther('100'));

  const baseRate = (currentRate * (100 - boostedShare)) / 100;
  const boostedRate =
    weight
      .mul(Math.round(currentRate * boostedShare))
      .div(totalWeights)
      .toNumber() / 100;

  const avgBoostedRate = (currentRate * boostedShare) / 100;

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
              tvl={`n/a`}
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
            acquire={<></>}
            content={
              <AccordionPanel mt="16px">
                <Grid templateColumns="repeat(10, 1fr)" gap={6}>
                  <GridItem w="100%" colSpan={5}>
                    <Container
                      variant={'token'}
                      padding={'16px'}
                      position="relative"
                    >
                      <DepositForm
                        token={stable}
                        stakingAddress={iMoneyAddress}
                        sendStake={sendDepositIMoney}
                        stakeState={depositState}
                      />
                    </Container>
                  </GridItem>
                  <GridItem w="100%" colSpan={5}>
                    <Container
                      variant={'token'}
                      padding={'16px'}
                      position="relative"
                    >
                      <WithdrawForm
                        token={stable}
                        stakedBalance={iMoneyBalance}
                        sendWithdraw={sendWithdrawIMoney}
                        withdrawState={withdrawIMoneyState}
                      />
                    </Container>
                  </GridItem>
                </Grid>
              </AccordionPanel>
            }
          />
        </Accordion>
        {params.children}
      </Box>
    </>
  );
}
