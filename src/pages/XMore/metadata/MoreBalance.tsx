import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useAddresses } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import { useWalletBalance } from '../../../contexts/WalletBalancesContext';

export function MoreBalance(props: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const moreToken = getTokenFromAddress(chainId, useAddresses().MoreToken);
  const xMoreToken = getTokenFromAddress(chainId, useAddresses().xMore);

  const moreBalance =
    useWalletBalance(moreToken.address) ??
    new CurrencyValue(moreToken, BigNumber.from('0'));
  const xMoreBalance =
    useWalletBalance(xMoreToken.address) ??
    new CurrencyValue(xMoreToken, BigNumber.from('0'));

  return (
    <GridItem rowSpan={[12, 12, 2]} colSpan={[12, 12, 1]}>
      <Container variant={'token'} padding={'46px'}>
        <Flex flexDirection={'column'} justifyContent="center">
          <Flex flexDirection={'row'}>
            <img
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
              alt="MoreMoney Logo"
              width="90px"
              height="90px"
              style={{ borderRadius: '100%' }}
            />
            <Flex direction={'column'} padding="16px" justifyContent={'center'}>
              <Text variant="bodyHuge">{moreBalance.format()}</Text>
            </Flex>
          </Flex>
          <br />
          <Flex flexDirection={'row'}>
            <img
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
              alt="MoreMoney Logo"
              width="90px"
              height="90px"
              style={{ borderRadius: '100%' }}
            />
            <Flex direction={'column'} padding="16px" justifyContent={'center'}>
              <Text variant="bodyHuge">{xMoreBalance.format()}</Text>
            </Flex>
          </Flex>
        </Flex>
        {props.children}
      </Container>
    </GridItem>
  );
}
