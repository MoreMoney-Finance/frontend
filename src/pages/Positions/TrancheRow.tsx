import { Td, Text, Tr } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';
import { TokenDescription } from '../../components/tokens/TokenDescription';
import { TrancheData } from './CurrentlyOpenPositions';
import { TrancheAction } from './TrancheTable';

export function TrancheRow(
  params: React.PropsWithChildren<
    ParsedStratMetaRow &
      ParsedPositionMetaRow & { action?: TrancheAction; row: TrancheData }
  >
) {
  const { row } = params;
  return (
    <>
      <Tr
        key={`${params.trancheId}`}
        as={Link}
        to={`/token/${params.token.address}`}
        display="table-row"
      >
        <Td>
          <Text
            color={
              row.positionHealthColor == 'accent'
                ? 'accent_color'
                : row.positionHealthColor
            }
          >
            {row.positionHealth}
          </Text>
        </Td>
        <Td>
          <TokenDescription token={row.token} />
        </Td>

        <Td>{row.stratLabel}</Td>

        <Td>{row.APY}</Td>

        <Td>{row.collateralValue}</Td>

        <Td>
          <Text isTruncated>{row.liquidationPrice}</Text>
        </Td>

        <Td>{row.collateral}</Td>

        <Td>{row.debt}</Td>
      </Tr>
    </>
  );
}
