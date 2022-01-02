import { useEthers } from '@usedapp/core';
import React from 'react';
import { useLocation } from 'react-router-dom';

export const UserAddressContext = React.createContext<
  string | null | undefined
>(undefined);

export function UserAddressCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const { account } = useEthers();
  const { search } = useLocation();
  const userAddress = new URLSearchParams(search).get('account');

  return (
    <UserAddressContext.Provider value={userAddress ?? account}>
      {children}
    </UserAddressContext.Provider>
  );
}
