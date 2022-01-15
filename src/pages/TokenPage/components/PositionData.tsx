import { Container, Flex, GridItem } from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import { ParsedPositionMetaRow, ParsedStratMetaRow } from '../../../chain-interaction/contracts';
import { TitleValue } from '../../../components/data-display/TitleValue';

export function PositionData({
  position,
  stratMeta,
}: {
  position: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}) {
  const effectiveDebt = position.debt.gt(position.yield)
    ? position.debt.sub(position.yield)
    : new CurrencyValue(position.debt.currency, BigNumber.from(0));

  return (
    <GridItem colSpan={[2, 3, 4]} rowSpan={[12, 1, 1]} marginTop={'30px'}>
      <Container variant={'token'}>
        <Flex
          flexDirection={['column', 'column', 'row']}
          padding={['20px', '35px', '20px']}
          justifyContent="space-between"
        >
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
          <TitleValue title="DEBT" value={effectiveDebt.format()} />
          <TitleValue
            title="cRATIO"
            value={
              effectiveDebt.isZero()
                ? '∞'
                : (
                  position.collateralValue.value
                    .mul(10000)
                    .div(effectiveDebt.value)
                    .toNumber() / 100
                ).toFixed(2)
            }
          />
          <TitleValue
            title="LIQUIDATION PRICE"
            value={`$ ${position.liquidationPrice.toFixed(2)}`}
          />
        </Flex>
      </Container>
    </GridItem>
  );
}
