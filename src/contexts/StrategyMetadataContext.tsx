import React from 'react';
import { StrategyMetadata, useIsolatedStrategyMetadata } from '../chain-interaction/contracts';

export const StrategyMetadataContext = React.createContext<
  StrategyMetadata
>({});

export function StrategyMetadataCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const stratMeta = useIsolatedStrategyMetadata();

  return (
    <StrategyMetadataContext.Provider value={stratMeta}>
      {children}
    </StrategyMetadataContext.Provider>
  );
}
