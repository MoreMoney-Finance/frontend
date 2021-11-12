import * as React from 'react';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Thead,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { TokenDescription } from './TokenDescription';

export function IsolatedLending() {
  const stratMeta: ParsedStratMetaRow[] = Object.values(
    React.useContext(StrategyMetadataContext)
  ).flatMap((x) => Object.values(x));

  return (
    <Table variant="simple" width="auto">
      <TableCaption> Available tokens and strategies </TableCaption>
      <Thead>
        <Th>Asset</Th>
        <Th>Strategy</Th>
        <Th>APY</Th>
        <Th>Borrowable</Th>
        <Th>Min. ColRatio</Th>
      </Thead>
      <Tbody>
        {stratMeta.map((meta, i) => (
          <Tr
            as={Link}
            key={i}
            to={`/token/${meta.token.address}`}
            display="table-row"
          >
            <Td>
              <TokenDescription token={meta.token} />
            </Td>

            <Td>{meta.strategyName}</Td>

            <Td>{meta.APY.toPrecision(4)} %</Td>

            <Td>{meta.debtCeiling.sub(meta.totalDebt).format()}</Td>

            <Td>{(100 / meta.borrowablePercent).toPrecision(4)} %</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
