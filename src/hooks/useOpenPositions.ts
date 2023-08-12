import { parseEther } from '@ethersproject/units';
import { CurrencyValue, Token } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import {
  TokenStratPositionMetadata,
  useIsolatedPositionMetadata,
  useStable,
  YieldType,
} from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { parseFloatCurrencyValue } from '../utils';

export type TrancheData = {
  token: Token;
  trancheId: number;
  positionHealth: string;
  stratLabel: string;
  APY: string;
  collateralValue: string;
  liquidationPrice: string;
  collateral: string;
  debt: string;
  positionHealthColor: string;
  debtNumber: number;
  collateralNumber: number;
};

export function useOpenPositions(account: string) {
  const allPositionMeta: TokenStratPositionMetadata =
    useIsolatedPositionMetadata(account);

  const allStratMeta = React.useContext(StrategyMetadataContext);
  const positions = Object.values(allPositionMeta)
    .flatMap((x) => x)
    .filter((pos) => pos.collateralValue.value.gt(parseEther('0.01')))
    .filter((pos) => pos.strategy in allStratMeta[pos.token.address]);
  const stable = useStable();

  const rows: TrancheData[] =
    positions.length > 0
      ? positions
        .map((posMeta) => {
          const stratMeta = allStratMeta[posMeta.token.address];
          const params = { ...posMeta, ...stratMeta[posMeta.strategy] };
          const { token, APY, borrowablePercent, usdPrice } = params;

          const collateral =
              'collateral' in params && params.collateral
                ? params.collateral
                : new CurrencyValue(token, BigNumber.from(0));
          const debt =
              'debt' in params && params.debt.gt(params.yield)
                ? params.debt.sub(params.yield)
                : new CurrencyValue(stable, BigNumber.from(0));
          const contractName = params.underlyingStrategyName;

          const stratLabel =
              params.yieldType === YieldType.REPAYING
                ? 'Self-repaying'
                : contractName ?? 'Compounding';
          const totalPercentage =
              parseFloatCurrencyValue(collateral) > 0 && usdPrice > 0
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
          const positionHealth = {
            accent: 'Safe',
            green: 'Healthy',
            orange: 'Risky',
            red: 'Critical',
            ['purple.400']: 'Liquidatable',
          };

          return {
            token: token,
            trancheId: params.trancheId,
            positionHealth: positionHealth[positionHealthColor],
            stratLabel: stratLabel,
            APY: APY.toFixed(2) + '%',
            collateralValue: debt.isZero()
              ? '∞'
              : (
                params.collateralValue.value
                  .mul(10000)
                  .div(debt.value)
                  .toNumber() / 100
              ).toFixed(1) + '%',
            liquidationPrice: '$' + params.liquidationPrice.toFixed(2),
            collateral: collateral.format({
              significantDigits: Infinity,
              suffix: '',
            }),
            debt: debt.format({
              significantDigits: 3,
              suffix: '',
            }),
            positionHealthColor: positionHealthColor,
            parsedPositionHealth: positionHealth[positionHealthColor],
            debtNumber: parseFloatCurrencyValue(debt),
            collateralNumber: parseFloatCurrencyValue(collateral),
          };
        })
        .map((posMeta) => {
          const positionHealthOrder = new Map([
            ['Safe', 4],
            ['Healthy', 3],
            ['Risky', 2],
            ['Critical', 1],
            ['Liquidatable', 0],
          ]);

          return {
            ...posMeta,
            positionHealthOrder:
                positionHealthOrder.get(posMeta.parsedPositionHealth) ?? 4,
          };
        })
      //sort liquidatable first
        .sort(function (a, b) {
          if (a.positionHealthOrder === b.positionHealthOrder) {
            return b.debtNumber - a.debtNumber;
          } else {
            return a.positionHealthOrder - b.positionHealthOrder;
          }
        })
      : ([] as TrancheData[]);

  // convert this rows into a mapping and the key is the token addreess, and the values are the positions for that token
  const rowsMap = rows.reduce((acc, row) => {
    if (acc[row.token.address]) {
      acc[row.token.address].push(row);
    } else {
      acc[row.token.address] = [row];
    }
    return acc;
  }, {} as { [tokenAddress: string]: TrancheData[] });

  return { rows, rowsMap };
}
