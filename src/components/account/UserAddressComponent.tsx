import { Button, HStack, Image, Text, useMediaQuery } from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import colorDot from '../../assets/img/color_dot.svg';
import { useAddresses, useStable } from '../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../chain-interaction/tokens';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { WalletBalancesContext } from '../../contexts/WalletBalancesContext';

type Props = {
  handleOpenModal: any;
};

export function UserAddressComponent({ handleOpenModal }: Props) {
  const [isMobile] = useMediaQuery('(min-width: 768px)');
  const { activateBrowserWallet, chainId } = useEthers();
  const account = useContext(UserAddressContext);
  const stable = useStable();
  const balanceCtx = React.useContext(WalletBalancesContext);
  const moreToken = getTokenFromAddress(chainId, useAddresses().MoreToken);

  const walletBalance =
    balanceCtx.get(stable.address) ||
    new CurrencyValue(stable, BigNumber.from('0'));

  const moreBalance =
    balanceCtx.get(moreToken.address) ||
    new CurrencyValue(moreToken, BigNumber.from('0'));

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return (
    <HStack
      spacing={'18px'}
      bg={'brand.gradientBg'}
      padding={'4px 4px 4px 16px'}
      borderRadius={'10px'}
    >
      <HStack alignContent={'center'}>
        {walletBalance &&
        moreBalance &&
        !moreBalance.isZero() &&
        !walletBalance.isZero() ? (
          <Text fontSize={['12px', '14px', '14px']} textAlign="center">
            {walletBalance?.format({ significantDigits: 2 })}{' '}
            {isMobile ? '/' : <br />}
            &nbsp; {moreBalance?.format({ significantDigits: 2 })}
          </Text>
        ) : (
          <Image src={colorDot} />
        )}
      </HStack>
      <Button
        variant={'primary'}
        padding={'4px 20px'}
        h={'32px'}
        onClick={account ? handleOpenModal : handleConnectWallet}
      >
        {account ? (
          <Text
            fontSize={['12px', '14px', '14px']}
            lineHeight={'24px'}
            color={'brand.bg'}
            fontWeight={'600'}
          >
            {account &&
              `${account.slice(0, 6)}...${account.slice(
                account.length - 4,
                account.length
              )}`}
          </Text>
        ) : (
          <Text>Connect wallet</Text>
        )}
      </Button>
    </HStack>
  );
}
