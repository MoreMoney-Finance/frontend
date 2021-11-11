import * as React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export function StrategyDataTable(row: ParsedStratMetaRow) {
  return (
    <Table variant="simple">
      <Tbody>
        <Tr>
          <Th>Stability Fee</Th>
          <Td>{row.stabilityFeePercent.toString()} %</Td>
        </Tr>
        {/* <Tr>
          <Th>Strategy Address</Th>
          <Td>{row.strategyAddress.toString()}</Td>
        </Tr> */}
        <Tr>
          <Th>APY</Th>
          <Td>{row.APY.toString()} %</Td>
        </Tr>
        <Tr>
          <Th>Total Collateral</Th>
          <Td>{row.totalCollateral.format()}</Td>
        </Tr>
        <Tr>
          <Th>Minimum colateralization ratio</Th>
          <Td>{(100 / row.borrowablePercent).toString()} %</Td>
        </Tr>
        <Tr>
          <Th>Harvest Balance To tally</Th>
          <Td>{row.harvestBalance2Tally.format()}</Td>
        </Tr>
        <Tr>
          <Th>Strategy Name</Th>
          <Td>{row.strategyName.toString()}</Td>
        </Tr>
        <Tr>
          <Th>TVL in Token</Th>
          <Td>{row.tvlInToken.format()}</Td>
        </Tr>
        <Tr>
          <Th>TVL in Peg</Th>
          <Td>{row.tvlInPeg.format()}</Td>
        </Tr>
        <Tr>
          <Th>Yield Type</Th>
          <Td>{row.yieldType.toString()}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
