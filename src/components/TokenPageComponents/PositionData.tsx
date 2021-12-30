import { Container, GridItem, HStack } from '@chakra-ui/react';
import { TitleValue } from '../TitleValue';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';

export function PositionData({
  position,
  stratMeta,
}: {
  position: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}) {
  return (
    <GridItem colSpan={3} rowSpan={1}>
      <Container variant={'token'}>
        <HStack padding="25px 50px 37px 50px" justifyContent="space-between">
          <TitleValue
            title="COLLATERAL"
            value={
              position.collateral?.format({
                significantDigits: Infinity,
              }) ??
              new CurrencyValue(stratMeta.token, BigNumber.from('0')).format()
            }
          />
          <TitleValue
            title="VALUE (USD)"
            value={`$ ${position.collateralValue.format({
              prefix: '',
              suffix: '',
            })}`}
          />
          <TitleValue title="DEBT" value={position.debt.format()} />
          <TitleValue
            title="cRATIO"
            value={
              position.debt.isZero()
                ? '∞'
                : (
                  position.collateralValue.value
                    .mul(10000)
                    .div(position.debt.value)
                    .toNumber() / 100
                ).toFixed(2)
            }
          />
          <TitleValue
            title="LIQUIDATION PRICE"
            value={`$ ${position.liquidationPrice.toFixed(2)}`}
          />
        </HStack>
      </Container>
    </GridItem>
  );
}
