import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { IsolatedLending } from '../components/IsolatedLending';
import { WrapNativeCurrency } from '../components/WrapNativeCurrency';

export function Dashboard(params: React.PropsWithChildren<unknown>) {
  return (
    <>
      { params.children }
      <Outlet />
      <IsolatedLending />
      <WrapNativeCurrency />
    </>
  );
}