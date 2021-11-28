import * as React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { Table, Tbody, Tr, Th, Td, Thead, Box } from '@chakra-ui/react';
import { TokenDescription } from './TokenDescription';
import { Link } from 'react-router-dom';

export function AllSupportedCollateral() {
  const stratMeta: ParsedStratMetaRow[] = Object.values(
    React.useContext(StrategyMetadataContext)
  ).map((x) =>
    Object.values(x).reduce((highestStrat, nextStrat) =>
      highestStrat.APY > nextStrat.APY ? highestStrat : nextStrat
    )
  );

  return (
    <>
      <Box textAlign="center">
        <h2> Supported collateral </h2>
      </Box>

      <Table variant="simple" width="auto">
        <Thead>
          <Th>Asset</Th>
          <Th>APY</Th>
          <Th>Borrowable</Th>
          <Th>Min. ColRatio</Th>
        </Thead>
        <Tbody>
          {stratMeta.map((meta) => (
            <Tr
              key={`colRow-${meta.token.address}`}
              as={Link}
              to={`/token/${meta.token.address}`}
              display="table-row"
            >
              <Td>
                <TokenDescription token={meta.token} />
              </Td>

              <Td>{meta.APY.toFixed(4)} %</Td>

              <Td>{meta.debtCeiling.sub(meta.totalDebt).format()}</Td>

              <Td>
                {((1 / (meta.borrowablePercent / 100)) * 100).toFixed(2)} %
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
