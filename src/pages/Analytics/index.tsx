import { Box, Container, Grid, Text } from '@chakra-ui/react';
import {
  CurrencyValue,
  ERC20Interface,
  useCalls,
  useEthers,
} from '@usedapp/core';
import { BigNumber, Contract, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import * as React from 'react';
import {
  DeploymentAddresses,
  ParsedStakingMetadata,
  useAddresses,
  useAllFeesEver,
  useCurvePoolSLDeposited,
  useLegacyIsolatedStrategyMetadata,
  useParsedStakingMetadata,
  useStable,
  useTotalSupply,
} from '../../chain-interaction/contracts';
import { tokenAmount } from '../../chain-interaction/tokens';
import { StrategyMetadataContext } from '../../contexts/StrategyMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { AnalyticsBox } from './AnalyticsBox';

export default function Analytics(props: React.PropsWithChildren<unknown>) {
  const allStratMeta = React.useContext(StrategyMetadataContext);
  const legacyStratMeta = useLegacyIsolatedStrategyMetadata();

  const account = React.useContext(UserAddressContext);
  const addresses = useAddresses();

  const stakeMeta: ParsedStakingMetadata[] = useParsedStakingMetadata(
    [addresses.CurvePoolRewards],
    account ?? ethers.constants.AddressZero
  ).flat(1);

  const feeContractNames = [
    'IsolatedLending',
    'StableLending',
    'StableLending2',
    'IsolatedLendingLiquidation',
    'StableLendingLiquidation',
    'StableLending2Liquidation',
  ];
  const blacklist = [
    'StrategyRegistry',
    'StrategyTokenActivation',
    'StrategyViewer',
    'LegacyStrategyViewer',
  ];
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
  // console.log('contracts', contracts);
  const stable = useStable();
  const tvlsFarm = stakeMeta.reduce(
    (tvl, row) => tvl.add(row.tvl),
    new CurrencyValue(stable, BigNumber.from(0))
  );
  console.log('All farm TVL:', tvlsFarm.format());

  const tvlNoFarm = Object.values(allStratMeta)
    .flatMap((rows) => Object.values(rows))
    .reduce(
      (tvl, row) => tvl.add(row.tvlInPeg),
      new CurrencyValue(stable, BigNumber.from(0))
    );
  const legacyTvlNoFarm = Object.values(legacyStratMeta)
    .flatMap((rows) => Object.values(rows))
    .reduce(
      (tvl, row) => tvl.add(row.tvlInPeg),
      new CurrencyValue(stable, BigNumber.from(0))
    );
  console.log('No-farm TVL', tvlNoFarm.format());

  const tvl = tvlNoFarm.add(tvlsFarm).add(legacyTvlNoFarm);

  const supply = useTotalSupply('totalSupply', [], ['']);

  const curvePoolSL = useCurvePoolSLDeposited();
  console.log('curvePoolSL', curvePoolSL.toString());
  const colRatio = !tvl.isZero()
    ? tvlNoFarm.value.mul(10000).div(supply.sub(curvePoolSL)).toNumber() / 100
    : 0;

  const fees = useAllFeesEver(contracts);

  const totalFees = fees
    .filter((fee) => fee)
    .filter((fee) => fee![0])
    .reduce(
      (total, fee) => total.add(new CurrencyValue(stable, fee![0])),
      new CurrencyValue(stable, BigNumber.from(0))
    );

  const circulatingBlacklist = [
    addresses.CurvePoolRewards,
    addresses.VestingLaunchReward,
    '0xcb2fb8db0e80adf47720d48e1ae9315e7d128808',
    '0xba8983fdde65354c1330e38d042c7d2f784ca3de',
    '0xc2Ee73EF5FF77c37dEBa2593EC80e5d4B655735E',
  ];

  function convert2ContractCall(holder: string) {
    return {
      contract: new Contract(addresses.MoreToken, ERC20Interface),
      abi: ERC20Interface,
      address: addresses.MoreToken,
      method: 'balanceOf',
      args: [holder],
    };
  }

  const balances = useCalls(circulatingBlacklist.map(convert2ContractCall))
    .map((x) => (x ?? { value: undefined }).value)
    .map(
      (result: any[] | undefined) =>
        (result ? result[0] : undefined) ?? BigNumber.from(0)
    )
    .reduce((agg, curr) => agg.add(curr));

  const { chainId } = useEthers();
  const circulatingSupply = chainId
    ? tokenAmount(
      chainId,
      addresses.MoreToken,
      parseEther('1000000000').sub(balances)
    )?.format({ useFixedPrecision: true, fixedPrecisionDigits: 0 }) ?? ''
    : '';

  return (
    <Box padding={'12'} width={'full'} textAlign={'center'}>
      <Text fontSize={'4xl'}>Moremoney Analytics</Text>
      <br />
      <br />
      <br />
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <Box w="100%" h="200">
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <AnalyticsBox
              title={'Total Value Locked'}
              subtitle={'Total deposits on MoreMoney'}
              value={'$' + tvl.format({ suffix: '' })}
            />
          </Container>
        </Box>
        <Box w="100%" h="200">
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <AnalyticsBox
              title={'MORE Circulating Supply'}
              subtitle={'Held in community or liquidity'}
              value={circulatingSupply}
            />
          </Container>
        </Box>
        <Box w="100%" h="200">
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <AnalyticsBox
              title={'MONEY Circulating Supply'}
              subtitle={'Circulating volume of MONEY'}
              value={new CurrencyValue(stable, supply).format()}
            />
          </Container>
        </Box>
        <Box w="100%" h="200">
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <AnalyticsBox
              title={'Protocol Col. Ratio'}
              subtitle={'Total collateral divided by debt'}
              value={`${colRatio} %`}
            />
          </Container>
        </Box>
        <Box w="100%" h="200">
          <Container variant={'token'} padding={'35px 20px 20px 20px'}>
            <AnalyticsBox
              title={'Fees earned'}
              subtitle={'Fees paid to MoreMoney'}
              value={`$ ${totalFees.format({ suffix: '' })}`}
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
      </Grid>
      {props.children}
    </Box>
  );
}
