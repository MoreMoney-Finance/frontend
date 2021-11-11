import { Accordion } from '@chakra-ui/accordion';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ParsedPositionMetaRow, ParsedStratMetaRow, useIsolatedPositionMetadata } from '../chain-interaction/contracts';
import { IsolatedTranche } from '../components/IsolatedTranche';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';

export function TokenPage(props: React.PropsWithChildren<unknown>) {
  const params = useParams<'tokenAddress'>();
  const tokenAddress = params.tokenAddress;
  const allStratMeta = React.useContext(StrategyMetadataContext);

  const stratMeta: ParsedStratMetaRow[] = tokenAddress && tokenAddress in allStratMeta ? allStratMeta[tokenAddress] : [];
  const positionMeta: Record<string, ParsedPositionMetaRow> = useIsolatedPositionMetadata();

  return (
    <>
      { props.children }
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
    </>
  );
}