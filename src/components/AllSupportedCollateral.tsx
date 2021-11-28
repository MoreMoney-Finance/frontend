import * as React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Thead,
  Box,
  Text,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { TokenDescription } from './TokenDescription';
import { Link } from 'react-router-dom';
import { TableTabs } from './TableTabs';
import { TableSearch } from './TableSearch';

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
        <Text fontSize="2rem" variant={'gradient'}>
          <b>Select a collateral type to</b>
        </Text>
        <Text fontSize="3rem">Create a Maker Vault & Borrow Coin</Text>
        <Text fontSize="3rem">or buy additional collateral.</Text>
      </Box>

      <Box>
        <Box>
          <Flex alignItems={'center'}>
            <TableTabs />
            <Spacer />
            <TableSearch />
          </Flex>
        </Box>
        <Box>
          <Table variant="simple">
            <Thead>
              <Th>Asset</Th>
              <Th>Strategy</Th>
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

                  <Td>{meta.strategyName}</Td>

                  <Td>{meta.APY.toFixed(4)} %</Td>

                  <Td>{meta.debtCeiling.sub(meta.totalDebt).format()}</Td>

                  <Td>
                    {((1 / (meta.borrowablePercent / 100)) * 100).toFixed(2)} %
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </>
  );
}
