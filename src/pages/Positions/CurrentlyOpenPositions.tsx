import { Flex } from '@chakra-ui/react';
import { CurrencyValue, Token } from '@usedapp/core';
import { parseEther } from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber } from 'ethers';
import * as React from 'react';
import {
  TokenStratPositionMetadata,
  useIsolatedPositionMetadata,
  useStable,
  YieldType,
} from '../../chain-interaction/views/contracts';
import { StrategyMetadataContext } from '../../contexts/StrategyMetadataContext';
import { parseFloatCurrencyValue } from '../../utils';
import { TrancheCard } from './TrancheCard';
import { TrancheTable } from './TrancheTable';

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
};

export default function CurrentlyOpenPositions({
  account,
}: React.PropsWithChildren<{ account: string }>) {
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
      ? positions.map((posMeta) => {
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

        const stratLabel =
            params.yieldType === YieldType.REPAYING
              ? 'Self-repaying'
              : 'Compounding';
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
        };
      })
      : ([] as TrancheData[]);

  return positions.length > 0 ? (
    <>
      <Flex
        p={[0, 4, 4]}
        display={['flex', 'flex', 'flex', 'none', 'none']}
        flexDirection={'column'}
      >
        {rows.map((row, i) => {
          return (
            <TrancheCard
              key={`isolatedTranche${i}`}
              token={row.token}
              row={row}
            />
          );
        })}
      </Flex>
      <Flex
        justifyContent={'center'}
        display={['none', 'none', 'none', 'table', 'table']}
      >
        <TrancheTable rows={rows} positions={positions} />
      </Flex>
    </>
  ) : (
    <> </>
  );
}
