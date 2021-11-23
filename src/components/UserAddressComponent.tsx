import * as React from 'react';
import { Button, Box, Text } from '@chakra-ui/react';
import { useEthers, CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { WalletBalancesContext } from '../contexts/WalletBalancesContext';
import { useStable } from '../chain-interaction/contracts';

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

  return account ? (
    <Box
      display="flex"
      alignItems="center"
      background="gray.700"
      borderRadius="2xl"
      py="0"
    >
      <Box px="3">
        <Text color="white" fontSize="md">
          {walletBalance?.format({ significantDigits: 12 })}
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg="gray.800"
        border="1px solid transparent"
        _hover={{
          border: '1px',
          borderStyle: 'solid',
          borderColor: 'blue.400',
          backgroundColor: 'gray.700',
        }}
        borderRadius="2xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium">
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.length
            )}`}
        </Text>
      </Button>
    </Box>
  ) : (
    <Button onClick={handleConnectWallet}>Connect to a wallet</Button>
  );
}
