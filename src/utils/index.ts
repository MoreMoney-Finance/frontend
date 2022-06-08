import { CurrencyValue, useEthers } from '@usedapp/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';

export function sqrt(value: BigNumber): BigNumber {
  const ONE = ethers.BigNumber.from(1);
  const TWO = ethers.BigNumber.from(2);
  const x = ethers.BigNumber.from(value);
  let z = x.add(ONE).div(TWO);
  let y = x;
  while (z.sub(y).isNegative()) {
    y = z;
    z = x.div(z).add(z).div(TWO);
  }
  return y;
}

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
    return (0).toLocaleString('en-US', {});
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

export function useContractName(address: string | undefined) {
  const [name, setName] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (address) {
      fetch(`https://api.snowtrace.io/api?module=contract&action=getsourcecode&address=${address}`)
        .then(response => response.json())
        .then(data => setName(data.result[0].ContractName));
    }
  }, [address]);

  return name;
}