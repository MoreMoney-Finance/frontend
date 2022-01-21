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
    fetch(
      '/api/symbol/getFarmsForDex?partner=tj&amp;dexName[]=traderJoeV3&amp;dexName[]=traderjoe&page=1&order=liquidity&orderMethod=desc',
      {
        headers: {
          accept: '*/*',
          'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,fr;q=0.6',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
        },
        referrer: 'https://app.yieldmonitor.io',
        body: null,
        method: 'GET',
        credentials: 'omit',
      }
    );
    const urls = [
      'https://staging-api.yieldyak.com/apys',
      // TODO: fix this
      'https://app.yieldmonitor.io/api/symbol/getFarmsForDex?partner=tj&amp;dexName[]=traderJoeV3&amp;dexName[]=traderjoe&page=1&order=liquidity&orderMethod=desc',
    ];
    Promise.all(
      urls.map((url) => fetch(url).then((response) => response.json()))
    )
      .then((responses) => {
        setYYMeta(responses[0] as YYMetadata);
        // TODO: fix this
        // const parsedYieldMonitorData: Record<string, YieldMonitorMetadata> = {};
        // for (let index = 0; index < responses[1].length; index++) {
        //   const pos: YieldMonitorMetadata = responses[1][
        //     index
        //   ] as unknown as YieldMonitorMetadata;
        //   parsedYieldMonitorData[pos.lpAddress] = pos;
        // }

        setYieldMonitor({});
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
