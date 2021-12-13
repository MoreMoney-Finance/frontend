import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { AllSupportedCollateral } from '../components/AllSupportedCollateral';
import { LiquidatablePositions } from '../components/LiquidatablePositions';
import { WrapNativeCurrency } from '../components/WrapNativeCurrency';
import { UserAddressContext } from '../contexts/UserAddressContext';
import CurrentlyOpenPositions from '../components/CurrentlyOpenPositions';

export function Dashboard(params: React.PropsWithChildren<unknown>) {
  const account = React.useContext(UserAddressContext);
  return (
    <>
      {params.children}
      <Outlet />
      {account && (
        <CurrentlyOpenPositions account={account} />
      )}
      <AllSupportedCollateral />
      <WrapNativeCurrency />
      <LiquidatablePositions />
    </>
  );
}