import { CurrencyValue } from '@usedapp/core';
import { parseEther } from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber } from '@usedapp/core/node_modules/ethers';
import React, { useEffect, useState } from 'react';
import {
  ParsedPositionMetaRow,
  parsePositionMeta,
  useStable,
  useUpdatedPositions,
} from '../chain-interaction/contracts';
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

  const parsedPositions = new Map<number, ParsedPositionMetaRow>();
  for (let index = 0; index < jointUpdatedPositions.length; index++) {
    const pos = jointUpdatedPositions[index];
    parsedPositions.set(pos.trancheId, pos);
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
    .filter(
      (posMeta) =>
        1.25 * posMeta.liquidationPrice > tokenPrices[posMeta.token.address] &&
        posMeta.debt.gt(dollar)
    )
    .map((posMeta) => {
      return {
        ...posMeta,
        liquidateButton:
          posMeta.liquidationPrice > tokenPrices[posMeta.token.address],
      };
    })
    .filter((posMeta) => !stableTickers.includes(posMeta.token.ticker));

  return (
    <LiquidatablePositionsContext.Provider value={liquidatablePositions}>
      {children}
    </LiquidatablePositionsContext.Provider>
  );
}
