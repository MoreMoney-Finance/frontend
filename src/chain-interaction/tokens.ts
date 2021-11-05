import { BigNumber } from '@ethersproject/bignumber';
import { ChainId, CurrencyValue, NativeCurrency, Token } from '@usedapp/core';
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
};

for (const [chainId, lpTokensPerChain] of Object.entries(lptokens)) {
  for (const [amm, records] of Object.entries(lpTokensPerChain)) {
    for (const [ticker, record] of Object.entries(records)) {
      if ('pairAddress' in record) {
        addressToken.set(
          record.pairAddress,
          new Token(
            [amm, ticker, 'LPT'].join('-'),
            ticker,
            chainIds[chainId],
            record.pairAddress,
            18
          )
        );
        const icons: string[] = [];
        icons.push(...(addressIcons.get(record.addresses[0]) ?? []));
        icons.push(...(addressIcons.get(record.addresses[1]) ?? []));

        addressIcons.set(record.pairAddress, icons);
      }
    }
  }
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
