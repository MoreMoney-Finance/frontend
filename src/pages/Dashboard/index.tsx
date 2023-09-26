import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { AllSupportedCollateral } from './components/AllSupportedCollateral';
import { Container } from '@chakra-ui/react';
import robotIcon from '../../assets/img/Robot.png';

export default function Dashboard(params: React.PropsWithChildren<unknown>) {
  // const account = React.useContext(UserAddressContext);
  // const location = useLocation();
  // const details = location.search?.includes('details=true');

  return (
    <>
      {/* ROBOT IMAGE */}
      <Container
        width="741px"
        height="627.497px"
        maxWidth="1280px"
        position="absolute"
        top="60px"
        zIndex="-1"
        display={['none', 'none', 'block']}
        backgroundImage={`url(${robotIcon})`}
        backgroundPosition="top"
        backgroundSize="120%"
        backgroundRepeat="no-repeat"
      />

      {/* ROBOT IMAGE MOBILE */}
      <Container
        width="100%"
        height="627.497px"
        position="absolute"
        top="-70px"
        zIndex="-1"
        display={['block', 'block', 'none']}
        backgroundImage={`url(${robotIcon})`}
        backgroundPosition="left"
        backgroundSize="100%"
        backgroundRepeat="no-repeat"
      />
      {params.children}
      <Outlet />
      <AllSupportedCollateral />
    </>
  );
}
