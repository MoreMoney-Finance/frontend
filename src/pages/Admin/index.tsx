import { Container } from '@chakra-ui/react';
import * as React from 'react';
import AllAddresses from './components/AllAddresses';
import AllOpenPositions from './components/AllOpenPositions';

export default function AdminPage(props: React.PropsWithChildren<unknown>) {
  return (
    <>
      <Container>
        <AllAddresses />
        <AllOpenPositions />
        {props.children}
      </Container>
    </>
  );
}
