import { Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import * as React from 'react';
import { ParsedPositionMetaRow } from '../../chain-interaction/contracts';
import { StrategyMetadataContext } from '../../contexts/StrategyMetadataContext';
import { TrancheRow } from './TrancheRow';

export type TrancheAction = {
  args?: (pos: ParsedPositionMetaRow) => Record<string, any>;
  callback?: (pos: ParsedPositionMetaRow) => void;
  label: string;
};

export function TrancheTable({
  positions,
}: {
  positions: ParsedPositionMetaRow[];
  action?: TrancheAction;
}) {
  const allStratMeta = React.useContext(StrategyMetadataContext);

  return (
    <Table variant="dashboard" width="auto">
      <Thead>
        <Tr>
          <Td>Position Health</Td>
          <Td>Asset</Td>
          <Td>Strategy</Td>
          <Td>APY</Td>
          <Td>Cur. ColRatio</Td>
          <Td>Liq. price</Td>
          <Td>Collateral</Td>
          <Td>Debt</Td>
        </Tr>
      </Thead>

      <Tbody>
        {positions.map((posMeta, i) => {
          const stratMeta = allStratMeta[posMeta.token.address];
          const data = { ...posMeta, ...stratMeta[posMeta.strategy] };
          if (posMeta.collateralValue.isZero()) {
            return <></>;
          }
          return <TrancheRow key={`isolatedTranche${i}`} {...data} />;
        })}
      </Tbody>
    </Table>
  );
}
