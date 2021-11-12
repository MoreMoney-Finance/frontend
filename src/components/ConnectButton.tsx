import { Button } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import React, { useContext } from 'react';
import { UserAddressContext } from '../contexts/UserAddressContext';

export default function ConnectButton() {
  const { activateBrowserWallet } = useEthers();

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  const account = useContext(UserAddressContext);

  return account ? (
    <></>
  ) : (
    <Button onClick={handleConnectWallet} sx={{ fontSize: 'larger' }}>
      Connect to wallet
    </Button>
  );
}
