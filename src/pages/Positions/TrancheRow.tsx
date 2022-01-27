import { Button, Td, Text, Tr } from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
  YieldType,
} from '../../chain-interaction/contracts';
import { TokenDescription } from '../../components/tokens/TokenDescription';
import { parseFloatNoNaN } from '../../utils';
import { TrancheAction } from './TrancheTable';

export function TrancheRow(
  params: React.PropsWithChildren<
    ParsedStratMetaRow & ParsedPositionMetaRow & { action?: TrancheAction }
  >
) {
  const {
    token,
    APY,
    action,
    borrowablePercent,
    totalCollateral,
    totalDebt,
    usdPrice,
  } = params;

  // const location = useLocation();
  // const details = location.search?.includes('details=true');

  // console.log('details', details);

  const actionArgs =
    action && action.args ? action.args : () => ({} as Record<string, any>);

  const stable = useStable();

  // const walletBalance =
  //   useWalletBalance(token.address) ??
  //   new CurrencyValue(token, BigNumber.from('0'));
  // console.log(
  //   `wallet balance for ${token.name}: ${walletBalance.format({
  //     significantDigits: 30,
  //   })} (${token.address})`
  // );

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
  const totalPercentage =
    parseFloatNoNaN(totalCollateral.toString()) > 0 && usdPrice > 0
      ? (100 * parseFloatNoNaN(totalDebt.toString())) /
        (parseFloatNoNaN(totalCollateral.toString()) * usdPrice)
      : 0;
  const liquidatableZone = borrowablePercent;
  const criticalZone = (90 * borrowablePercent) / 100;
  const riskyZone = (80 * borrowablePercent) / 100;
  const healthyZone = (50 * borrowablePercent) / 100;
  const positionHealthColor =
    totalPercentage > liquidatableZone
      ? 'button'
      : totalPercentage > criticalZone
        ? 'red'
        : totalPercentage > riskyZone
          ? 'orange'
          : totalPercentage > healthyZone
            ? 'green'
            : 'accent';
  const positionHealth = {
    accent: 'Safe',
    green: 'Healthy',
    orange: 'Risky',
    red: 'Critical',
    button: 'Liquidatable',
  };

  return (
    <>
      <Tr
        key={`${params.trancheId}`}
        as={Link}
        to={`/token/${params.token.address}`}
        display="table-row"
      >
        <Td>
          <Text
            color={
              positionHealthColor == 'accent'
                ? 'accent_color'
                : positionHealthColor
            }
          >
            {positionHealth[positionHealthColor]}
          </Text>
        </Td>
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
