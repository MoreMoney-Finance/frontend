import { getAddress } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';

export type YYMetadata = Record<
  string,
  { apr: number; apy: number; lastReinvest: { timestamp: number } }
>;

export type xMoreMetadata = {
  timestamp: number;
  totalSupply: number;
  moreBalance: number;
  cachedAPR: number;
  currentRatio: number;
};

export type YieldFarmingData = {
  asset: string;
  stake: string;
  tvl: number;
  reward: string;
  apr: number;
  getTokenURL: string;
  stakeTokenURL: string;
};

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
  yieldFarmingData: YieldFarmingData[];
  yyMetadata: YYMetadata;
  yieldMonitor: Record<string, YieldMonitorMetadata>;
  xMoreData: xMoreMetadata;
  additionalYieldData: Record<string, Record<string, number>>;
  underlyingStrategyNames: Map<string, string>;
  yyAvaxAPY: number;
};

export const ExternalMetadataContext =
  React.createContext<ExternalMetadataType>({
    yieldFarmingData: [],
    yyMetadata: {},
    yieldMonitor: {},
    xMoreData: {} as xMoreMetadata,
    additionalYieldData: {},
    yyAvaxAPY: 0,
    underlyingStrategyNames: new Map<string, string>()
  });

export function ExternalMetadataCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const [xMoreData, setXMoreData] = useState<xMoreMetadata>(
    {} as xMoreMetadata
  );
  const [yyAvaxAPY, setYYAvaxAPY] = useState<number>(0);
  const [yieldFarmingData, setYieldFarmingData] = useState<YieldFarmingData>();
  const [yyMetadata, setYYMeta] = useState<YYMetadata>({});
  const [yieldMonitor, setYieldMonitor] = useState<
    Record<string, YieldMonitorMetadata>
  >({});

  const [additionalYieldData, setAdditionalYieldData] = useState<
    Record<string, Record<string, number>>
  >({});

  useEffect(() => {
    fetch('https://staging-api.yieldyak.com/apys')
      .then((response) => response.json())
      .then(setYYMeta)
      .catch((err) => {
        console.error('Failed to fetch URL');
        console.error(err);
      });

    fetch(`https://staging-api.yieldyak.com/yyavax`)
      .then((response) => response.json())
      .then((data) => setYYAvaxAPY(data?.yyAVAX?.apy))
      .catch((err) => {
        console.error('Failed to fetch URL');
        console.error(err);
      });

    fetch(
      'https://raw.githubusercontent.com/MoreMoney-Finance/craptastic-api/main/src/yield-monitor.json'
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
    fetch(
      'https://raw.githubusercontent.com/MoreMoney-Finance/craptastic-api/main/src/yield-farming.json'
    )
      .then((response) => response.json())
      .then((response) => setYieldFarmingData(response))
      .catch((err) => {
        console.error('Failed to fetch URL');
        console.error(err);
      });

    fetch(
      'https://raw.githubusercontent.com/MoreMoney-Finance/craptastic-api/main/src/xmore-data.json'
    )
      .then((response) => response.json())
      .then((response) => setXMoreData(response))
      .catch((err) => {
        console.error('Failed to fetch URL');
        console.error(err);
      });
    fetch(
      'https://raw.githubusercontent.com/MoreMoney-Finance/craptastic-api/main/src/additional-yield.json'
    )
      .then((response) => response.json())
      .then((response) => setAdditionalYieldData(response))
      .catch((err) => {
        console.error('Failed to fetch URL');
        console.error(err);
      });
  }, []);
  return (
    <ExternalMetadataContext.Provider
      value={
        {
          yieldFarmingData,
          yyMetadata,
          yieldMonitor,
          xMoreData,
          additionalYieldData,
          yyAvaxAPY,
        } as unknown as ExternalMetadataType
      }
    >
      {children}
    </ExternalMetadataContext.Provider>
  );
}
