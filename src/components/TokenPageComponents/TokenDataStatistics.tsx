import React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';
import { Container, GridItem, HStack } from '@chakra-ui/react';
import { TitleValue } from '../TitleValue';

export function TokenDataStatistics({
  tokenData,
}: {
  tokenData: ParsedStratMetaRow;
}) {
  return (
    <GridItem colSpan={7} rowSpan={1} h={'115'}>
      <Container variant={'token'}>
        <HStack padding="22px 50px 35px 50px" justifyContent="space-between">
          <TitleValue title="COLLATERAL" value="0.00" />
          <TitleValue
            title="VALUE (USD)"
            value={`$${tokenData.usdPrice.toFixed(2)}`}
          />
          <TitleValue title="POSITION API" value="20%" />
          <TitleValue title="DEBT" value="$200" />
          <TitleValue
            title="cRatio"
            value={`${((1 / (tokenData.borrowablePercent / 100)) * 100).toFixed(
              2
            )}%`}
          />
          <TitleValue title="LIQUIDATION PRICE" value="$200" />
          <TitleValue title="STRATEGY" value="100" />
        </HStack>
      </Container>
    </GridItem>
  );
}
