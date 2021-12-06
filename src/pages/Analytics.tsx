import * as React from 'react';
import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import { AnalyticsBox } from './Analytics/AnalyticsBox';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { useStable, useTotalSupply } from '../chain-interaction/contracts';

export function Analytics(props: React.PropsWithChildren<unknown>) {
  const allStratMeta = React.useContext(StrategyMetadataContext);

  console.log('allStratMeta', allStratMeta);

  const stable = useStable();
  const tvl = Object.values(allStratMeta)
    .flatMap((rows) => Object.values(rows))
    .reduce(
      (tvl, row) => tvl.add(row.tvlInPeg),
      new CurrencyValue(stable, BigNumber.from(0))
    );

  console.log('tvl', tvl);

  const supply = useTotalSupply('totalSupply', [], ['']);

  const colRatio = supply != 0 ? supply.div(tvl) : 0;

  console.log('supply', supply, colRatio);
  return (
    <Box padding={'12'} width={'full'}>
      <Text align={'start'} fontSize={'4xl'}>
        MoreMoney Analytics
      </Text>
      <br />
      <br />
      <br />
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        <GridItem rowSpan={2} colSpan={1} alignSelf={'center'}>
          <Box>
            <AnalyticsBox
              title={'Total Value Locked'}
              subtitle={'Total deposits on MoreMoney'}
              value={'$' + tvl.value.toString()}
            />
          </Box>
        </GridItem>

        <Box w="100%" h="150">
          <AnalyticsBox
            title={'Total Protocol Collateralization Ratio'}
            subtitle={'Total protocol collateral on MoreMoney'}
            value={'$' + colRatio}
          />
        </Box>
        <Box w="100%" h="150">
          <AnalyticsBox
            title={'Fees earned'}
            subtitle={'Fees paid to MoreMoney'}
            value={'$1,000'}
          />
        </Box>
        <Box w="100%" h="150">
          <AnalyticsBox
            title={'Assets supported'}
            subtitle={`${Object.keys(allStratMeta).length} assets supported`}
            value={''}
          />
        </Box>
        <Box w="100%" h="150">
          <AnalyticsBox
            title={'MNY circulating supply'}
            subtitle={'Circulating volume of MNY'}
            value={'$' + supply}
          />
        </Box>
      </Grid>
      {props.children}
    </Box>
  );
}
