import { Container } from '@chakra-ui/react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import AllAddresses from './components/AllAddresses';
import AllContracts from './components/AllContracts/AllContracts';
import AllOpenPositions from './components/AllOpenPositions/AllOpenPositions';

export default function AdminPage(props: React.PropsWithChildren<unknown>) {
  const { positions } = useParams();
  return (
    <>
      <Container>
        <AllAddresses />
        {props.children}
      </Container>
      {positions ? <AllOpenPositions /> : ''}
      <AllContracts />
    </>
  );
}
