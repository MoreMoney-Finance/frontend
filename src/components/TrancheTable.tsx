import * as React from 'react';
import { ParsedPositionMetaRow } from '../chain-interaction/contracts';
import { Table, Thead, Tbody, Th } from '@chakra-ui/react';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { IsolatedTranche } from './IsolatedTranche';

export type TrancheAction = {
  args?: (pos: ParsedPositionMetaRow) => Record<string, any>;
  callback?: (pos: ParsedPositionMetaRow) => void;
  label: string;
};

export function TrancheTable({
  positions,
  action,
}: {
  positions: ParsedPositionMetaRow[];
  action?: TrancheAction;
}) {
  const allStratMeta = React.useContext(StrategyMetadataContext);

  return (
    <Table variant="simple" width="auto">
      <Thead>
        <Th>Asset</Th>
        <Th>Strategy</Th>
        <Th>APY</Th>
        <Th>Min. ColRatio</Th>
        <Th> Current ColRatio</Th>
        <Th>Liquidation price</Th>
        <Th>Collateral</Th>
        <Th>Debt</Th>
        {action ? <Th>Action</Th> : undefined}
      </Thead>

      <Tbody>
        {positions.map((posMeta, i) => {
          const stratMeta = allStratMeta[posMeta.token.address];
          const data = { ...posMeta, ...stratMeta[posMeta.strategy] };
          return (
            <IsolatedTranche
              key={`isolatedTranche${i}`}
              {...data}
              action={action}
            />
          );
        })}
      </Tbody>
    </Table>
  );
}
