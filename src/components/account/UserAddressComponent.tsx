import * as React from 'react';
import { Button, Text, HStack, Image } from '@chakra-ui/react';
import { useEthers, CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { WalletBalancesContext } from '../../contexts/WalletBalancesContext';
import { useStable } from '../../chain-interaction/contracts';
import colorDot from '../../assets/img/color_dot.svg';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { useContext } from 'react';

type Props = {
  handleOpenModal: any;
};

export function UserAddressComponent({ handleOpenModal }: Props) {
  const { activateBrowserWallet } = useEthers();
  const account = useContext(UserAddressContext);
  const stable = useStable();
  const balanceCtx = React.useContext(WalletBalancesContext);
  const walletBalance =
    balanceCtx.get(stable.address) ||
    new CurrencyValue(stable, BigNumber.from('0'));

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
      <HStack>
        {walletBalance && !walletBalance.isZero() ? (
          <Text fontSize={['12px', '14px', '14px']}>
            {walletBalance?.format({ significantDigits: 2 })}
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
