import { Progress } from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { parseEther } from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber } from '@usedapp/core/node_modules/ethers';
import React, { useEffect, useState } from 'react';
import {
  ParsedPositionMetaRow,
  parsePositionMeta,
  useStable,
  useUpdatedMetadataLiquidatablePositions,
  useUpdatedPositions,
} from '../chain-interaction/contracts';
import { parseFloatCurrencyValue } from '../utils';
import { StrategyMetadataContext } from './StrategyMetadataContext';

export const LiquidatablePositionsContext = React.createContext<
  ParsedPositionMetaRow[] | []
>([]);

type CachedPos = {
  trancheId: number;
  strategy: string;
  collateral: string;
  debt: number;
  token: string;
  collateralValue: number;
  borrowablePer10k: number;
  owner: string;
  trancheContract: string;
};

export function LiquidatablePositionsCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const tokenPrices = Object.fromEntries(
    Object.entries(React.useContext(StrategyMetadataContext))
      .filter((row) => Object.values(row[1]).length > 0)
      .map(([tokenAddress, stratMeta]) => [
        tokenAddress,
        Object.values(stratMeta)[0].usdPrice,
      ])
  );
  const stable = useStable();

  const [cachedPositions, setCachedPosition] = useState<{
    tstamp: number;
    positions: Record<string, CachedPos>;
  }>({
    tstamp: Date.now(),
    positions: {},
  });
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/MoreMoney-Finance/craptastic-api/main/src/updated-positions.json'
    )
      .then((response) => response.json())
      .then(setCachedPosition)
      .catch((err) => {
        console.error('Failed to fetch cached positions');
        console.log(err);
      });
  }, []);
  const parsedCachePositions = Object.values(cachedPositions.positions)
    .map((pos) => ({
      trancheId: BigNumber.from(pos.trancheId),
      strategy: pos.strategy,
      collateral: BigNumber.from(pos.collateral),
      debt: parseEther(pos.debt.toString()),
      token: pos.token,
      collateralValue: parseEther(pos.collateralValue.toString()),
      borrowablePer10k: BigNumber.from(pos.borrowablePer10k),
      owner: pos.owner,
      yield: BigNumber.from(0),
      trancheContract: pos.trancheContract,
    }))
    .map((pos) => parsePositionMeta(pos, stable, pos.trancheContract));

  const START = cachedPositions.tstamp;
  const updatedPositions = useUpdatedPositions(START);
  console.log('parseCachePositions', parsedCachePositions);
  console.log('updatedPositions', updatedPositions);
  const jointUpdatedPositions = [...parsedCachePositions, ...updatedPositions];
  const updatedMetadata =
    useUpdatedMetadataLiquidatablePositions(parsedCachePositions);
  const updatedPositionMetadata = updatedMetadata
    .map((x) => (x && x[0] != undefined ? x[0] : []))
    .map((pos) => {
      return parsePositionMeta(pos, stable, pos.trancheContract);
    });

  const updatedDataMap = updatedPositionMetadata.reduce((acc, x) => {
    acc[x.trancheId] = x;
    return acc;
  }, {} as Record<string, ParsedPositionMetaRow>);

  const parsedPositions = new Map<number, ParsedPositionMetaRow>();
  for (let index = 0; index < jointUpdatedPositions.length; index++) {
    const pos = jointUpdatedPositions[index];
    const posUpdatedData = {
      ...updatedDataMap[pos.trancheId],
      trancheContract: pos.trancheContract,
    };
    parsedPositions.set(pos.trancheId, posUpdatedData);
  }
  const dollar = new CurrencyValue(stable, parseEther('1'));

  const stableTickers = [
    'USDT',
    'USDC',
    'DAI',
    'FRAX',
    'USDT.e',
    'USDC.e',
    'DAI.e',
  ];

  const liquidatablePositions = Array.from(parsedPositions.values())
    .filter((posMeta) => {
      return (
        1.25 * posMeta.liquidationPrice > tokenPrices[posMeta.token?.address] &&
        posMeta.debt.gt(dollar)
      );
    })
    .map((posMeta) => {
      const collateralVal =
        parseFloatCurrencyValue(posMeta.collateral!) *
        tokenPrices[posMeta.token?.address];
      const totalPercentage =
        parseFloatCurrencyValue(posMeta.collateral!) > 0 &&
        tokenPrices[posMeta.token?.address] > 0
          ? (100 * parseFloatCurrencyValue(posMeta.debt)) / collateralVal
          : 0;
      const liquidatableZone = posMeta.borrowablePercent;
      const criticalZone = (90 * posMeta.borrowablePercent) / 100;
      const riskyZone = (80 * posMeta.borrowablePercent) / 100;
      const healthyZone = (50 * posMeta.borrowablePercent) / 100;

      const positionHealthColor = posMeta.debt.value.lt(parseEther('0.1'))
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
        ...posMeta,
        liquidateButton:
          posMeta.liquidationPrice > tokenPrices[posMeta.token?.address],
        positionHealthColor: positionHealthColor,
        parsedPositionHealth: positionHealth[positionHealthColor],
        collateralValue: new CurrencyValue(
          stable,
          parseEther(collateralVal.toFixed(18))
        ),
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
    .filter((posMeta) => !stableTickers.includes(posMeta.token?.ticker))
    //sort liquidatable first
    .sort(function (a, b) {
      return a.positionHealthOrder - b.positionHealthOrder;
    });

  return (
    <LiquidatablePositionsContext.Provider value={liquidatablePositions}>
      {Object.values(updatedDataMap).length > 0 ? (
        children
      ) : (
        <Progress isIndeterminate />
      )}
    </LiquidatablePositionsContext.Provider>
  );
}
