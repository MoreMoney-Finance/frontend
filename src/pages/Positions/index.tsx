import { Box, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useContext } from 'react';
import CurrentlyOpenPositions from './CurrentlyOpenPositions';
import { UserAddressContext } from '../../contexts/UserAddressContext';

export default function PositionsPage(
  params: React.PropsWithChildren<unknown>
) {
  const account = useContext(UserAddressContext);
  return (
    <>
      <Box marginTop={'16px'} marginBottom="16px" width={'full'}>
        <Text align={'start'} fontSize={'4xl'}>
          My Positions
        </Text>
      </Box>
      {account && <CurrentlyOpenPositions account={account} />}
      {params.children}
    </>
  );
}
