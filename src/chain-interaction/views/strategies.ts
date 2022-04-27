import { parseUnits, parseEther, formatEther } from '@ethersproject/units';
import { ChainId, CurrencyValue, Token, useEthers } from '@usedapp/core';
import { BigNumber, ethers } from 'ethers';
import { getAddress, Interface, parseBytes32String } from 'ethers/lib/utils';
import React, { useState, useContext } from 'react';
import {
  YYMetadata,
  YieldMonitorMetadata,
  ExternalMetadataContext,
} from '../../contexts/ExternalMetadataContext';
import { WalletBalancesContext } from '../../contexts/WalletBalancesContext';
import { parseFloatCurrencyValue } from '../../utils';
import { getTokenFromAddress, tokenAmount } from '../tokens';
import {
  YieldType,
  addresses,
  useAddresses,
  useGlobalDebtCeiling,
  useStable,
  useTotalSupply,
} from './contracts';
import { ParsedPositionMetaRow, RawPositionMetaRow } from './positions';
import StrategyViewer from '../../contracts/artifacts/contracts/StrategyViewer.sol/StrategyViewer.json';

type RawStratMetaRow = {
  debtCeiling: BigNumber;
  APF: BigNumber;
  borrowablePer10k: BigNumber;
  mintingFee: BigNumber;
  stabilityFee: BigNumber;
  strategy: string;
  strategyName: string;
  token: string;
  totalCollateral: BigNumber;
  totalDebt: BigNumber;
  valuePer1e18: BigNumber;
  tvl: BigNumber;
  harvestBalance2Tally: BigNumber;
  yieldType: number;
  underlyingStrategy?: string;
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
  borrowablePercent: number;
  usdPrice: number;
  strategyName: string;
  tvlInToken: CurrencyValue;
  tvlInPeg: CurrencyValue;
  harvestBalance2Tally: CurrencyValue;
  yieldType: YieldType;
  balance: number;
};

export type StrategyMetadata = Record<
  string,
  Record<string, ParsedStratMetaRow>
>;

export function calcLiquidationPrice(
  borrowablePercent: number,
  debt: CurrencyValue,
  collateral: CurrencyValue
) {
  const debtNum = parseFloatCurrencyValue(debt);
  const colNum = parseFloatCurrencyValue(collateral);

  return calcLiqPriceFromNum(borrowablePercent, debtNum, colNum);
}

export function calcLiqPriceFromNum(
  borrowablePercent: number,
  debtNum: number,
  colNum: number
): number {
  if (colNum > 0) {
    return (100 * debtNum) / (colNum * borrowablePercent);
  } else {
    return 0;
  }
}

// export async function queryStratMeta(library: any) {
//   const wsm = (await new ethers.Contract('0x21c971d78e1a398710d964ed1ac4c80e5940ed25', new Interface(IStrategy.abi), library).viewStrategyMetadata(
//     '0x2148D1B21Faa7eb251789a51B404fc063cA6AAd6'
//   ));

//   console.log('wsm', wsm);

//   for (let contract of [
//     '0xdfa3bcda5f954a1e6cef247bdfa89f15702a7473',
//     // '0x21c971d78e1a398710d964ed1ac4c80e5940ed25',
//     // '0x0db20d1643112fa00c4d3ddb58369ad26c1f7c1d',
//     '0xaa3ea561a656cbe310f2e10981085da2d989f17e',
//     '0x888fc8d90177a4097e196ef6bbdc7d2e8cffdb17',
//     '0x10d71115360f9129623096e8108bc6856cf86d3a',
//   ]) {
//     const contrac = new ethers.Contract(
//       contract,
//       new Interface(IsolatedLending.abi),
//       library
//     );
//     console.log('querying', contract);
//     const result = await contrac.viewAllStrategyMetadata();
//     console.log('Returened strat meta', contract, result);
//   }
//   return undefined;
// }

export function useIsolatedStrategyMetadata(): StrategyMetadata {
  const [stratMeta, setStratMeta] = useState<StrategyMetadata>({});
  const stable = useStable();
  const { chainId } = useEthers();

  const globalDebtCeiling = useGlobalDebtCeiling(
    'globalDebtCeiling',
    [],
    BigNumber.from(0)
  );
  const totalSupply = useTotalSupply('totalSupply', [], BigNumber.from(0));

  const balancesCtx = useContext(WalletBalancesContext);
  const { yyMetadata, yieldMonitor, additionalYieldData } = useContext(
    ExternalMetadataContext
  );

  const addresses = useAddresses();

  const token2Strat = {
    ['0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE']:
      addresses.LiquidYieldStrategy,
    ['0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7']:
      addresses.YieldYakAVAXStrategy,
    ['0x60781C2586D68229fde47564546784ab3fACA982']: addresses.YieldYakStrategy,
    ['0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7']: addresses.YieldYakStrategy,
    ['0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd']: addresses.YieldYakStrategy,
    ['0xd586e7f844cea2f87f50152665bcbc2c279d8d70']: addresses.YieldYakStrategy,
    ['0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5']: addresses.YieldYakStrategy,
    ['0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664']: addresses.YieldYakStrategy,
    ['0xA389f9430876455C36478DeEa9769B7Ca4E3DDB1']: addresses.YieldYakStrategy,
    ['0xeD8CBD9F0cE3C6986b22002F03c6475CEb7a6256']: addresses.YieldYakStrategy,
    ['0x454E67025631C065d3cFAD6d71E6892f74487a15']:
      addresses.TraderJoeMasterChefStrategy,
    ['0x2148D1B21Faa7eb251789a51B404fc063cA6AAd6']:
      addresses.SimpleHoldingStrategy,
    ['0xCDFD91eEa657cc2701117fe9711C9a4F61FEED23']:
      addresses.MultiTraderJoeMasterChef3Strategy,
  };

  const masterChef2Tokens = [
    '0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33',
    '0xa389f9430876455c36478deea9769b7ca4e3ddb1',
    '0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256',
  ].map(getAddress);

  const tokens = Object.keys(token2Strat);
  tokens.push('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7');
  const strats = Object.values(token2Strat);
  strats.push(addresses.LiquidYieldStrategy);

  tokens.push('0x454E67025631C065d3cFAD6d71E6892f74487a15');
  strats.push(addresses.YieldYakStrategy);

  const globalMoneyAvailable = globalDebtCeiling.sub(totalSupply);

  tokens.push('0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd');
  strats.push(addresses.sJoeStrategy);

  React.useEffect(() => {
    async function getData() {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://api.avax.network/ext/bc/C/rpc'
      );

      const stratViewer = new ethers.Contract(
        addresses.StrategyViewer,
        new Interface(StrategyViewer.abi),
        provider
      );

      const normalResults = await stratViewer.viewMetadata(
        addresses.StableLending,
        tokens,
        strats
      );
      const noHarvestBalanceResults =
        await stratViewer.viewMetadataNoHarvestBalance(
          addresses.StableLending,
          addresses.OracleRegistry,
          addresses.Stablecoin,
          masterChef2Tokens,
          Array(masterChef2Tokens.length).fill(
            addresses.TraderJoeMasterChef2Strategy
          )
        );

      const results = [...normalResults, ...noHarvestBalanceResults];

      const reduceFn = (result: StrategyMetadata, row: RawStratMetaRow) => {
        const parsedRow = parseStratMeta(
          chainId ?? 43114,
          row,
          stable,
          balancesCtx,
          yyMetadata,
          globalMoneyAvailable,
          yieldMonitor,
          additionalYieldData
        );

        return parsedRow
          ? {
              ...result,
              [parsedRow.token.address]: {
                [parsedRow.strategyAddress]: parsedRow,
                ...(result[parsedRow.token.address] || {}),
              },
            }
          : result;
      };

      setStratMeta(results?.reduce(reduceFn, {}) ?? {});
    }
    if (
      chainId &&
      stable &&
      balancesCtx &&
      yyMetadata &&
      globalMoneyAvailable != 0 &&
      yieldMonitor &&
      Object.values(stratMeta).length === 0
    ) {
      getData();
    }
  }, [
    chainId,
    stable,
    balancesCtx,
    yyMetadata,
    globalMoneyAvailable,
    yieldMonitor,
    stratMeta,
  ]);

  return stratMeta;
}

function parseStratMeta(
  chainId: ChainId,
  row: RawStratMetaRow,
  stable: Token,
  balancesCtx: Map<string, CurrencyValue>,
  yyMetadata: YYMetadata,
  globalMoneyAvailable: BigNumber,
  yieldMonitor: Record<string, YieldMonitorMetadata>,
  additionalYield: Record<string, Record<string, number>>
): ParsedStratMetaRow | undefined {
  const token = getTokenFromAddress(chainId, row.token);
  if (token) {
    const tvlInToken = tokenAmount(chainId, row.token, row.tvl)!;
    const balance =
      balancesCtx.get(token!.address) ??
      new CurrencyValue(token, BigNumber.from('0'));

    const strategyAddress = getAddress(row.strategy);
    const underlyingAddress = row.underlyingStrategy
      ? getAddress(row.underlyingStrategy)
      : strategyAddress;

    const APY =
      strategyAddress === addresses[chainId].LiquidYieldStrategy
        ? token.address === '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
          ? (yieldMonitor['0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d']
              .totalApy *
              0.65 *
              0.8) /
            0.5
          : (yieldMonitor['0x4b946c91C2B1a7d7C40FB3C130CdfBaf8389094d']
              .totalApy *
              0.3 *
              0.8) /
              0.5 +
            8
        : underlyingAddress in yyMetadata
        ? yyMetadata[underlyingAddress].apy * 0.9
        : token.address in yieldMonitor
        ? yieldMonitor[token.address].totalApy
        : token.address in additionalYield &&
          strategyAddress in additionalYield[token.address]
        ? additionalYield[token.address][strategyAddress]
        : 0;

    const syntheticDebtCeil = globalMoneyAvailable.add(row.totalDebt);

    const trueOne = parseUnits('1', token.decimals);
    const valPerOne = trueOne.mul(row.valuePer1e18).div(parseEther('1'));

    return {
      debtCeiling: new CurrencyValue(
        stable,
        row.debtCeiling.gt(syntheticDebtCeil)
          ? syntheticDebtCeil
          : row.debtCeiling
      ),
      totalDebt: new CurrencyValue(stable, row.totalDebt),
      stabilityFeePercent: row.stabilityFee.toNumber() / 100,
      mintingFeePercent: row.mintingFee.toNumber() / 100,
      strategyAddress,
      token,
      APY,
      totalCollateral: tokenAmount(chainId, row.token, row.totalCollateral)!,
      borrowablePercent: row.borrowablePer10k.toNumber() / 100,
      usdPrice:
        parseFloat(formatEther(row.valuePer1e18)) / 10 ** (18 - token.decimals),
      strategyName: parseBytes32String(row.strategyName),
      tvlInToken,
      tvlInPeg: new CurrencyValue(stable, row.tvl.mul(valPerOne).div(trueOne)),
      harvestBalance2Tally: new CurrencyValue(stable, row.harvestBalance2Tally),
      yieldType: [YieldType.REPAYING, YieldType.COMPOUNDING, YieldType.NOYIELD][
        row.yieldType
      ],
      balance: parseFloatCurrencyValue(balance),
    };
  }
}

export function parsePositionMeta(
  row: RawPositionMetaRow,
  stable: Token,
  trancheContract: string
): ParsedPositionMetaRow {
  const debt = new CurrencyValue(stable, row.debt);
  const posYield = new CurrencyValue(stable, row.yield);
  const collateral =
    tokenAmount(stable.chainId, row.token, row.collateral) ??
    new CurrencyValue(
      new Token('', '', stable.chainId, row.token),
      row.collateral
    );

  const borrowablePercent = row.borrowablePer10k.toNumber() / 100;

  return {
    trancheContract,
    trancheId: row.trancheId.toNumber(),
    strategy: row.strategy,
    debt,
    collateral,
    token: getTokenFromAddress(stable.chainId, row.token)!,
    yield: posYield,
    collateralValue: new CurrencyValue(stable, row.collateralValue),
    borrowablePercent,
    owner: row.owner,
    liquidationPrice: debt.gt(posYield)
      ? calcLiquidationPrice(borrowablePercent, debt.sub(posYield), collateral!)
      : 0,
  };
}
