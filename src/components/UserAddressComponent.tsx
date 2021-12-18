import * as React from 'react';
import { Button, Text, HStack, Image } from '@chakra-ui/react';
import { useEthers, CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { WalletBalancesContext } from '../contexts/WalletBalancesContext';
import { useStable } from '../chain-interaction/contracts';
import colorDot from '../assets/img/color_dot.svg';

type Props = {
  handleOpenModal: any;
};

export function UserAddressComponent({ handleOpenModal }: Props) {
  const { activateBrowserWallet, account } = useEthers();
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
          <Text variant={'bodySmall'} lineHeight={'24px'}>
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
            variant={'bodySmall'}
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
