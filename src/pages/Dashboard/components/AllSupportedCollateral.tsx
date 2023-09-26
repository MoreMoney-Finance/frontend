import { InfoIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Divider,
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
import CustomTooltip from '../../../components/data-display/CustomTooltip';
import { TokenDescriptionTable } from '../../../components/tokens/TokenDescriptionTable';
import { hiddenStrategies } from '../../../constants/hidden-strategies';
import { LiquidationFeesContext } from '../../../contexts/LiquidationFeesContext';
import { StrategyMetadataContext } from '../../../contexts/StrategyMetadataContext';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import { useOpenPositions } from '../../../hooks/useOpenPositions';
import { currencyFormat } from '../../../utils';
import { TableSearch } from './TableSearch';
import { TableTabs } from './TableTabs';

type Entity = ParsedStratMetaRow & {
  asset: any;
  apy: any;
  MONEYavailable: string;
  // tvlPeg: string;
  borrowablePercentFormatted: string;
  totalBorrowed: string;
  liquidationFee: string;
  balance: number;
  ltv: string;
  divider?: React.ReactNode;
  positionHealth?: React.ReactNode;
  positionCollateral?: React.ReactNode;
  positionDebt?: string;
};

export function AllSupportedCollateral() {
  const hiddenTokens: Set<string> = new Set([]);
  const account = React.useContext(UserAddressContext);

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
          debtCeiling: nextStrat.debtCeiling,
          totalDebt: aggStrat.totalDebt.add(nextStrat.totalDebt),
          tvlInPeg: aggStrat.tvlInPeg.add(nextStrat.tvlInPeg),
        };
      });
    });

  const { rows: myPositions, rowsMap: myPositionsMap } = useOpenPositions(
    account ?? ''
  );
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
      const customAPY =
        meta.underlyingAPY !== undefined
          ? Math.round(meta.underlyingAPY) + Math.round(meta.APY)
          : Math.round(meta.APY);

      const positions = myPositionsMap[meta.token.address];

      const positionHealth =
        positions && positions[0] && positions[0].positionHealth;
      const positionHealthColor =
        positions && positions[0] && positions[0].positionHealthColor;

      const positionCollateral =
        positions &&
        positions.reduce((agg, next) => agg + next.collateralNumber, 0);

      const positionDebt =
        positions && positions.reduce((agg, next) => agg + next.debtNumber, 0);
      const positionCollateralUsd = positionCollateral * meta.usdPrice;

      return {
        ...meta,
        divider: (
          <Divider
            orientation="vertical"
            w="70px"
            h="70px"
            position="absolute"
            top="15px"
          />
        ),
        positionHealth: (
          <Text
            color={
              positionHealthColor == 'accent'
                ? 'accent_color'
                : positionHealthColor
            }
          >
            {positionHealth ?? '-'}
          </Text>
        ),
        positionCollateral: (
          <Flex direction="column">
            {positionCollateral ? (
              <Text>{positionCollateral?.toFixed(3)}</Text>
            ) : (
              '-'
            )}
            {positionCollateralUsd > 0 && (
              <Text fontSize="14px">
                {currencyFormat(positionCollateralUsd)}
              </Text>
            )}
          </Flex>
        ),
        positionDebt: currencyFormat(positionDebt),
        asset: <TokenDescriptionTable token={meta.token} />,
        apy: (
          <Box position="relative">
            <Text fontSize="26px">{customAPY + '%'} </Text>
            {meta.underlyingAPY ? (
              <CustomTooltip
                label={
                  <>
                    underlying:{' '}
                    {Math.round(meta.underlyingAPY || meta.APY) + '%'},<br />{' '}
                    compounding: {Math.round(meta.APY)}%
                  </>
                }
              />
            ) : null}
          </Box>
        ),
        MONEYavailable: meta.debtCeiling.gt(meta.totalDebt)
          ? meta.debtCeiling.sub(meta.totalDebt).format({ suffix: '' })
          : '0',
        minColRatio: `${Math.round(
          (1 / (meta.borrowablePercent / 100)) * 100
        )}%`,
        ltv: `${5 * Math.round(meta.borrowablePercent / 5)}%`,
        // tvlPeg: `$ ${meta.tvlInPeg.format({ suffix: '' })}`,
        borrowablePercentFormatted: `${
          5 * Math.round(meta.borrowablePercent / 5)
        }%`,
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
        {colName} &nbsp;
        <Tooltip hasArrow label={label} bg="gray.300" color="black">
          <InfoIcon />
        </Tooltip>
      </Flex>
    );
  }

  const columnsNotLoggedIn: Column<Entity>[] = [
    {
      Header: 'Collateral Asset ',
      accessor: 'asset',
    },
    {
      Header: tooltip(
        'APY ',
        'The yield you earn on your deposited collateral'
      ),
      accessor: 'apy',
    },
    {
      Header: 'Max. collateral/debt ratio ',

      accessor: 'borrowablePercentFormatted',
    },
    {
      Header: 'MONEY available ',

      accessor: 'MONEYavailable',
    },
  ];
  const columnsLoggedIn: Column<Entity>[] = [
    ...columnsNotLoggedIn,
    {
      Header: '',
      accessor: 'divider',
    },
    {
      Header: 'My position ',
      accessor: 'positionHealth',
    },
    {
      Header: 'My collateral ',
      accessor: 'positionCollateral',
    },
    {
      Header: 'My debt ',
      accessor: 'positionDebt',
    },
  ];

  const columnsMemoLoggedIn = React.useMemo<Column<Entity>[]>(
    () => columnsLoggedIn,
    []
  );

  const columnsMemoNotLoggedIn = React.useMemo<Column<Entity>[]>(
    () => columnsNotLoggedIn,
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns:
        myPositions && myPositions.length > 0
          ? columnsMemoLoggedIn
          : columnsMemoNotLoggedIn,
      data,
    });
  return (
    <>
      <Box
        // textAlign={['center', 'center', 'center', 'left']}
        textAlign="left"
        margin="100px 0"
        ml={['0%', '20%', '20%', '40%']}
      >
        <Text fontSize={['36', '48', '48']} lineHeight="56px" fontWeight="700">
          Borrow MONEY while earning
        </Text>
        <Text fontSize={['36', '48', '48']} lineHeight="56px" fontWeight="700">
          yield on your collateral
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
              <Container
                background="rgba(255, 255, 255, 0.15)"
                borderRadius="10px"
                marginTop={'20px'}
                padding="8px"
              >
                {row.cells.map((cell, index) => {
                  // eslint-disable-next-line
                  return (
                    <Flex
                      key={'cellMobile' + index}
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                      p={'4'}
                    >
                      <Box fontFamily={'Poppins'} color={'white'}>
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
                  height="94px"
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
