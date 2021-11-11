import { BigNumber } from '@ethersproject/bignumber';
import { ChainId, CurrencyValue, NativeCurrency, Token } from '@usedapp/core';
import { getAddress } from 'ethers/lib/utils';
import tokenlist from '../constants/tokenlist.json';
import deployAddresses from '../contracts/addresses.json';
import lptokens from '../contracts/lptokens.json';

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

// TODO make this more complete
const chainIds: Record<string, ChainId> = {
  31337: ChainId.Hardhat,
  43114: ChainId.Avalanche,
};

for (const [chainId, lpTokensPerChain] of Object.entries(lptokens)) {
  for (const records of Object.values(lpTokensPerChain)) {
    for (const [ticker, record] of Object.entries(records)) {
      if ('pairAddress' in record) {
        addressToken.set(
          getAddress(record.pairAddress),
          new Token(
            [ticker, 'LPT'].join('-'),
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
  addressToken.set(
    addresses.Stablecoin,
    new Token('USD Money', 'USDm', chainIds[chainId], addresses.Stablecoin, 18)
  );
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
  addressToken.get('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7')!
);
wrappedNativeCurrency.set(
  ChainId.Avalanche,
  addressToken.get('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7')!
);
