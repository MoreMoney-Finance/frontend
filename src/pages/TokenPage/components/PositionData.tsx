import {
  Box,
  Container,
  Flex,
  GridItem,
  Progress,
  Text,
} from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../../chain-interaction/contracts';
import { TitleValue } from '../../../components/data-display/TitleValue';
import { parseFloatNoNaN } from '../../../utils';

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

  const totalPercentage = parseFloatNoNaN(
    effectiveDebt.mul(100).div(position.collateralValue.value).format({
      significantDigits: Infinity,
      prefix: '',
      suffix: '',
      decimalSeparator: '.',
      thousandSeparator: '',
    })
  );

  const progressValue = (totalPercentage * 100) / position.borrowablePercent;
  const greenZone = (33.33 * position.borrowablePercent) / 100;
  const yellowZone = (66.66 * position.borrowablePercent) / 100;
  const progressColor =
    totalPercentage < greenZone
      ? 'accent'
      : totalPercentage < yellowZone
        ? 'yellow'
        : 'red';

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
        <Box padding={'0px 20px 20px 20px'}>
          <Text variant={'bodyExtraSmall'} color={'whiteAlpha.600'}>
            Position Health
          </Text>
          <Progress
            hasStripe
            isAnimated={true}
            value={progressValue}
            colorScheme={progressColor}
            max={position.borrowablePercent}
          />
        </Box>
      </Container>
    </GridItem>
  );
}
