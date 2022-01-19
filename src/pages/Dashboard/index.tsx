import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { AllSupportedCollateral } from './components/AllSupportedCollateral';

export default function Dashboard(params: React.PropsWithChildren<unknown>) {
  // const account = React.useContext(UserAddressContext);
  // const location = useLocation();
  // const details = location.search?.includes('details=true');

  return (
    <>
      {params.children}
      <Outlet />
      <AllSupportedCollateral />
    </>
  );
}
