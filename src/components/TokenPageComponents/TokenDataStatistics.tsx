import React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';
import { Container, GridItem, HStack } from '@chakra-ui/react';
import { TitleValue } from '../TitleValue';

export function TokenDataStatistics({
  stratMeta,
}: {
  stratMeta: ParsedStratMetaRow;
}) {
  return (
    <GridItem colSpan={3} rowSpan={1}>
      <Container variant={'token'}>
        <HStack padding="25px 50px 37px 50px" justifyContent="space-between">
          <TitleValue title="COLLATERAL" value="0.00" />
          <TitleValue
            title="VALUE (USD)"
            value={`$${stratMeta.usdPrice.toFixed(2)}`}
          />
          <TitleValue title="POSITION API" value="20%" />
          <TitleValue title="DEBT" value="$200" />
          <TitleValue
            title="cRatio"
            value={`${((1 / (stratMeta.borrowablePercent / 100)) * 100).toFixed(
              2
            )}%`}
          />
          <TitleValue title="LIQUIDATION PRICE" value="$200" />
          <TitleValue
            title="STRATEGY"
            value='strat'
          />
        </HStack>
      </Container>
    </GridItem>
  );
}
