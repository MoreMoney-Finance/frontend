import { InfoIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { ParsedStratMetaRow } from '../../../chain-interaction/contracts';
import { TokenDescription } from '../../../components/tokens/TokenDescription';
import { hiddenStrategies } from '../../../constants/hidden-strategies';
import { LiquidationFeesContext } from '../../../contexts/LiquidationFeesContext';
import { StrategyMetadataContext } from '../../../contexts/StrategyMetadataContext';
import { TableSearch } from './TableSearch';
import { TableTabs } from './TableTabs';

type Entity = ParsedStratMetaRow & {
  asset: any;
  apy: string;
  MONEYavailable: string;
  tvlPeg: string;
  totalBorrowed: string;
  liquidationFee: string;
  balance: number;
  ltv: string;
};

export function AllSupportedCollateral() {
  const hiddenTokens: Set<string> = new Set([]);
  const stratMeta: ParsedStratMetaRow[] = Object.values(
    React.useContext(StrategyMetadataContext)
  )
    .filter(
      (stratRows: Record<string, ParsedStratMetaRow>) =>
        !hiddenTokens.has(Object.values(stratRows)[0].token.ticker)
    )
    .map((x: Record<string, ParsedStratMetaRow>) => {
      const tokenAddress = x[Object.keys(x)[0]].token.address;
      const options = Object.values(x);
      const optionsFiltered = Object.values(x).filter(
        (y) =>
          hiddenStrategies[tokenAddress] &&
          !hiddenStrategies[tokenAddress].includes(y.strategyAddress)
      );

      return (
        hiddenStrategies[tokenAddress] ? optionsFiltered : options
      ).reduce((aggStrat, nextStrat) => {
        return {
          ...aggStrat,
          APY: aggStrat.APY > nextStrat.APY ? aggStrat.APY : nextStrat.APY,
          debtCeiling: aggStrat.debtCeiling.add(nextStrat.debtCeiling),
          totalDebt: aggStrat.totalDebt.add(nextStrat.totalDebt),
          tvlInPeg: aggStrat.tvlInPeg.add(nextStrat.tvlInPeg),
        };
      });
    });

  const tokenFees = React.useContext(LiquidationFeesContext);
  const [tableTabFilter, setTableTabFilter] = React.useState<string[]>([]);
  const [searchString, setSearchString] = React.useState('');

  const data = stratMeta
    .filter((meta) => {
      if (tableTabFilter.length === 0) {
        return true;
      } else if (tableTabFilter.includes(meta.token.ticker)) {
        return true;
      } else {
        return false;
      }
    })
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
        apy: Math.round(meta.APY) + '%',
        MONEYavailable: meta.debtCeiling
          .sub(meta.totalDebt)
          .format({ suffix: '' }),
        minColRatio: `${Math.round(
          (1 / (meta.borrowablePercent / 100)) * 100
        )}%`,
        ltv: `${5 * Math.round(meta.borrowablePercent / 5)}%`,
        tvlPeg: `$ ${meta.tvlInPeg.format({ suffix: '' })}`,
        totalBorrowed: meta.totalDebt.format({ significantDigits: 2 }),
        liquidationFee:
          (tokenFees.get(meta.token.address) ?? 'Loading...') + '%',
        balance: meta.balance,
      };
    })
    .sort(function (a, b) {
      if (a.token.ticker < b.token.ticker) {
        return -1;
      }
      if (a.token.ticker > b.token.ticker) {
        return 1;
      }
      return 0;
    })
    .sort((a, b) => b.balance - a.balance);

  function tooltip(colName: string, label: string) {
    return (
      <Flex>
        {' '}
        {colName} &nbsp;
        <Tooltip hasArrow label={label} bg="gray.300" color="black">
          <InfoIcon />
        </Tooltip>
      </Flex>
    );
  }

  const columns = React.useMemo<Column<Entity>[]>(
    () => [
      {
        Header: tooltip(
          'Collateral Asset ',
          'The kinds of collateral you can deposit to borrow MONEY'
        ),
        accessor: 'asset',
      },
      {
        Header: tooltip(
          'APY earned  ',
          'The yield you earn on your deposited collateral'
        ),
        accessor: 'apy',
      },
      {
        Header: tooltip(
          'MONEY available ',
          'How much in total still can be borrowed against this asset'
        ),
        accessor: 'MONEYavailable',
      },
      {
        Header: tooltip(
          'TVL ',
          'Total amount of this asset locked in our protocol, in US dollars'
        ),
        accessor: 'tvlPeg',
      },
      {
        Header: tooltip(
          'Max LTV ',
          'How much of your deposited value you can extract as MONEY loan'
        ),
        accessor: 'ltv',
      },
      {
        Header: tooltip(
          'Liquidation Fee ',
          'Percentage of loan paid if you get liquidated'
        ),
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
          <b>Select a collateral asset to</b>
        </Text>
        <Text fontSize={['36', '48', '48']} lineHeight="56px">
          <b>Open an interest-free debt position</b>
        </Text>
        <Text fontSize={['36', '48', '48']} lineHeight="56px">
          that improves with yield from
        </Text>
        <Text fontSize={['36', '48', '48']} lineHeight="56px">
          collateral
        </Text>
      </Box>

      <Box width="100%">
        <Box zIndex="var(--chakra-zIndices-header)" position="relative">
          <Flex
            wrap={'wrap'}
            alignItems={'center'}
            justifyContent="space-between"
          >
            <TableTabs
              setTableTabFilter={setTableTabFilter}
              stratMeta={stratMeta}
            />
            <TableSearch setSearchString={setSearchString} />
          </Flex>
        </Box>
        <Flex
          p={[0, 4, 4]}
          display={['flex', 'flex', 'flex', 'none', 'none']}
          flexDirection={'column'}
        >
          {rows.map((row) => {
            prepareRow(row);
            const headers = headerGroups
              .map((headerGroup) => {
                return headerGroup.headers.map((column) =>
                  column.render('Header')
                );
              })
              .flat(1);
            return (
              // eslint-disable-next-line
              <Container variant="token" marginTop={'20px'}>
                {row.cells.map((cell, index) => {
                  // eslint-disable-next-line
                  return (
                    <Flex
                      key={'cellMobile' + index}
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                      p={'4'}
                    >
                      <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
                        {headers[index]}
                      </Box>
                      <Box>{cell.render('Cell')}</Box>
                    </Flex>
                  );
                })}
                {/* </Tbody> */}
                {/* </Table> */}
                <Button
                  as={Link}
                  to={`/token/${row.original.token.address}`}
                  key={row.id}
                  w={'full'}
                >
                  View
                </Button>
              </Container>
            );
          })}
        </Flex>

        <Table
          display={['none', 'none', 'none', 'table', 'table']}
          variant="dashboard"
          {...getTableProps()}
        >
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
      </Box>
    </>
  );
}
