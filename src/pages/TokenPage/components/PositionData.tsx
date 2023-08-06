import {
  Container,
  Avatar,
  AvatarGroup,
  Flex,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useAddresses,
} from '../../../chain-interaction/contracts';
import { TitleValue } from '../../../components/data-display/TitleValue';
import { parseFloatCurrencyValue } from '../../../utils';
import CriticalGauge from '../../../assets/gauge/critical.svg';
import UnsafeGauge from '../../../assets/gauge/unsafe.svg';
import SafePartGauge from '../../../assets/gauge/safe-part.svg';
import SafeFullGauge from '../../../assets/gauge/safe-full.svg';
import { getIconsFromTokenAddress } from '../../../chain-interaction/tokens';

export function PositionData({
  position,
  stratMeta,
}: {
  position: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}) {
  // const effectiveDebt = position.debt.gt(position.yield)
  //   ? position.debt.sub(position.yield)
  //   : new CurrencyValue(position.debt.currency, BigNumber.from(0));
  const addresses = useAddresses();
  const { collateral, debt, borrowablePercent } = position;
  const { usdPrice } = stratMeta;

  const totalPercentage =
    collateral?.value.gt(0) && usdPrice > 0
      ? (100 * parseFloatCurrencyValue(debt)) /
        (parseFloatCurrencyValue(collateral) * usdPrice)
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
  // const positionHealth = {
  //   accent: 'Safe',
  //   green: 'Healthy',
  //   orange: 'Risky',
  //   red: 'Critical',
  //   ['purple.400']: 'Liquidatable',
  // };

  const gaugeImage = {
    accent: SafeFullGauge,
    green: SafePartGauge,
    orange: UnsafeGauge,
    red: CriticalGauge,
    ['purple.400']: CriticalGauge,
  };

  const debtRatio = position.collateral
    ? new CurrencyValue(
        position.debt.currency,
        position.debt.value.div(position.collateral.value)
      )
    : new CurrencyValue(position.debt.currency, BigNumber.from(0));

  const collateralUsd =
    position.collateral &&
    parseFloatCurrencyValue(position.collateral) * usdPrice;

  // console.log('PositionData', debt, borrowablePercent, totalPercentage);
  return (
    <GridItem colSpan={[2, 3, 3]} rowSpan={[12, 1, 1]}>
      <Container variant={'token'}>
        <Flex
          flexDirection={['column', 'column', 'row']}
          padding={['20px', '35px', '20px']}
          justifyContent="space-between"
        >
          <Flex direction="column">
            <Text align="center">Position health</Text>
            <Container
              width="200px"
              height="100px"
              bg={`url(${gaugeImage[positionHealthColor]})`}
              backgroundSize="cover"
            />
          </Flex>
          <TitleValue
            title="Collateral"
            value={
              <Flex alignItems="center">
                {position.collateral &&
                  Intl.NumberFormat('en', {
                    notation: 'compact',
                    maximumFractionDigits: 1,
                  }).format(parseFloatCurrencyValue(position.collateral))}
                <AvatarGroup size={'md'} max={2} ml="8px">
                  {(getIconsFromTokenAddress(position.token.address) ?? []).map(
                    (iconUrl, i) => (
                      <Avatar
                        borderColor="gray.300"
                        showBorder={true}
                        src={iconUrl}
                        key={i + 1}
                      />
                    )
                  )}
                </AvatarGroup>
              </Flex>
            }
            description={
              <Flex>
                Value:{' '}
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(collateralUsd!)}
              </Flex>
            }
          />
          <TitleValue
            title="Debt"
            value={
              <Flex alignItems="center">
                {Intl.NumberFormat('en', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(parseFloatCurrencyValue(position.collateralValue))}
                <Avatar
                  borderColor="gray.300"
                  showBorder={true}
                  src={getIconsFromTokenAddress(addresses.Stablecoin)[0]}
                  key={'debtRatioIcon'}
                  ml="8px"
                />
              </Flex>
            }
            description={<Flex>New Debt: 13k</Flex>}
          />
          <TitleValue
            title="Debt Ratio"
            // value={effectiveDebt.format({ suffix: '' })}
            value={
              <Flex alignItems="center">
                {Intl.NumberFormat('en', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(parseFloatCurrencyValue(debtRatio))}
              </Flex>
            }
            description={<Flex>New ratio: 130% (min 125%)</Flex>}
          />
          <TitleValue
            title="Liquidation Price"
            value={`$ ${position.liquidationPrice.toFixed(2)}`}
            description={<div>New liquidation price: $ 9.01</div>}
          />
        </Flex>
      </Container>
    </GridItem>
  );
}
