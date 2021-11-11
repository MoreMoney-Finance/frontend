import * as React from 'react';
import { IsolatedLending } from '../components/IsolatedLending';
import { WrapNativeCurrency } from '../components/WrapNativeCurrency';

export function Dashboard(params: React.PropsWithChildren<unknown>) {
  return (
    <>
      { params.children }
      <IsolatedLending />
      <WrapNativeCurrency />
    </>
  )
}