import { Button, Box, Tab, TabList, Tabs } from '@chakra-ui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ParsedStratMetaRow } from '../../../chain-interaction/contracts';
import { deprecatedTokenList } from '../../../constants/deprecated-token-list';

export function TableTabs({
  setTableTabFilter,
  stratMeta,
}: {
  setTableTabFilter: React.Dispatch<React.SetStateAction<string[]>>;
  stratMeta: ParsedStratMetaRow[];
}) {
  // const stableTickers = [
  //   'USDT',
  //   'USDC',
  //   'DAI',
  //   'FRAX',
  //   'USDT.e',
  //   'USDC.e',
  //   'DAI.e',
  // ];

  const lpTickers = stratMeta
    .filter((meta) => meta.token.ticker.includes('/'))
    .map((meta) => meta.token.ticker);

  const singleAssetTickers = stratMeta
    .filter((meta) => !meta.token.ticker.includes('/'))
    .map((meta) => meta.token.ticker);

  const deprecatedTickers = stratMeta
    .filter((meta) => deprecatedTokenList.includes(meta.token.address))
    .map((meta) => meta.token.ticker);

  return (
    <Box>
      <Tabs
        variant="soft-rounded"
        onChange={(index) => {
          if (index === 0) {
            setTableTabFilter([]);
            // } else if (index === 1) {
            //   setTableTabFilter(stableTickers);
          } else if (index === 1) {
            setTableTabFilter(singleAssetTickers);
          } else if (index === 2) {
            setTableTabFilter(lpTickers);
          } else if (index === 3) {
            setTableTabFilter(deprecatedTickers);
          }
        }}
      >
        <TabList>
          <Tab>All Assets</Tab>
          {/* <Tab>Stablecoins</Tab> */}
          <Tab>Single Asset</Tab>
          <Tab>LP Tokens</Tab>
          <Tab>Deprecated</Tab>
          <Link to={'/positions'}>
            <Button borderRadius="3xl" variant="primary">
              My positions
            </Button>
          </Link>
        </TabList>
      </Tabs>
    </Box>
  );
}
