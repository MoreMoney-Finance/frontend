import { parseEther } from '@ethersproject/units';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TokenStratPositionMetadata,
  useIsolatedPositionMetadata,
} from '../../../chain-interaction/contracts';
import { PositionCtxProvider } from '../../../contexts/PositionContext';
import { PositionBody } from './PositionBody';

export function TokenPageBody({
  stratMeta,
  account,
  tokenAddress,
}: React.PropsWithChildren<{
  stratMeta: Record<string, ParsedStratMetaRow>;
  account: string;
  tokenAddress?: string;
}>) {
  const allPositionMeta: TokenStratPositionMetadata =
    useIsolatedPositionMetadata(account);
  const positionMeta1: ParsedPositionMetaRow[] =
    (tokenAddress && allPositionMeta && allPositionMeta[tokenAddress]) || [];
  const positionMeta =
    positionMeta1
      .filter((pos) => pos)
      .filter((pos) => pos.collateralValue.value.gt(parseEther('0.01')))
      .filter((pos) => pos.strategy in stratMeta) ?? [];

  return positionMeta.length === 0 ? (
    <PositionBody stratMeta={stratMeta} />
  ) : (
    <>
      {positionMeta.map((position) => (
        <div key={`tranche${position.trancheId}`}>
          <PositionCtxProvider>
            <PositionBody stratMeta={stratMeta} position={position} />
          </PositionCtxProvider>
        </div>
      ))}
    </>
  );
}
