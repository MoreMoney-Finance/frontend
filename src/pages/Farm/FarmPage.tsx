import { Box, Table, Td, Text, Thead, Tr } from '@chakra-ui/react';
import * as React from 'react';

export function FarmPage(params: React.PropsWithChildren<unknown>) {
  return (
    <>
      <Box padding={'12'} width={'full'}>
        <Text align={'start'} fontSize={'4xl'}>
          MoreMoney Farm
        </Text>
        <br />
        <br />
        <br />
        <Table variant="simple" width="full">
          <Thead>
            <Tr>
              <Td>Token</Td>
              <Td>TVL</Td>
              <Td>APY</Td>
              <Td>Actions</Td>
            </Tr>
          </Thead>
        </Table>
        {params.children}
      </Box>
    </>
  );
}
