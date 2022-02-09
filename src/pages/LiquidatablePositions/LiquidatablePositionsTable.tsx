import { Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import * as React from 'react';
import { ParsedPositionMetaRow } from '../../chain-interaction/contracts';
import { StrategyMetadataContext } from '../../contexts/StrategyMetadataContext';
import { LiquidatableRow } from './LiquidatableRow';

export type LiquidatableAction = {
  args?: (pos: ParsedPositionMetaRow) => Record<string, any>;
  callback?: (pos: ParsedPositionMetaRow) => void;
  label: string;
};

export function LiquidatablePositionsTable({
  positions,
  action,
}: {
  positions: ParsedPositionMetaRow[];
  action?: LiquidatableAction;
}) {
  const allStratMeta = React.useContext(StrategyMetadataContext);

  return (
    <Table variant="dashboard" width="auto">
      <Thead>
        <Tr>
          <Td>Position Health</Td>
          <Td>Asset</Td>
          <Td>Min Col Ratio</Td>
          <Td>Current Col Ratio</Td>
          <Td>Liquidation price</Td>
          <Td>Collateral</Td>
          <Td>Debt</Td>
          <Td>Liquidate</Td>
        </Tr>
      </Thead>

      <Tbody>
        {positions.map((posMeta, i) => {
          const stratMeta = allStratMeta[posMeta.token.address];
          const data = { action, ...posMeta, ...stratMeta[posMeta.strategy] };
          if (posMeta.collateralValue.isZero()) {
            return <></>;
          }
          return <LiquidatableRow key={`liquidatableRow${i}`} {...data} />;
        })}
      </Tbody>
    </Table>
  );
}
