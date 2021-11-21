import * as React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { Table, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { useTallyHarvestBalance } from '../chain-interaction/transactions';
import { getExplorerAddressLink } from '@usedapp/core';

export function StrategyDataTable(row: ParsedStratMetaRow) {
  const { sendTallyHarvestBalance } = useTallyHarvestBalance(
    row.strategyAddress
  );
  const balance2Tally = row.harvestBalance2Tally;

  const explorerLink = getExplorerAddressLink(
    row.strategyAddress,
    row.token.chainId
  );

  return (
    <Table variant="simple" width="auto">
      <Tbody>
        <Tr>
          <Th>Strategy</Th>
          <Td>
            <a
              href={explorerLink}
              target={'_blank'}
              rel="noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              {row.strategyName.toString()}
            </a>
          </Td>
        </Tr>
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
          <Td>{((1 / (row.borrowablePercent / 100)) * 100).toFixed(2)} %</Td>
        </Tr>
        <Tr>
          <Th>Loan to value ratio</Th>
          <Td>{row.borrowablePercent.toString()} %</Td>
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
