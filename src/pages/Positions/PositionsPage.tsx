import { Box, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useContext } from 'react';
import CurrentlyOpenPositions from '../../components/CurrentlyOpenPositions';
import { UserAddressContext } from '../../contexts/UserAddressContext';

export function PositionsPage(params: React.PropsWithChildren<unknown>) {
  const account = useContext(UserAddressContext);
  return (
    <>
      <Box padding={'12'} width={'full'}>
        <Text align={'start'} fontSize={'4xl'}>
          My Positions
        </Text>
      </Box>
      {account && <CurrentlyOpenPositions account={account} />}
      {params.children}
    </>
  );
}
