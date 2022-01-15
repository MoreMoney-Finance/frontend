import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { WrapNativeCurrency } from './components/WrapNativeCurrency';
import { AllSupportedCollateral } from './components/AllSupportedCollateral';
import { LiquidatablePositions } from './components/LiquidatablePositions';

export default function Dashboard(params: React.PropsWithChildren<unknown>) {
  // const account = React.useContext(UserAddressContext);
  const location = useLocation();
  const details = location.search?.includes('details=true');

  return (
    <>
      {params.children}
      <Outlet />
      <AllSupportedCollateral />
      {details ? <WrapNativeCurrency /> : undefined}
      <LiquidatablePositions />
    </>
  );
}
