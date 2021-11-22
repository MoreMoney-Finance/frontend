import * as React from 'react';
import { TokenDataTable } from '../components/TokenDataTable';
import { MintNewTranche } from '../components/MintNewTranche';
import { VStack, Wrap } from '@chakra-ui/react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../chain-interaction/contracts';
import { BigNumber } from 'ethers';
import { StrategyDataTable } from './StrategyDataTable';

export function PositionBody({
  stratMeta,
  liquidationRewardPer10k,
  position,
}: React.PropsWithChildren<{
  stratMeta: Record<string, ParsedStratMetaRow>;
  liquidationRewardPer10k: BigNumber;
  position?: ParsedPositionMetaRow;
}>) {
  const firstStrat = Object.keys(stratMeta)[0];
  return (
    <Wrap spacing="8rem">
      <TokenDataTable
        tokenData={
          Object.keys(stratMeta).length > 0 ? stratMeta[firstStrat] : undefined
        }
        liquidationFee={liquidationRewardPer10k}
      />
      {Object.values(stratMeta).map((meta, i) => (
        <VStack key={i}>
          {position ? (
            <StrategyDataTable {...meta} />
          ) : (
            <MintNewTranche {...meta} />
          )}
        </VStack>
      ))}
    </Wrap>
  );
}
