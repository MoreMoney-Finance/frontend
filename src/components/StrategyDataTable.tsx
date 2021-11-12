import * as React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { Table, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { useTallyHarvestBalance } from '../chain-interaction/transactions';

export function StrategyDataTable(row: ParsedStratMetaRow) {
  const { sendTallyHarvestBalance } = useTallyHarvestBalance(
    row.strategyAddress
  );
  const balance2Tally = row.harvestBalance2Tally;
  return (
    <Table variant="simple" width="auto">
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
          <Td>
            {balance2Tally.isZero() ? (
              balance2Tally.format()
            ) : (
              <Button
                onClick={() => sendTallyHarvestBalance(row.token.address)}
              >
                {' '}
                Tally {balance2Tally.format}{' '}
              </Button>
            )}
          </Td>
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
