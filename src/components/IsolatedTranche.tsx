import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
  YieldType,
} from '../chain-interaction/contracts';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { Tr, Td, Button, Text } from '@chakra-ui/react';
import { TokenDescription } from './TokenDescription';
import { TrancheAction } from './TrancheTable';
import { Link, useLocation } from 'react-router-dom';

export function IsolatedTranche(
  params: React.PropsWithChildren<
    ParsedStratMetaRow & ParsedPositionMetaRow & { action?: TrancheAction }
  >
) {
  const { token, APY, action } = params;

  const location = useLocation();
  const details = location.search?.includes('details=true');

  console.log('details', details);

  const actionArgs =
    action && action.args ? action.args : () => ({} as Record<string, any>);

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
    'debt' in params && params.debt.gt(params.yield)
      ? params.debt.sub(params.yield)
      : new CurrencyValue(stable, BigNumber.from(0));

  const stratLabel =
    params.yieldType === YieldType.REPAYING ? 'Self-repaying' : 'Compounding';

  return (
    <>
      <Tr
        key={`${params.trancheId}`}
        as={Link}
        to={`/token/${params.token.address}`}
        display="table-row"
      >
        <Td>
          <TokenDescription token={token} />
        </Td>

        <Td>{stratLabel}</Td>

        <Td>{APY.toFixed(2)}%</Td>

        <Td>{((100 * 100) / params.borrowablePercent).toFixed(0)}%</Td>

        <Td>
          {debt.isZero()
            ? '∞'
            : (
              params.collateralValue.value
                .mul(10000)
                .div(debt.value)
                .toNumber() / 100
            ).toFixed(1)}
          %
        </Td>

        <Td>
          <Text isTruncated>$ {params.liquidationPrice.toFixed(2)}</Text>
        </Td>

        <Td>
          {collateral.format({
            significantDigits: Infinity,
            suffix: '',
          })}
        </Td>

        <Td>
          {debt.format({
            significantDigits: 3,
            suffix: '',
          })}
        </Td>

        {action ? (
          <Td>
            <Button
              {...(action.callback
                ? {
                  ...actionArgs(params),
                  onClick: () => action.callback!(params),
                }
                : actionArgs(params))}
            >
              {action.label}
            </Button>
          </Td>
        ) : undefined}
      </Tr>
    </>
  );
}
