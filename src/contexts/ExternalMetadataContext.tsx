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
    fetch('https://staging-api.yieldyak.com/apys')
      .then((response) => response.json())
      .then(setYYMeta)
      .catch((err) => {
        console.error('Failed to fetch URL');
        console.error(err);
      });

    fetch(
      '/ym/api/symbol/getFarmsForDex?partner=tj&amp;dexName[]=traderJoeV3&amp;dexName[]=traderjoe&page=1&order=liquidity&orderMethod=desc'
    )
      .then((response) => response.json())
      .then((response) => {
        const ymData: Record<string, YieldMonitorMetadata> = {};
        for (const r of response) {
          const a = getAddress(r.lpAddress);
          if (!(a in ymData) || r.totalApy > ymData[a].totalApy) {
            ymData[a] = r;
          }
        }
        setYieldMonitor(ymData);
      })
      .catch((err) => {
        console.error('Failed to fetch URL');
        console.error(err);
      });
  }, []);
  return (
    <ExternalMetadataContext.Provider
      value={
        { yyMetadata, yieldMonitor } as unknown as ExternalMetadataType
      }
    >
      {children}
    </ExternalMetadataContext.Provider>
  );
}
