import { Box, Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import * as React from 'react';
import { Column, useTable } from 'react-table';
import { ParsedStratMetaRow } from '../../../../chain-interaction/contracts';
import ChangeStrategyButton from './ChangeStrategyButton';

type Entity = {
  strategyName: string;
  apy: string;
  totalBorrowed: string;
  action: any;
};

export function ChangeStrategyTable({
  stratMeta,
  chooseStrategy,
  currentStrategy,
  onClose,
}: {
  stratMeta: Record<string, ParsedStratMetaRow>;
  chooseStrategy: (strategyToChoose: string) => void;
  currentStrategy: string;
  onClose: () => void;
}) {
  const data = Object.keys(stratMeta).map((key) => {
    const meta = stratMeta[key];
    return {
      strategyAddress: meta.strategyAddress,
      strategyName: meta.strategyName,
      apy: meta.APY.toFixed(2) + '%',
      totalBorrowed: meta.totalDebt.format({ significantDigits: 2 }),
      action:
        meta.strategyAddress === currentStrategy ? (
          <>Current strategy</>
        ) : (
          <ChangeStrategyButton
            onClose={onClose}
            chooseStrategy={() => {
              chooseStrategy(meta.strategyAddress);
            }}
          />
        ),
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
