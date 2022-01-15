import { Box, Text } from '@chakra-ui/react';
import * as React from 'react';

export default function LiquidationProtectedLoans(
  params: React.PropsWithChildren<unknown>
) {
  return (
    <>
      <Box textAlign="center" margin="100px 0">
        <Text fontSize="48" lineHeight="56px">
          Coming soon: Liquidation protected loans
        </Text>
      </Box>
      {params.children}
    </>
  );
}
