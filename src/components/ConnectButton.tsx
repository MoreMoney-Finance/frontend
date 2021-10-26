import { Box, Text, Button } from '@chakra-ui/react';
import { useEthers, shortenAddress } from '@usedapp/core';
import React, { useContext } from 'react';
import { UserAddressContext } from './UserAddressContext';

export default function ConnectButton() {
  const { activateBrowserWallet } = useEthers();

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  const account = useContext(UserAddressContext);

  return account ? (
    <Box sx={{ float: 'right' }}>
      <Text>{shortenAddress(account)}</Text>
    </Box>
  ) : (
    <Button onClick={handleConnectWallet} sx={{ fontSize: 'larger' }}>
      Connect to wallet
    </Button>
  );
}
