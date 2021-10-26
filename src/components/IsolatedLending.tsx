import * as React from 'react';
import { Accordion } from '@chakra-ui/accordion';
import {
  ParsedStratMetaRow,
  useIsolatedStrategyMetadata,
} from '../chain-interaction/contracts';
import { IsolatedTranche } from './IsolatedTranche';

export function IsolatedLending() {
  const stratMeta: ParsedStratMetaRow[] = useIsolatedStrategyMetadata();

  return (
    <Accordion allowToggle allowMultiple defaultIndex={[0]}>
      {stratMeta.map((meta, i) => (
        <IsolatedTranche key={i + 1} {...meta} />
      ))}
    </Accordion>
  );
}
