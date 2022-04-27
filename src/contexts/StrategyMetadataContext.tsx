import { Progress } from '@chakra-ui/react';
import React from 'react';
import {
  StrategyMetadata,
  useIsolatedStrategyMetadata,
} from '../chain-interaction/views/strategies';

export const StrategyMetadataContext = React.createContext<StrategyMetadata>(
  {}
);

export function StrategyMetadataCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const stratMeta = useIsolatedStrategyMetadata();

  return (
    <StrategyMetadataContext.Provider value={stratMeta}>
      {Object.values(stratMeta).length > 0 ? (
        children
      ) : (
        <Progress isIndeterminate />
      )}
    </StrategyMetadataContext.Provider>
  );
}
