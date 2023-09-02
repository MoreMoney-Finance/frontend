import {
  Avatar,
  AvatarGroup,
  Container,
  Flex,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import { CurrencyValue } from '@usedapp/core';
import React from 'react';
import CriticalGauge from '../../../assets/gauge/critical.svg';
import SafeFullGauge from '../../../assets/gauge/safe-full.svg';
import SafePartGauge from '../../../assets/gauge/safe-part.svg';
import UnsafeGauge from '../../../assets/gauge/unsafe.svg';
import {
  calcLiquidationPrice,
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useAddresses,
} from '../../../chain-interaction/contracts';
import { getIconsFromTokenAddress } from '../../../chain-interaction/tokens';
import { TitleValue } from '../../../components/data-display/TitleValue';
import { PositionContext } from '../../../contexts/PositionContext';
import { parseFloatCurrencyValue } from '../../../utils';

function usePositionValues(
  collateral: CurrencyValue | undefined,
  usdPrice: number,
  debt: CurrencyValue,
  borrowablePercent: number,
  collateralValue?: number
) {
  try {
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

    const gaugeImage = {
      accent: SafeFullGauge,
      green: SafePartGauge,
      orange: UnsafeGauge,
      red: CriticalGauge,
      ['purple.400']: CriticalGauge,
    };

    const debtRatio = debt.isZero()
      ? '∞'
      : collateralValue &&
        (
          (collateralValue * 10000) /
          parseFloatCurrencyValue(debt) /
          100
        ).toFixed(1) + '%';

    const collateralUsd =
      collateral && parseFloatCurrencyValue(collateral) * usdPrice;

    const newLiquidationPrice = calcLiquidationPrice(
      borrowablePercent,
      debt,
      collateral!
    );

    return {
      totalPercentage,
      positionHealthColor,
      gaugeImage: gaugeImage[positionHealthColor],
      debtRatio,
      collateralUsd,
      newLiquidationPrice,
    };
  } catch (ex) {
    return {
      totalPercentage: 0,
      positionHealthColor: 'accent',
      gaugeImage: CriticalGauge,
      debtRatio: 0,
      collateralUsd: 0,
      newLiquidationPrice: 0,
    };
  }
}

export function PositionData({
  position,
  stratMeta,
}: {
  position: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}) {
  const addresses = useAddresses();
  const { collateral, collateralValue, debt, borrowablePercent } = position;

  const { collateralInput, borrowInput, repayInput, collateralWithdraw } =
    React.useContext(PositionContext);
  const { usdPrice } = stratMeta;

  // this part of the code
  const existingCollateralPlusInput = collateralInput
    ? collateral?.add(collateralInput)
    : collateral;
  const existingDebtPlusInput = borrowInput ? debt.add(borrowInput) : debt;

  const collateralParam =
    collateralWithdraw && existingCollateralPlusInput?.gt(collateralWithdraw)
      ? existingCollateralPlusInput.sub(collateralWithdraw)
      : existingCollateralPlusInput;

  const debtParam =
    repayInput && existingDebtPlusInput?.gt(repayInput)
      ? existingDebtPlusInput?.sub(repayInput)
      : existingDebtPlusInput;

  const collateralParamFloat = collateralParam?.value.gt(0)
    ? parseFloatCurrencyValue(collateralParam!)
    : 0;

  const collateralValueParam =
    collateralInput && collateralParam
      ? collateralParamFloat * usdPrice
      : parseFloatCurrencyValue(collateralValue);

  const {
    gaugeImage: orginalGaugeImage,
    collateralUsd: originalCollateralUsd,
    debtRatio: newDebtRatio,
    newLiquidationPrice,
  } = usePositionValues(
    collateralParam,
    usdPrice,
    debtParam,
    borrowablePercent,
    collateralValueParam
  );

  const { debtRatio: originalDebtRatio } = usePositionValues(
    collateral,
    usdPrice,
    debt,
    borrowablePercent,
    parseFloatCurrencyValue(collateral!) * usdPrice
  );

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
              bg={`url(${orginalGaugeImage})`}
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
                }).format(originalCollateralUsd!)}
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
                }).format(parseFloatCurrencyValue(position.debt))}
                <Avatar
                  borderColor="gray.300"
                  showBorder={true}
                  src={getIconsFromTokenAddress(addresses.Stablecoin)[0]}
                  key={'debtRatioIcon'}
                  ml="8px"
                />
              </Flex>
            }
            description={
              <Flex>
                New Debt:{' '}
                {Intl.NumberFormat('en', {
                  notation: 'compact',
                }).format(parseFloatCurrencyValue(debtParam))}
              </Flex>
            }
          />
          <TitleValue
            title="Debt Ratio"
            value={<Flex alignItems="center">{originalDebtRatio}</Flex>}
            description={<Flex>New ratio: {newDebtRatio}</Flex>}
          />
          <TitleValue
            title="Liquidation Price"
            value={`$ ${position.liquidationPrice.toFixed(2)}`}
            description={
              <div>
                New liquidation price:{' '}
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(newLiquidationPrice!)}
              </div>
            }
          />
        </Flex>
      </Container>
    </GridItem>
  );
}
