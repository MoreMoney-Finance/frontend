import { Container, Flex, GridItem, Image, Text } from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useAddresses } from '../../../chain-interaction/views/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import { useWalletBalance } from '../../../contexts/WalletBalancesContext';

export function MoreBalance() {
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
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 2]}>
      <Container variant={'token'} padding={'46px'}>
        <Flex flexDirection={['column', 'column', 'row']} height={'100%'}>
          <Flex
            flexDirection={'row'}
            alignItems="center"
            width={['100%', '100%', '50%']}
          >
            <Image
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Moremoney_05.jpg"
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
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/xMORE%20logo.png"
              alt="MoreMoney Logo"
              width="40px"
              height="40px"
              borderRadius="100%"
            />
            <Flex direction={'column'} padding="16px" justifyContent={'center'}>
              <Text variant="bodyHuge">{xMoreBalance.format()}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </GridItem>
  );
}
