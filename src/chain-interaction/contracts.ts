import {
  CurrencyValue,
  Token,
  useContractCall,
  useEthers,
} from '@usedapp/core';
import { formatEther } from '@usedapp/core/node_modules/@ethersproject/units';
import { BigNumber } from 'ethers';
import { Interface, parseBytes32String } from 'ethers/lib/utils';
import { useContext } from 'react';
import { UserAddressContext } from '../components/UserAddressContext';
import IsolatedLending from '../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json';
import { addressToken, tokenAmount } from './tokens';
/* eslint-disable */
export const addresses: Record<
  string,
  DeploymentAddresses
> = require('../contracts/addresses.json');

export type DeploymentAddresses = {
  Fund: string;
  Roles: string;
  IsolatedLending: string;
  IsolatedLendingLiquidation: string;
  DependencyController: string;
  OracleRegistry: string;
  Stablecoin: string;
  StrategyRegistry: string;
  TrancheIDService: string;
};

export function useAddresses() {
  const { chainId } = useEthers();

  // TODO make the default avalanche once it's supported by useDApp
  const chainIdStr = chainId ? chainId.toString() : '31337';
  return addresses[chainIdStr];
}

export function useIsolatedLendingView(method: string, args: any[]) {
  const address = useAddresses().IsolatedLending;
  const abi = new Interface(IsolatedLending.abi);
  return (useContractCall({
    abi,
    address,
    method,
    args,
  }) ?? [[]])[0];
}

type RawStratMetaRow = {
  debtCeiling: BigNumber;
  APF: BigNumber;
  colRatio: BigNumber;
  liqRatio: BigNumber;
  mintingFee: BigNumber;
  stabilityFee: BigNumber;
  strategy: string;
  strategyName: string;
  token: string;
  totalCollateral: BigNumber;
  totalDebt: BigNumber;
  valuePer1e18: BigNumber;
};

export type ParsedStratMetaRow = {
  debtCeiling: CurrencyValue;
  totalDebt: CurrencyValue;
  stabilityFeePercent: number;
  mintingFeePercent: number;
  strategyAddress: string;
  token: Token;
  APY: number;
  totalCollateral: CurrencyValue;
  colRatioPercent: number;
  usdPrice: number;
  strategyName: string;
  liqRatioPercent: number;
};

function parseStratMeta(
  row: RawStratMetaRow,
  stable: Token
): ParsedStratMetaRow {
  const token = addressToken.get(row.token)!;
  return {
    debtCeiling: new CurrencyValue(stable, row.debtCeiling)!,
    totalDebt: new CurrencyValue(stable, row.totalDebt),
    stabilityFeePercent: row.stabilityFee.toNumber() / 100,
    mintingFeePercent: row.mintingFee.toNumber() / 100,
    strategyAddress: row.strategy,
    token,
    APY: convertAPF2APY(row.APF),
    totalCollateral: tokenAmount(row.token, row.totalCollateral)!,
    colRatioPercent: row.colRatio.toNumber() / 100,
    usdPrice:
      parseFloat(formatEther(row.valuePer1e18)) / 10 ** (18 - token.decimals),
    strategyName: parseBytes32String(row.strategyName),
    liqRatioPercent: row.liqRatio.toNumber() / 100,
  };
}

const COMPOUNDING = 52;

function convertAPF2APY(APF: BigNumber): number {
  const apf = APF.toNumber();
  return 100 * ((1 + (apf / 10000 - 1) / COMPOUNDING) ** COMPOUNDING - 1);
}

export function useStable() {
  const addresses = useAddresses();
  return addresses ? addressToken.get(addresses.Stablecoin) : undefined;
}

export function useIsolatedStrategyMetadata() {
  const stable = useStable();
  const allStratMeta = useIsolatedLendingView('viewAllStrategyMetadata', []);
  return stable
    ? allStratMeta.map((row: RawStratMetaRow) => parseStratMeta(row, stable))
    : [];
}

export type ParsedPositionMetaRow = {
  trancheId: number;
  strategy: string;
  collateral: CurrencyValue | undefined;
  debt: CurrencyValue;
  token: Token;
};

type RawPositionMetaRow = {
  trancheId: BigNumber;
  strategy: string;
  collateral: BigNumber;
  debt: BigNumber;
  token: string;
};

function parsePositionMeta(
  row: RawPositionMetaRow,
  stable: Token
): ParsedPositionMetaRow {
  return {
    trancheId: row.trancheId.toNumber(),
    strategy: row.strategy,
    debt: new CurrencyValue(stable, row.debt),
    collateral: tokenAmount(row.token, row.collateral),
    token: addressToken.get(row.token)!,
  };
}

export function useIsolatedPositionMetadata(): Record<
  string,
  ParsedPositionMetaRow
> {
  const account = useContext(UserAddressContext);
  const positionMeta = useIsolatedLendingView('viewPositionsByOwner', [
    account,
  ]);
  const stable = useStable();
  return stable
    ? Object.fromEntries(
        positionMeta.map((row: RawPositionMetaRow) => [
          `${row.strategy}-${row.token}`,
          parsePositionMeta(row, stable),
        ])
      )
    : {};
}
