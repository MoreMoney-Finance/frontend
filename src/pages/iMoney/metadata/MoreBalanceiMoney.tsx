import { Container, Flex, GridItem, Image, Text } from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useAddresses, useStable } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import {
  useWalletBalance,
  WalletBalancesContext,
} from '../../../contexts/WalletBalancesContext';

export function MoreBalanceIMoney() {
  const { chainId } = useEthers();
  const balanceCtx = React.useContext(WalletBalancesContext);
  const moneyToken = getTokenFromAddress(chainId, useAddresses().Stablecoin);
  const iMoneyAddress = useAddresses().StableLending2InterestForwarder;
  const stable = useStable();
  const iMoneyBalance =
    balanceCtx.get(iMoneyAddress) ??
    new CurrencyValue(stable, BigNumber.from('0'));

  const moreBalance =
    useWalletBalance(moneyToken.address) ??
    new CurrencyValue(moneyToken, BigNumber.from('0'));

  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 2]}>
      <Container variant={'token'} padding={'46px'}>
        <Flex flexDirection={['column', 'column', 'row']} height={'100%'}>
          <Flex
            flexDirection={'row'}
            alignItems="center"
            width={['100%', '100%', '50%']}
          >
            <Image
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
              alt="MoreMoney Logo"
              width="40px"
              height="40px"
              borderRadius="100%"
            />
            <Flex direction={'column'} padding="16px" justifyContent={'center'}>
              <Text variant="bodyHuge">{moreBalance.format()}</Text>
            </Flex>
          </Flex>

          <Flex
            flexDirection={'row'}
            alignItems="center"
            marginLeft={['0px', '0px', '70px']}
          >
            <Image
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
              alt="MoreMoney Logo"
              width="40px"
              height="40px"
              borderRadius="100%"
            />
            <Flex direction={'column'} padding="16px" justifyContent={'center'}>
              <Text variant="bodyHuge">{iMoneyBalance.format()}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </GridItem>
  );
}
