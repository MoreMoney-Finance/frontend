import * as React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';
import { Box, Table, Thead, Tbody, Tr, Td, Button } from '@chakra-ui/react';
import { Column, useTable } from 'react-table';

type Entity = {
  strategyName: string;
  apy: string;
  totalBorrowed: string;
  action: any;
};

export function ChangeStrategyTable({
  stratMeta,
}: {
  stratMeta: Record<string, ParsedStratMetaRow>;
}) {
  const data = Object.keys(stratMeta).map((key) => {
    const meta = stratMeta[key];
    return {
      strategyName: meta.strategyName,
      apy: meta.APY.toFixed(2) + '%',
      totalBorrowed: meta.totalDebt.format({ significantDigits: 2 }),
      action: <Button>Choose</Button>,
    };
  });

  const columns = React.useMemo<Column<Entity>[]>(
    () => [
      {
        Header: 'Strategy Name',
        accessor: 'strategyName',
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
        Header: 'Action',
        accessor: 'action',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <Box width="100%">
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
                  <Tr {...row.getRowProps()} display="table-row">
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
