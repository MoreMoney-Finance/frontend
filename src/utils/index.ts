import { CurrencyValue, useEthers } from '@usedapp/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

export function parseFloatNoNaN(input: string) {
  const parsed = parseFloat(input);
  return isNaN(parsed) ? 0 : parsed;
}
export function parseFloatCurrencyValue(input: CurrencyValue) {
  const parsed = parseFloatNoNaN(
    input.format({
      significantDigits: Infinity,
      suffix: '',
      thousandSeparator: '',
      decimalSeparator: '.',
    })
  );
  return isNaN(parsed) ? 0 : parsed;
}
export function formatNumber(input: number) {
  if (input) {
    return input.toLocaleString('en-US', {});
  } else {
    return 0;
  }
}

export function useConnectWallet() {
  const { activate } = useEthers();
  const providerOptions = {
    injected: {
      package: 'metamask',
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '27e484dcd9e3efcfd25a83a78777cdf1', // required
      },
    },
  };
  async function onConnect() {
    try {
      const web3Modal = new Web3Modal({
        providerOptions, // required
        theme: 'dark',
      });

      const provider = await web3Modal.connect();
      await activate(provider);
    } catch (error) {
      console.error(error);
    }
  }
  return { onConnect };
}
