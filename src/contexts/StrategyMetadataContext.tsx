import React from 'react';
import {
  StrategyMetadata
} from '../chain-interaction/contracts';

export const StrategyMetadataContext = React.createContext<StrategyMetadata>(
  {}
);

export function StrategyMetadataCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const stratMeta = JSON.parse(localStorage.getItem('stratMeta') ?? '[]');
  // const stratMeta = useIsolatedStrategyMetadata(stratMetaCached);

  // if (localStorage.getItem('stratMeta') === null) {
  //   localStorage.setItem('stratMeta', JSON.stringify(stratMeta));
  // }

  return (
    <StrategyMetadataContext.Provider value={stratMeta}>
      {children}
    </StrategyMetadataContext.Provider>
  );
}
