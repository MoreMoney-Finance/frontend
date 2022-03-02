import { Container } from '@chakra-ui/react';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import AllAddresses from './components/AllAddresses';
import AllOpenPositions from './components/AllOpenPositions';

export default function AdminPage(props: React.PropsWithChildren<unknown>) {
  const location = useLocation();
  const details = location.search?.includes('details=true');
  return (
    <>
      <Container>
        <AllAddresses />
        {details ? <AllOpenPositions /> : ''}
        {props.children}
      </Container>
    </>
  );
}
