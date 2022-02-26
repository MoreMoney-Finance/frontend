import { parseEther } from '@ethersproject/units';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TokenStratPositionMetadata,
  useIsolatedPositionMetadata,
} from '../../../chain-interaction/contracts';
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
  const positionMeta: ParsedPositionMetaRow[] =
    (tokenAddress ? allPositionMeta[tokenAddress] : [])
      .filter((pos) => pos.collateralValue.value.gt(parseEther('0.01')))
      .filter((pos) => pos.strategy in stratMeta[pos.token.address]) ?? [];

  return positionMeta.length === 0 ? (
    <PositionBody stratMeta={stratMeta} />
  ) : (
    <>
      {positionMeta.map((position) => (
        <PositionBody
          key={`tranche${position.trancheId}`}
          stratMeta={stratMeta}
          position={position}
        />
      ))}
    </>
  );
}
