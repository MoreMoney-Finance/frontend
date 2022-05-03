import { Button } from '@chakra-ui/react';
import * as React from 'react';
import { useContext } from 'react';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { useConnectWallet } from '../../utils';

export function EnsureWalletConnected(
  params: React.PropsWithChildren<unknown>
) {
  const { onConnect } = useConnectWallet();
  const account = useContext(UserAddressContext);

  return (
    <>
      {account ? (
        params.children
      ) : (
        <Button
          variant={'submit'}
          onClick={() => {
            onConnect();
          }}
        >
          Connect to a wallet
        </Button>
      )}
    </>
  );
}
