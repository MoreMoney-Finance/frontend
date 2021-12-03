import React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { Table, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useUpdatePriceOracle } from '../chain-interaction/transactions';
import { StatusTrackModal } from './StatusTrackModal';

export function TokenDataTable({
  tokenData,
  liquidationFee,
}: {
  tokenData: ParsedStratMetaRow | null | undefined;
  liquidationFee: BigNumber;
}) {
  const { sendUpdatePriceOracle, updatePriceOracleState } =
    useUpdatePriceOracle(tokenData?.token);

  return tokenData ? (
    <>
      <StatusTrackModal state={updatePriceOracleState} title="Price Oracle" />
      <Table variant="simple" width="auto">
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
            <Th>Liquidation Fee</Th>
            <Td>{(liquidationFee.toNumber() / 100).toFixed(2)}%</Td>
          </Tr>
          <Tr>
            <Th>Minimum colateralization ratio</Th>
            <Td>
              {((1 / (tokenData.borrowablePercent / 100)) * 100).toFixed(2)} %
            </Td>
          </Tr>
          <Tr>
            <Th>USD Price</Th>
            <Td>
              {tokenData.usdPrice.toString()}{' '}
              <Button onClick={sendUpdatePriceOracle} size="sm">
                Update
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  ) : (
    <> </>
  );
}
