import { Button } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';

export function EnsureWalletConnected(
  params: React.PropsWithChildren<unknown>
) {
  const { activateBrowserWallet, account } = useEthers();

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
