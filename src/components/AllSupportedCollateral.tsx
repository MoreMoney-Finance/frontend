import * as React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import {
  Box,
  Text,
  Flex,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import { TableTabs } from './TableTabs';
import { TableSearch } from './TableSearch';
import { TokenDescription } from './TokenDescription';
import { Column, useTable } from 'react-table';
import { Link } from 'react-router-dom';

type Entity = ParsedStratMetaRow & {
  asset: any;
  apy: string;
  MNYavailable: string;
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
        MNYavailable: meta.debtCeiling.sub(meta.totalDebt).format(),
        minColRatio:
          ((1 / (meta.borrowablePercent / 100)) * 100).toFixed(2) + '%',
        totalBorrowed: meta.totalDebt.format({ significantDigits: 2 }),
        liquidationFee: '10 %',
      };
    });

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
        Header: 'MNY available',
        accessor: 'MNYavailable',
      },
      {
        Header: 'Min. ColRatio',
        accessor: 'minColRatio',
      },
      {
        Header: 'Total borrowed',
        accessor: 'totalBorrowed',
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
      <Box textAlign="center">
        <Text fontSize="8" variant={'gradient'}>
          <b>Select a collateral to</b>
        </Text>
        <Text fontSize="12">Borrow MNY</Text>
        <Text fontSize="12">...and earn yield</Text>
      </Box>

      <Box>
        <Box>
          <Flex alignItems={'center'}>
            <TableTabs />
            <Spacer />
            <TableSearch setSearchString={setSearchString} />
          </Flex>
        </Box>
        <Box>
          <Table
            variant="unstyled"
            {...getTableProps()}
          >
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
        </Box>
      </Box>
    </>
  );
}
