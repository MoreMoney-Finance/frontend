import React, { useEffect, useState } from 'react';

export type YYMetadata = Record<string, { apr: number, apy: number, lastReinvest: { timestamp: number}}>;

export const YYMetadataContext = React.createContext<YYMetadata>({});

export function YYMetadataCtxProvider({
  children,
}: React.PropsWithChildren<any>) {

  const [yyMeta, setYYMeta] = useState<YYMetadata>({});

  useEffect(() => {
    (async () => {
      const response = await fetch('https://staging-api.yieldyak.com/apys');
      const data = (await response.json()) as YYMetadata;
      setYYMeta(data);
      // console.log('Set data', data);
    })();
  }, []);
  
  return (
    <YYMetadataContext.Provider value={yyMeta}>
      {children}
    </YYMetadataContext.Provider>
  );
}
