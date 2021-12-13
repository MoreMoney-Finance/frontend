import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TokenStratPositionMetadata,
  useIsolatedPositionMetadata,
} from '../../chain-interaction/contracts';
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
  const positionMeta: ParsedPositionMetaRow[] = tokenAddress
    ? allPositionMeta[tokenAddress] ?? []
    : [];

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
