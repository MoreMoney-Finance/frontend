import { Tab, Tabs, TabList, Box } from '@chakra-ui/react';
import * as React from 'react';
import lptokens from '../contracts/lptokens.json';
import { useEthers } from '@usedapp/core';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';

export function TableTabs({
  setTableTabFilter,
  stratMeta,
}: {
  setTableTabFilter: React.Dispatch<React.SetStateAction<string[]>>;
  stratMeta: ParsedStratMetaRow[];
}) {
  const { chainId } = useEthers();

  const stableTickers = [
    'USDT',
    'USDC',
    'DAI',
    'FRAX',
    'USDT.e',
    'USDC.e',
    'DAI.e',
  ];

  const chainIdStr = chainId ? chainId.toString() : '43114';
  console.log('chainIdStr', chainIdStr);

  const lpTickers: string[] = Object.entries(lptokens['31337'])
    .map(([, token]) => {
      return [...Object.keys(token)];
    })
    .flat(1);

  const singleAssetTickers = stratMeta
    .filter((meta) => !lpTickers.includes(meta.token.ticker))
    .map((meta) => meta.token.ticker);

  return (
    <Box>
      <Tabs
        variant="soft-rounded"
        onChange={(index) => {
          if (index === 0) {
            setTableTabFilter([]);
          } else if (index === 1) {
            setTableTabFilter(stableTickers);
          } else if (index === 2) {
            setTableTabFilter(singleAssetTickers);
          } else if (index === 3) {
            setTableTabFilter(lpTickers);
          }
        }}
      >
        <TabList>
          <Tab>All Assets</Tab>
          <Tab>Stablecoins</Tab>
          <Tab>Single Asset</Tab>
          <Tab>LP Tokens</Tab>
        </TabList>
      </Tabs>
    </Box>
  );
}
