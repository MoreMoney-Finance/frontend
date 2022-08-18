import {
  Container,
  Flex,
  GridItem,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import lines from '../../../assets/img/lines.svg';
import {
  useAddresses,
  useIMoneyAPR,
  useStable,
} from '../../../chain-interaction/contracts';
import { useViewPendingReward } from '../../../chain-interaction/transactions';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import { WalletBalancesContext } from '../../../contexts/WalletBalancesContext';

export function StakingAPRIMoney(props: React.PropsWithChildren<unknown>) {
  const account = React.useContext(UserAddressContext);
  const balanceCtx = React.useContext(WalletBalancesContext);
  const iMoneyAddress = useAddresses().StableLending2InterestForwarder;

  const stable = useStable();
  const iMoneyBalance =
    balanceCtx.get(iMoneyAddress) ??
    new CurrencyValue(stable, BigNumber.from('0'));

  const pendingRewards = new CurrencyValue(
    stable,
    useViewPendingReward(account!, BigNumber.from(0))
  );

  const { baseRate, boostedRate, avgBoostedRate } = useIMoneyAPR(account!);

  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
      <Container variant={'token'} padding={'30px'}>
        <Image
          src={lines}
          position="absolute"
          right="0"
          bottom="0"
          pointerEvents="none"
          zIndex={0}
        />
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignContent={'center'}
          alignItems={'center'}
          h={'full'}
          padding={'30px 80px 40px 40px'}
        >
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Average boosted APR
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>{`${avgBoostedRate.toFixed(2)}%`}</Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              iMONEY APR
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>
              {account
                ? `${baseRate.toFixed(2)}% + ${boostedRate.toFixed(2)}% `
                : `${baseRate.toFixed(2)}% + ${avgBoostedRate.toFixed(2)}% avg`}
            </Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Staked MONEY
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>{iMoneyBalance.format()}</Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Claimable
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}> {pendingRewards.format()}</Text>
          </Flex>
        </Flex>
        {props?.children}
      </Container>
    </GridItem>
  );
}
