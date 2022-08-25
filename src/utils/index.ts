import { CurrencyValue, useEthers } from '@usedapp/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import CoreLogo from '../assets/img/core.svg';

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
    injected:
      typeof window?.ethereum?.isAvalanche !== 'undefined'
        ? {
          display: {
            logo: CoreLogo,
            name: 'Core Wallet',
          },
          package: 'metamask',
        }
        : {
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
      fetch(
        `https://api.snowtrace.io/api?module=contract&action=getsourcecode&address=${address}`
      )
        .then((response) => response.json())
        .then((data) => setName(data.result[0].ContractName));
    }
  }, [address]);

  return name;
}

export async function getContractNames(underlyingAddresses: Set<string>) {
  console.log('Getting contract names');

  const names = new Map<string, string>();

  for (const address of underlyingAddresses) {
    const result = await (
      await fetch(
        `https://api.snowtrace.io/api?module=contract&action=getsourcecode&address=${address}`
      )
    ).json();
    console.log(
      `Setting contract name ${address}: ${result.result[0].ContractName}`
    );
    const name = result.result[0].ContractName;
    if (!name) {
      console.log(`Trying to query for ${address}`, result);
    }
    names.set(address, name && spacecamel(name.replace('Strategy', '')));
  }

  console.log('Finished getting contract names');
  return names;
}

function spacecamel(s: string) {
  return s.replace(/([a-z])([A-Z])/g, '$1 $2');
}
