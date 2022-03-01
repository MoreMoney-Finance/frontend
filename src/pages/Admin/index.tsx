import { getExplorerAddressLink, useEthers } from '@usedapp/core';
import * as React from 'react';
import { useAddresses } from '../../chain-interaction/contracts';

export default function AdminPage(props: React.PropsWithChildren<unknown>) {
  const addresses = useAddresses();
  const { chainId } = useEthers();
  return (
    <div>
      <ul>
        {Object.entries(addresses).map(([key, value]) => (
          <li key={key}>
            <a
              href={getExplorerAddressLink(value, chainId!)}
              target="_blank"
              rel="noreferrer"
            >
              {key}
            </a>
          </li>
        ))}
      </ul>
      {props.children}
    </div>
  );
}
