import React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export function TokenDataTable({
  tokenData,
}: {
  tokenData: ParsedStratMetaRow | null | undefined;
}) {
  return tokenData ? (
    <Table variant="simple">
      <Tbody>
        <Tr>
          <Th>Debt Ceiling</Th>
          <Td>{tokenData.debtCeiling.format()}</Td>
        </Tr>
        <Tr>
          <Th>Total Debt</Th>
          <Td>{tokenData.totalDebt.format()}</Td>
        </Tr>
        <Tr>
          <Th>Minting Fee</Th>
          <Td>{tokenData.mintingFeePercent.toString()} %</Td>
        </Tr>
        <Tr>
          <Th>Token</Th>
          <Td>{tokenData.token.name}</Td>
        </Tr>
        <Tr>
          <Th>Minimum colateralization ratio</Th>
          <Td>{(100 / tokenData.borrowablePercent).toString()} %</Td>
        </Tr>
        <Tr>
          <Th>USD Price</Th>
          <Td>{tokenData.usdPrice.toString()}</Td>
        </Tr>
      </Tbody>
    </Table>
  ) : (
    <> </>
  );
}
