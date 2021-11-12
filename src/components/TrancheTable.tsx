import * as React from 'react';
import { ParsedPositionMetaRow } from '../chain-interaction/contracts';
import { Table, Thead, Tbody, Th } from '@chakra-ui/react';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { IsolatedTranche } from './IsolatedTranche';

export function TrancheTable({
  positions,
}: {
  positions: ParsedPositionMetaRow[];
}) {
  const allStratMeta = React.useContext(StrategyMetadataContext);

  return (
    <Table variant="simple" width="auto">
      <Thead>
        <Th>Asset</Th>
        <Th>Strategy</Th>
        <Th>APY</Th>
        <Th>Borrowable</Th>
        <Th>Min. ColRatio</Th>
        <Th>Collateral</Th>
        <Th>Debt</Th>
      </Thead>

      <Tbody>
        {positions.map((posMeta, i) => {
          const stratMeta = allStratMeta[posMeta.token.address];
          const data = { ...posMeta, ...stratMeta[posMeta.strategy] };
          return <IsolatedTranche key={i} {...data} />;
        })}
      </Tbody>
    </Table>
  );
}
