import { Button } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import { useContext } from 'react';
import { UserAddressContext } from '../../contexts/UserAddressContext';

export function EnsureWalletConnected(
  params: React.PropsWithChildren<unknown>
) {
  const { activateBrowserWallet } = useEthers();
  const account = useContext(UserAddressContext);

  return (
    <>
      {account ? (
        params.children
      ) : (
        <Button
          variant={'submit'}
          onClick={() => {
            activateBrowserWallet();
          }}
        >
          Connect to a wallet
        </Button>
      )}
    </>
  );
}
