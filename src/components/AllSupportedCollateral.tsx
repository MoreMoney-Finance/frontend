import * as React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { Box, Text, Flex, Table, Thead, Tbody, Tr, Td } from '@chakra-ui/react';
import { TableTabs } from './TableTabs';
import { TableSearch } from './TableSearch';
import { TokenDescription } from './TokenDescription';
import { Column, useTable } from 'react-table';
import { Link } from 'react-router-dom';

type Entity = ParsedStratMetaRow & {
  asset: any;
  apy: string;
  MONEYavailable: string;
  minColRatio: string;
  totalBorrowed: string;
  liquidationFee: string;
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

  const [searchString, setSearchString] = React.useState('');

  const data = stratMeta
    .filter((meta) =>
      searchString.length > 0
        ? meta.token.name.toLowerCase().includes(searchString) ||
          meta.token.ticker.toLowerCase().includes(searchString)
        : true
    )
    .map((meta) => {
      return {
        ...meta,
        asset: <TokenDescription token={meta.token} />,
        apy: meta.APY.toFixed(4) + '%',
        MONEYavailable: meta.debtCeiling.sub(meta.totalDebt).format(),
        minColRatio:
          ((1 / (meta.borrowablePercent / 100)) * 100).toFixed(2) + '%',
        totalBorrowed: meta.totalDebt.format({ significantDigits: 2 }),
        liquidationFee: '10 %',
      };
    });

  const columns = React.useMemo<Column<Entity>[]>(
    () => [
      {
        Header: 'Collateral Asset',
        accessor: 'asset',
      },
      {
        Header: 'Collateral APY',
        accessor: 'apy',
      },
      {
        Header: 'Total borrowed',
        accessor: 'totalBorrowed',
      },
      {
        Header: 'MONEY available',
        accessor: 'MONEYavailable',
      },
      {
        Header: 'Min. ColRatio',
        accessor: 'minColRatio',
      },
      {
        Header: 'Liquidation Fee',
        accessor: 'liquidationFee',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <Box textAlign="center" margin="100px 0">
        <Text fontSize="24" lineHeight="56px" color="whiteAlpha.600">
          <b>Select a collateral asset to </b>
        </Text>
        <Text fontSize="48" lineHeight="56px">
          Take an interest free loan that repays
        </Text>
        <Text fontSize="48" lineHeight="56px">
          itself with yield from collateral
        </Text>
      </Box>

      <Box width="100%">
        <Box zIndex="var(--chakra-zIndices-header)" position="relative">
          <Flex alignItems={'center'} justifyContent="space-between">
            <TableTabs />
            <TableSearch setSearchString={setSearchString} />
          </Flex>
        </Box>
        <>
          <Table variant="dashboard" {...getTableProps()}>
            <Thead>
              {headerGroups.map((headerGroup) => (
                // eslint-disable-next-line
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    // eslint-disable-next-line
                    <Td {...column.getHeaderProps()}>
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
                  <Tr
                    {...row.getRowProps()}
                    as={Link}
                    to={`/token/${row.original.token.address}`}
                    display="table-row"
                  >
                    {row.cells.map((cell) => {
                      // eslint-disable-next-line
                      return (
                        // eslint-disable-next-line
                        <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </>
      </Box>
    </>
  );
}
