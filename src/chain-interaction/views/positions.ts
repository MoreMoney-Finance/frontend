import {
  ContractCall,
  CurrencyValue,
  Token,
  useContractCalls,
  useContractFunction,
} from '@usedapp/core';
import { BigNumber, Contract } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import IsolatedLending from '../../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json';
import StableLending from '../../contracts/artifacts/contracts/StableLending.sol/StableLending.json';
import DirectFlashLiquidation from '../../contracts/artifacts/contracts/liquidation/DirectFlashLiquidation.sol/DirectFlashLiquidation.json';
import { useAddresses, useIsolatedLendingView, useStable } from './contracts';
import { parsePositionMeta } from './strategies';

export type ParsedPositionMetaRow = {
  trancheId: number;
  strategy: string;
  collateral: CurrencyValue | undefined;
  debt: CurrencyValue;
  token: Token;
  yield: CurrencyValue;
  collateralValue: CurrencyValue;
  borrowablePercent: number;
  owner: string;
  liquidationPrice: number;
  trancheContract: string;
  liquidateButton?: boolean;
  positionHealth?: string;
  positionHealthColor?: string;
  parsedPositionHealth?: string;
  positionHealthOrder?: number;
};

export type RawPositionMetaRow = {
  trancheId: BigNumber;
  strategy: string;
  collateral: BigNumber;
  debt: BigNumber;
  token: string;
  yield: BigNumber;
  collateralValue: BigNumber;
  borrowablePer10k: BigNumber;
  owner: string;
};

export type TokenStratPositionMetadata = Record<
  string,
  ParsedPositionMetaRow[]
>;
export function useIsolatedPositionMetadata(
  account: string
): TokenStratPositionMetadata {
  const { legacy, current } = useIsolatedLendingView(
    'viewPositionsByOwner',
    [account],
    []
  );
  const stable = useStable();

  function reduceFn(trancheContract: string) {
    return (result: TokenStratPositionMetadata, row: RawPositionMetaRow) => {
      const parsedRow = parsePositionMeta(row, stable, trancheContract);
      const tokenAddress = parsedRow.token?.address;
      const list = result[tokenAddress] || [];
      return {
        ...result,
        [tokenAddress]: [...list, parsedRow],
      };
    };
  }

  const addresses = useAddresses();
  const legacyResults =
    'IsolatedLending' in addresses
      ? legacy.reduce(reduceFn(addresses.IsolatedLending), {})
      : {};
  return 'StableLending' in addresses
    ? current.reduce(reduceFn(addresses.StableLending), legacyResults)
    : legacyResults;
}

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;
export function useUpdatedPositions(timeStart: number) {
  const endPeriod = 1 + Math.round(Date.now() / 1000 / ONE_WEEK_SECONDS);
  const startPeriod = Math.floor(timeStart / 1000 / ONE_WEEK_SECONDS) - 2;
  // console.log('endPeriod', endPeriod);
  // console.log('startPeriod', startPeriod);
  const stable = useStable();
  const addresses = useAddresses();

  function args(trancheContract: string) {
    return Array(endPeriod - startPeriod)
      .fill(startPeriod)
      .map((x, i) => ({
        abi: new Interface(IsolatedLending.abi),
        address: trancheContract,
        method: 'viewPositionsByTrackingPeriod',
        args: [x + i],
      }));
  }

  const legacyRows =
    (useContractCalls(
      args(addresses.IsolatedLending)
    ) as RawPositionMetaRow[][][]) || [];
  const currentRows =
    (useContractCalls(
      args(addresses.StableLending)
    ) as RawPositionMetaRow[][][]) || [];

  function parseRows(rows: RawPositionMetaRow[][][], trancheContract: string) {
    return rows
      .flatMap((x) => x)
      .flatMap((x) => x)
      .filter((x) => x)
      .map((row) => parsePositionMeta(row, stable, trancheContract));
  }
  return [
    ...((legacyRows.length > 0 &&
      parseRows(legacyRows, addresses.IsolatedLending)) ||
      []),
    ...((currentRows.length > 0 &&
      parseRows(currentRows, addresses.StableLending)) ||
      []),
  ];
}

export function useUpdatedMetadataLiquidatablePositions(
  positions?: ParsedPositionMetaRow[]
) {
  const abi = {
    [useAddresses().IsolatedLending]: new Interface(IsolatedLending.abi),
    [useAddresses().StableLending]: new Interface(StableLending.abi),
  };

  const positionCalls: ContractCall[] = positions!.map((pos) => {
    return {
      abi: abi[pos.trancheContract],
      address: pos.trancheContract,
      method: 'viewPositionMetadata',
      args: [pos.trancheId],
    };
  });

  const updatedData = useContractCalls(positionCalls);

  return updatedData.filter((x) => x !== undefined);
}

export function useLiquidationTrans(contractAddress: string) {
  const liquidationContract = new Contract(
    contractAddress,
    new Interface(DirectFlashLiquidation.abi)
  );
  const { send, state } = useContractFunction(liquidationContract, 'liquidate');

  return {
    sendLiquidation: send,
    liquidationState: state,
  };
}
