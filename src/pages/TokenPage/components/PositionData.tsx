import { Container, Flex, GridItem, Text } from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../../chain-interaction/contracts';
import { TitleValue } from '../../../components/data-display/TitleValue';
import { parseFloatCurrencyValue } from '../../../utils';

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

  const { collateralValue, debt, borrowablePercent } = position;
  const { usdPrice } = stratMeta;

  const totalPercentage =
    parseFloatCurrencyValue(collateralValue) > 0 && usdPrice > 0
      ? (100 * parseFloatCurrencyValue(debt)) /
        (parseFloatCurrencyValue(collateralValue) * usdPrice)
      : 0;
  const liquidatableZone = borrowablePercent;
  const criticalZone = (90 * borrowablePercent) / 100;
  const riskyZone = (80 * borrowablePercent) / 100;
  const healthyZone = (50 * borrowablePercent) / 100;

  const positionHealthColor = debt.value.lt(parseEther('0.1'))
    ? 'accent'
    : totalPercentage > liquidatableZone
    ? 'purple.400'
    : totalPercentage > criticalZone
    ? 'red'
    : totalPercentage > riskyZone
    ? 'orange'
    : totalPercentage > healthyZone
    ? 'green'
    : 'accent';
  const positionHealth = {
    accent: 'Safe',
    green: 'Healthy',
    orange: 'Risky',
    red: 'Critical',
    ['purple.400']: 'Liquidatable',
  };

  return (
    <GridItem colSpan={[2, 3, 4]} rowSpan={[12, 1, 1]} marginTop={'30px'}>
      <Container variant={'token'}>
        <Flex
          flexDirection={['column', 'column', 'row']}
          padding={['20px', '35px', '20px']}
          justifyContent="space-between"
        >
          <TitleValue
            title="POSITION HEALTH"
            value={
              <Text
                color={
                  positionHealthColor == 'accent'
                    ? 'accent_color'
                    : positionHealthColor
                }
              >
                {positionHealth[positionHealthColor]}
              </Text>
            }
          />
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
            title="LIQUIDATION PRICE"
            value={`$ ${position.liquidationPrice.toFixed(2)}`}
          />
        </Flex>
      </Container>
    </GridItem>
  );
}
