import { useEthers } from '@usedapp/core';
import React from 'react';

export const UserAddressContext = React.createContext<
  string | null | undefined
>(undefined);

export function UserAddressCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const { account } = useEthers();

  return (
    <UserAddressContext.Provider value={account}>
      {children}
    </UserAddressContext.Provider>
  );
}
