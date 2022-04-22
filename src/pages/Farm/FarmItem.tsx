import { useMediaQuery } from '@chakra-ui/react';
import * as React from 'react';
import { FarmCard } from './FarmCard';
import FarmRow from './FarmRow';

export default function FarmItem({
  asset,
  stake,
  tvl,
  reward,
  apr,
  acquire,
  content,
}: {
  asset: any;
  stake: string;
  tvl: string;
  reward: any;
  apr: string;
  acquire: any;
  content?: any;
}) {
  const [isLargerThan720] = useMediaQuery('(min-width: 720px)');

  return isLargerThan720 ? (
    <FarmRow
      asset={asset}
      stake={stake}
      tvl={tvl}
      reward={reward}
      apr={apr}
      acquire={acquire}
      content={content}
    />
  ) : (
    <FarmCard
      asset={asset}
      stake={stake}
      tvl={tvl}
      reward={reward}
      apr={apr}
      acquire={acquire}
      content={content}
    />
  );
}
