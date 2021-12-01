import * as React from 'react';
import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import { AnalyticsBox } from './Analytics/AnalyticsBox';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';

export function Analytics(props: React.PropsWithChildren<unknown>) {
  const allStratMeta = React.useContext(StrategyMetadataContext);
  
  console.log('allStratMeta', allStratMeta);

  const tvl = Object.entries(allStratMeta).map(([, value]) => {
    const tvlInPeg = Object.entries(value).map(([, value]) => {
      return value.tvlInPeg;
    });
    return tvlInPeg;
  });

  console.log('tvl', tvl);

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
              value={'$.92'}
            />
          </Box>
        </GridItem>

        <Box w="100%" h="150">
          <AnalyticsBox
            title={'Total Protocol Collateralization Ratio'}
            subtitle={'Total protocol collateral on MoreMoney'}
            value={'$1,000'}
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
            title={'MONEY circulating supply'}
            subtitle={'Circulating volume of MONEY'}
            value={'$1000'}
          />
        </Box>
      </Grid>
      {props.children}
    </Box>
  );
}
