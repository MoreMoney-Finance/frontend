import { Box, Container, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import {
  DeploymentAddresses,
  useAddresses,
  useAllFeesEver,
  useStable,
  useTotalSupply,
} from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { AnalyticsBox } from './Analytics/AnalyticsBox';

export function Analytics(props: React.PropsWithChildren<unknown>) {
  const allStratMeta = React.useContext(StrategyMetadataContext);

  console.log('allStratMeta', allStratMeta);

  const addresses = useAddresses();
  const feeContractNames = ['IsolatedLending', 'IsolatedLendingLiquidation'];
  const blacklist = ['StrategyRegistry', 'StrategyTokenActivation'];
  const keys: (keyof DeploymentAddresses)[] = Object.keys(
    addresses
  ) as (keyof DeploymentAddresses)[];
  const filteredNames = keys.filter((key) => {
    return (
      feeContractNames.includes(key) ||
      (key.includes('Strategy') && !blacklist.includes(key))
    );
  });

  const contracts = filteredNames.map((name) => {
    return addresses[name];
  });
  console.log('contracts', contracts);
  const stable = useStable();
  const tvl = Object.values(allStratMeta)
    .flatMap((rows) => Object.values(rows))
    .reduce(
      (tvl, row) => tvl.add(row.tvlInPeg),
      new CurrencyValue(stable, BigNumber.from(0))
    );

  const supply = useTotalSupply('totalSupply', [], ['']);
  const colRatio = !tvl.isZero() ? supply.div(tvl.value) : 0;

  const fees = useAllFeesEver(contracts);

  const totalFees = fees
    .filter((fee) => fee)
    .filter((fee) => fee![0])
    .reduce(
      (total, fee) => total.add(new CurrencyValue(stable, fee![0])),
      new CurrencyValue(stable, BigNumber.from(0))
    );

  return (
    <Box padding={'12'} width={'full'}>
      <Text align={'start'} fontSize={'4xl'}>
        MoreMoney Analytics
      </Text>
      <br />
      <br />
      <br />
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem rowSpan={2} colSpan={1} height={'100%'}>
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <Flex
              w={'full'}
              h={'full'}
              direction={'column'}
              justifyContent={'center'}
            >
              <AnalyticsBox
                title={'Total Value Locked'}
                subtitle={'Total deposits on MoreMoney'}
                value={'$' + tvl.value.toString()}
              />
            </Flex>
          </Container>
        </GridItem>
        <Box w="100%" h="200">
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <AnalyticsBox
              title={'Total Protocol Collateralization Ratio'}
              subtitle={'Total protocol collateral on MoreMoney'}
              value={'$' + colRatio}
            />
          </Container>
        </Box>
        <Box w="100%" h="200">
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <AnalyticsBox
              title={'Fees earned'}
              subtitle={'Fees paid to MoreMoney'}
              value={totalFees.format()}
            />
          </Container>
        </Box>
        <Box w="100%" h="200">
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <AnalyticsBox
              title={'Assets supported'}
              subtitle={`${Object.keys(allStratMeta).length} assets supported`}
              value={''}
            />
          </Container>
        </Box>
        <Box w="100%" h="200">
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <AnalyticsBox
              title={'MONEY circulating supply'}
              subtitle={'Circulating volume of MONEY'}
              value={'$' + supply}
            />
          </Container>
        </Box>
      </Grid>
      {props.children}
    </Box>
  );
}
