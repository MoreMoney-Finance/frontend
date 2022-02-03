import React from 'react';
import {
  StrategyMetadata,
  useIsolatedStrategyMetadata
} from '../chain-interaction/contracts';

export const StrategyMetadataContext = React.createContext<StrategyMetadata>(
  {}
);

export function StrategyMetadataCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  // const [stratMeta, setStratMeta] = React.useState({});
  const stratMeta = useIsolatedStrategyMetadata();

  React.useEffect(() => {
    // useIsolatedStrategyMetadataPromise().then((response) => {
    //   setStratMeta(response);
    // });
  }, []);

  return (
    <StrategyMetadataContext.Provider value={stratMeta}>
      {children}
    </StrategyMetadataContext.Provider>
  );
}
