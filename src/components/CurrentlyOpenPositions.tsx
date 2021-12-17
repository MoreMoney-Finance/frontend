import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  TokenStratPositionMetadata,
  useIsolatedPositionMetadata,
} from '../chain-interaction/contracts';
import { TrancheTable } from './TrancheTable';

export default function CurrentlyOpenPositions({
  account,
}: React.PropsWithChildren<{ account: string }>) {
  const allPositionMeta: TokenStratPositionMetadata =
    useIsolatedPositionMetadata(account);

  const positions = Object.values(allPositionMeta).flatMap((x) => x);
  return positions.length > 0 ? (
    <Box mx="-95px">
      <TrancheTable
        positions={positions}
        action={{
          label: 'Edit',
          args: (pos) => ({ as: Link, to: `/token/${pos.token.address}` }),
        }}
      />
    </Box>
  ) : (
    <> </>
  );
}
