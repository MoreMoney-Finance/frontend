import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Accordion,
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
} from '@chakra-ui/react';
import { formatEther } from '@ethersproject/units';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import {
  iMoneyTotalSupply,
  useAddresses,
  useIMoneyAPR,
  useStable,
} from '../../chain-interaction/contracts';
import {
  ExternalMetadataContext,
  YieldFarmingData,
} from '../../contexts/ExternalMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { WalletBalancesContext } from '../../contexts/WalletBalancesContext';
import { formatNumber } from '../../utils';
import FarmItem from './FarmItem';
import { Link as RouterLink } from 'react-router-dom';

export default function FarmPage(params: React.PropsWithChildren<unknown>) {
  const account = useContext(UserAddressContext);

  const { yieldFarmingData, yieldMonitor } = useContext(
    ExternalMetadataContext
  );
  const avaxMorePayload = Object.values(yieldMonitor).filter(
    (item) => item.lpAddress === '0xb8361d0e3f3b0fc5e6071f3a3c3271223c49e3d9'
  )[0];

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

  const stable = useStable();
  const iMoneyBalance =
    balanceCtx.get(iMoneyAddress) ??
    new CurrencyValue(stable, BigNumber.from('0'));

  const iMoneyTVL = formatEther(iMoneyTotalSupply(BigNumber.from('0')));

  const { baseRate, boostedRate, avgBoostedRate } = useIMoneyAPR(account!);

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
