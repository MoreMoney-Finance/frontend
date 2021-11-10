import React from 'react';
import { Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';

interface TableProps {
  rows: ParsedStratMetaRow[];
}

export const IsolatedTrancheTable: React.FC<TableProps> = ({
  rows,
}: TableProps) => {
  return (
    <Table variant="simple">
      <Tbody>
        {rows.map((row, index) => {
          return (
            <div key={'tablerow' + index}>
              <Tr>
                <Th>Debt Ceiling</Th>
                <Td>{row.debtCeiling.toString()}</Td>
              </Tr>
              <Tr>
                <Th>Total Debt</Th>
                <Td>{row.totalDebt.toString()}</Td>
              </Tr>
              <Tr>
                <Th>Stability Fee</Th>
                <Td>{row.stabilityFeePercent.toString()}</Td>
              </Tr>
              <Tr>
                <Th>Minting Fee</Th>
                <Td>{row.mintingFeePercent.toString()}</Td>
              </Tr>
              <Tr>
                <Th>Strategy Name</Th>
                <Td>{row.strategyAddress.toString()}</Td>
              </Tr>
              <Tr>
                <Th>USD Price</Th>
                <Td>{row.token.toString()}</Td>
              </Tr>
              <Tr>
                <Th>APY</Th>
                <Td>{row.APY.toString()}</Td>
              </Tr>
              <Tr>
                <Th>Total Collateral</Th>
                <Td>{row.totalCollateral.toString()}</Td>
              </Tr>
              <Tr>
                <Th>TVL in USD</Th>
                <Td>{row.borrowablePercent.toString()}</Td>
              </Tr>
              <Tr>
                <Th>Harvest Balance Totally</Th>
                <Td>{row.harvestBalance2Tally.toString()}</Td>
              </Tr>
              <Tr>
                <Th>USD Price</Th>
                <Td>{row.usdPrice.toString()}</Td>
              </Tr>
              <Tr>
                <Th>Strategy Name</Th>
                <Td>{row.strategyName.toString()}</Td>
              </Tr>
              <Tr>
                <Th>TVL in Token</Th>
                <Td>{row.tvlInToken.toString()}</Td>
              </Tr>
              <Tr>
                <Th>TVL in Peg</Th>
                <Td>{row.tvlInPeg.toString()}</Td>
              </Tr>
              <Tr>
                <Th>Yield Type</Th>
                <Td>{row.yieldType.toString()}</Td>
              </Tr>
            </div>
          );
        })}
      </Tbody>
    </Table>
  );
};
