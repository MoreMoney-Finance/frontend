import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { TokenStratPositionMetadata, useIsolatedPositionMetadata } from '../chain-interaction/contracts';
import { ConvertAllRewards } from '../components/ConvertAllRewards';
import { AllSupportedCollateral } from '../components/AllSupportedCollateral';
import { LiquidatablePositions } from '../components/LiquidatablePositions';
import { TrancheTable } from '../components/TrancheTable';
import { WrapNativeCurrency } from '../components/WrapNativeCurrency';

export function Dashboard(params: React.PropsWithChildren<unknown>) {
  const allPositionMeta: TokenStratPositionMetadata = useIsolatedPositionMetadata();
  const positions = Object.values(allPositionMeta).flatMap((x) => x);
  return (
    <>
      {params.children}
      <Outlet />
      {positions.length > 0 ? (
        <Box>
          <h2> Currently open positions </h2>
          <TrancheTable positions={positions} action={{label: 'Edit', args: (pos) => ({ as: Link, to:`/token/${pos.token.address}`})}}/>
        </Box>
      ) : undefined}
      <AllSupportedCollateral />
      <WrapNativeCurrency />
      <ConvertAllRewards />
      <LiquidatablePositions />
    </>
  );
}