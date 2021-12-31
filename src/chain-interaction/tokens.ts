import { BigNumber } from '@ethersproject/bignumber';
import {
  ChainId,
  CurrencyValue,
  NativeCurrency,
  Token,
  useContractCall,
} from '@usedapp/core';
import { getAddress, Interface, parseUnits } from 'ethers/lib/utils';
import tokenlist from '../constants/tokenlist.json';
import deployAddresses from '../contracts/addresses.json';
import lptokens from '../contracts/lptokens.json';
import { useAddresses, useStable } from './contracts';
import OracleRegistry from '../contracts/artifacts/contracts/OracleRegistry.sol/OracleRegistry.json';

const addressToken: Record<ChainId, Map<string, Token>> = Object.fromEntries(
  Object.values(ChainId).map((key) => [key, new Map()])
) as any;
const addressIcons: Map<string, string[]> = new Map();

export function getTokenFromAddress(
  chainId: ChainId | undefined,
  address: string
): Token {
  return addressToken[chainId ?? ChainId.Avalanche].get(getAddress(address))!;
}

export function getIconsFromTokenAddress(address: string): string[] {
  return addressIcons.get(getAddress(address))!;
}

export function tokenAmount(
  chainId: ChainId,
  tokenAddress: string,
  amount: BigNumber
) {
  const token = addressToken[chainId].get(getAddress(tokenAddress));
  if (token) {
    return new CurrencyValue(token, amount);
  }
}

export function getTokensInQuestion(_chainId: ChainId): [string, Token][] {
  if (_chainId === undefined) {
    return [];
  }
  const tokensInQuestion = Array.from(addressToken[_chainId].entries()).filter(
    (aT) => aT[1].chainId === _chainId
  );
  console.log('tokens in question');
  console.log(Array.from(addressToken[_chainId].entries()));
  console.log(tokensInQuestion);

  return tokensInQuestion;
}

for (const {
  address,
  chainId,
  decimals,
  name,
  symbol,
  logoURI,
} of tokenlist.tokens) {
  addressToken[chainId as ChainId].set(
    getAddress(address),
    new Token(name, symbol, chainId, getAddress(address), decimals)
  );
  addressIcons.set(getAddress(address), [logoURI]);
}

// TODO make this more complete
const chainIds: Record<string, ChainId> = {
  31337: ChainId.Hardhat,
  43114: ChainId.Avalanche,
};

for (const [chainId, lpTokensPerChain] of Object.entries(lptokens) as [
  string,
  Record<string, Record<string, { pairAddress?: string; addresses: string[] }>>
][]) {
  for (const records of Object.values(lpTokensPerChain)) {
    for (const [ticker, record] of Object.entries(records)) {
      if ('pairAddress' in record && record.pairAddress) {
        addressToken[chainIds[chainId]].set(
          getAddress(record.pairAddress),
          new Token(
            ticker,
            ticker,
            chainIds[chainId],
            getAddress(record.pairAddress),
            18
          )
        );
        const icons: string[] = [];
        icons.push(
          ...(addressIcons.get(getAddress(record.addresses[0])) ?? [])
        );
        icons.push(
          ...(addressIcons.get(getAddress(record.addresses[1])) ?? [])
        );

        addressIcons.set(getAddress(record.pairAddress), icons);
      }
    }
  }
}

console.log(addressToken);

for (const [chainId, addresses] of Object.entries(deployAddresses)) {
  addressToken[chainIds[chainId]].set(
    getAddress(addresses.Stablecoin),
    new Token(
      'MoreMoney US Dollar',
      'MONEY',
      chainIds[chainId],
      getAddress(addresses.Stablecoin),
      18
    )
  );
  addressIcons.set(getAddress(addresses.Stablecoin), [
    'https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/MONEY%20WHITE.jpg',
  ]);

  if ('CurvePool' in addresses) {
    addressToken[chainIds[chainId]].set(
      getAddress(addresses.CurvePool),
      new Token(
        'Money Curve MetaPool Token',
        'MONEYCRV',
        chainIds[chainId],
        getAddress(addresses.CurvePool)
      )
    );
  }

  if ('ProtocolToken' in addresses) {
    addressToken[chainIds[chainId]].set(
      getAddress(addresses['ProtocolToken']),
      new Token(
        'MoreMoney',
        'MORE',
        chainIds[chainId],
        getAddress(addresses['ProtocolToken'])
      )
    );
  }
}

export const nativeCurrency: Map<ChainId, NativeCurrency> = new Map();

nativeCurrency.set(
  ChainId.Hardhat,
  new NativeCurrency('Avalanche', 'AVAX', ChainId.Hardhat)
);
nativeCurrency.set(
  ChainId.Avalanche,
  new NativeCurrency('Avalanche', 'AVAX', ChainId.Avalanche)
);

export const wrappedNativeCurrency: Map<ChainId, Token> = new Map();

wrappedNativeCurrency.set(
  ChainId.Hardhat,
  addressToken[ChainId.Hardhat].get(
    '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
  )!
);
wrappedNativeCurrency.set(
  ChainId.Avalanche,
  addressToken[ChainId.Avalanche].get(
    '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
  )!
);

export function useOraclePrices(
  tokens: Token[]
): Record<string, CurrencyValue> {
  const addresses = useAddresses();

  const address = addresses.OracleRegistry;
  const abi = new Interface(OracleRegistry.abi);
  const tokenAddresses = tokens.map((token) => token.address);
  const tokenInAmounts = tokens.map((token) => parseUnits('1', token.decimals));
  const stable = useStable();
  const method = 'viewAmountsInPeg';
  const args = [tokenAddresses, tokenInAmounts, stable.address];

  const pegValues = (useContractCall({
    abi,
    address,
    method,
    args,
  }) ?? [[]])[0];

  return Object.fromEntries(
    pegValues.map((v: BigNumber, i: number) => [
      tokens[i].address,
      new CurrencyValue(stable, v),
    ])
  );
}
