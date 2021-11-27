import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
} from '../chain-interaction/contracts';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { Tr, Td, Center, Wrap } from '@chakra-ui/react';
import { TokenDescription } from './TokenDescription';
import { EditTranche } from './EditTranche';

export function IsolatedTranche(
  params: React.PropsWithChildren<ParsedStratMetaRow & ParsedPositionMetaRow>
) {
  const { token, APY, strategyName } = params;

  const stable = useStable();

  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));
  console.log(
    `wallet balance for ${token.name}: ${walletBalance.format({
      significantDigits: 30,
    })} (${token.address})`
  );

  const collateral =
    'collateral' in params && params.collateral
      ? params.collateral
      : new CurrencyValue(token, BigNumber.from(0));
  const debt =
    'debt' in params
      ? params.debt
      : new CurrencyValue(stable, BigNumber.from(0));
  return (
    <>
      <Tr key={token.address}>
        <Td>
          <TokenDescription token={token} />
        </Td>
        <Td>{strategyName}</Td>
        <Td>{APY.toFixed(4)} % APY</Td>
        <Td>
          {params.debtCeiling
            .sub(params.totalDebt)
            .format({ significantDigits: 6 })}
        </Td>

        <Td>{(100 / params.borrowablePercent).toPrecision(4)} %</Td>
        <Td>{collateral.format()}</Td>
        <Td> {debt.format()} debt </Td>
      </Tr>
      <Td colspan="7">
        <Center>
          <Wrap justify="center">
            <EditTranche
              {...{ ...params, collateral: collateral, debt: debt }}
            />
          </Wrap>
        </Center>
      </Td>
    </>
  );
}
