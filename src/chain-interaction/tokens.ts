import { BigNumber } from '@ethersproject/bignumber';
import { ChainId, CurrencyValue, NativeCurrency, Token } from '@usedapp/core';
import tokenlist from '../constants/tokenlist.json';
import deployAddresses from '../contracts/addresses.json';

export const addressToken: Map<string, Token> = new Map();
export const addressIcons: Map<string, string[]> = new Map();

export function tokenAmount(tokenAddress: string, amount: BigNumber) {
  const token = addressToken.get(tokenAddress);
  if (token) {
    return new CurrencyValue(token, amount);
  }
}

for (const {
  address,
  chainId,
  decimals,
  name,
  symbol,
  logoURI,
} of tokenlist.tokens) {
  addressToken.set(
    address,
    new Token(name, symbol, chainId, address, decimals)
  );
  addressIcons.set(address, [logoURI]);
}

addressToken.set(
  deployAddresses[31337].Stablecoin,
  new Token(
    'USD Money',
    'USDm',
    ChainId.Hardhat,
    deployAddresses[31337].Stablecoin,
    18
  )
);

export const nativeCurrency: Map<ChainId, NativeCurrency> = new Map();

nativeCurrency.set(
  ChainId.Hardhat,
  new NativeCurrency('Avalanche', 'AVAX', ChainId.Hardhat)
);

export const wrappedNativeCurrency: Map<ChainId, Token> = new Map();

wrappedNativeCurrency.set(
  ChainId.Hardhat,
  addressToken.get('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7')!
);
