import * as React from 'react';
import { Accordion } from '@chakra-ui/accordion';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useIsolatedPositionMetadata,
} from '../chain-interaction/contracts';
import { IsolatedTranche } from './IsolatedTranche';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';

export function IsolatedLending() {
  const stratMeta: ParsedStratMetaRow[] = Object.values(
    React.useContext(StrategyMetadataContext)
  ).flatMap((x) => x);

  const positionMeta: Record<string, ParsedPositionMetaRow> =
    useIsolatedPositionMetadata();

  return (
    <Accordion allowToggle allowMultiple defaultIndex={[0]}>
      {stratMeta.map((meta, i) => (
        <IsolatedTranche
          key={i + 1}
          {...meta}
          {...(positionMeta[`${meta.strategyAddress}-${meta.token.address}`] ??
            {})}
        />
      ))}
    </Accordion>
  );
}
