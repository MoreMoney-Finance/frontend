import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { TokenStratPositionMetadata, useIsolatedPositionMetadata } from '../chain-interaction/contracts';
import { ConvertAllRewards } from '../components/ConvertAllRewards';
import { IsolatedLending } from '../components/IsolatedLending';
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
          <TrancheTable positions={positions} />
        </Box>
      ) : undefined}
      <IsolatedLending />
      <WrapNativeCurrency />
      <ConvertAllRewards />
    </>
  );
}