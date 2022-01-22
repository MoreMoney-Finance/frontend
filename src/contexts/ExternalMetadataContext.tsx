import { getAddress } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';

export type YYMetadata = Record<
  string,
  { apr: number; apy: number; lastReinvest: { timestamp: number } }
>;

export type YieldMonitorMetadata = {
  poolNumber: string;
  symbol0Name: string;
  symbol1Name: string;
  symbol0address: string;
  symbol0price: string;
  symbol1address: string;
  symbol1price: string;
  network: string;
  lpAddress: string;
  coinsASec: number;
  tvl: number;
  apy: number;
  apyDaily: number;
  apyMonthly: number;
  totalApy: number;
  totalApyDaily: number;
  totalApyMonthly: number;
  extraRewards: string;
  isActive: boolean;
  rewardsCoin: string;
};

export type ExternalMetadataType = {
  yyMetadata: YYMetadata;
  yieldMonitor: Record<string, YieldMonitorMetadata>;
};

export const ExternalMetadataContext =
  React.createContext<ExternalMetadataType>({
    yyMetadata: {},
    yieldMonitor: {},
  });

export function ExternalMetadataCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const [yyMetadata, setYYMeta] = useState<YYMetadata>({});
  const [yieldMonitor, setYieldMonitor] = useState<
    Record<string, YieldMonitorMetadata>
  >({});

  useEffect(() => {
    const urls = [
      'https://staging-api.yieldyak.com/apys',
      '/ym/api/symbol/getFarmsForDex?partner=tj&amp;dexName[]=traderJoeV3&amp;dexName[]=traderjoe&page=1&order=liquidity&orderMethod=desc',
    ];
    Promise.all(
      urls.map((url) =>
        fetch(url).then((response) => response.json())
      )
    )
      .then((responses) => {
        setYYMeta(responses[0] as YYMetadata);
        // console.log('from yield monitor', responses[1]);
        setYieldMonitor(Object.fromEntries(responses[1].map((r:YieldMonitorMetadata) => [getAddress(r.lpAddress), r])));
      })
      .catch((err) => {
        console.error('Failed to fetch one or more of these URLs:');
        console.log(urls);
        console.error(err);
      });
  }, []);
  return (
    <ExternalMetadataContext.Provider
      value={{ yyMetadata, yieldMonitor } as unknown as ExternalMetadataType}
    >
      {children}
    </ExternalMetadataContext.Provider>
  );
}
