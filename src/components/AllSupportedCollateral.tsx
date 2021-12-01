import * as React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { Box, Text, Flex, Spacer, Table, Thead, Tbody, Tr, Td } from '@chakra-ui/react';
import { TableTabs } from './TableTabs';
import { TableSearch } from './TableSearch';
import { TokenDescription } from './TokenDescription';
import { Column, useTable } from 'react-table';
import { Link } from 'react-router-dom';

type Entity = ParsedStratMetaRow & {
  asset: any;
  apy: string;
  MONEYavailable: string;
  MinColRatio: string;
};

export function AllSupportedCollateral() {
  const stratMeta: ParsedStratMetaRow[] = Object.values(
    React.useContext(StrategyMetadataContext)
  ).map((x) =>
    Object.values(x).reduce((aggStrat, nextStrat) => ({
      ...aggStrat,
      APY: aggStrat.APY > nextStrat.APY ? aggStrat.APY : nextStrat.APY,
      debtCeiling: aggStrat.debtCeiling.add(nextStrat.debtCeiling),
      totalDebt: aggStrat.totalDebt.add(nextStrat.totalDebt),
    }))
  );

  const data = React.useMemo<Entity[]>(
    () =>
      stratMeta.map((meta) => {
        return {
          ...meta,
          asset: <TokenDescription token={meta.token} />,
          apy: meta.APY.toFixed(4) + '%',
          MONEYavailable: meta.debtCeiling.sub(meta.totalDebt).format(),
          MinColRatio:
            ((1 / (meta.borrowablePercent / 100)) * 100).toFixed(2) + '%',
        };
      }),
    []
  );

  const columns = React.useMemo<Column<Entity>[]>(
    () => [
      {
        Header: 'Asset',
        accessor: 'asset',
      },
      {
        Header: 'APY',
        accessor: 'apy',
      },
      {
        Header: 'MONEY available',
        accessor: 'MONEYavailable',
      },
      {
        Header: 'Min. ColRatio',
        accessor: 'MinColRatio',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <Box textAlign="center">
        <Text fontSize="8" variant={'gradient'}>
          <b>Select a collateral to</b>
        </Text>
        <Text fontSize="12">Borrow MONEY</Text>
        <Text fontSize="12">...and earn yield</Text>
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
          <Table variant="unstyled" {...getTableProps()}
            sx={{
              borderCollapse: 'separate',
              borderSpacing: '0 10px'
            }}>
            <Thead>
              {headerGroups.map((headerGroup) => (
                // eslint-disable-next-line
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    // eslint-disable-next-line
                    <Td
                      {...column.getHeaderProps()}
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      {column.render('Header')}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  // eslint-disable-next-line
                  <Tr {...row.getRowProps()}
                    as={Link}
                    to={`/token/${row.original.token.address}`}
                    display="table-row"
                    bg="gray.900">
                    {row.cells.map((cell) => {
                      // eslint-disable-next-line
                      return (
                        // eslint-disable-next-line
                        <Td
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </>
  );
}
