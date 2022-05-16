import { Button, Td, Text, Tr } from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useAddresses,
  useStable,
} from '../../chain-interaction/contracts';
import {
  usePrimitiveLiquidationTrans,
  viewBidTarget,
} from '../../chain-interaction/transactions';
import { TokenDescription } from '../../components/tokens/TokenDescription';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { parseFloatCurrencyValue } from '../../utils';
import { LiquidatableAction } from './LiquidatablePositionsTable';
import { TransactionErrorDialog } from '../../components/notifications/TransactionErrorDialog';

export function LiquidatableRow(
  params: React.PropsWithChildren<
    ParsedStratMetaRow & ParsedPositionMetaRow & { action?: LiquidatableAction }
  >
) {
  const {
    token,
    action,
    liquidateButton,
    positionHealthColor,
    parsedPositionHealth,
  } = params;

  const addresses = useAddresses();
  const account = React.useContext(UserAddressContext);
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

  const { sendLiquidation, liquidationState } = usePrimitiveLiquidationTrans(
    params.trancheContract
  );

  const collateral =
    'collateral' in params && params.collateral
      ? params.collateral
      : new CurrencyValue(token, BigNumber.from(0));
  const debt =
    'debt' in params && params.debt.gt(params.yield)
      ? params.debt.sub(params.yield)
      : new CurrencyValue(stable, BigNumber.from(0));

  // console.log(
  //   'liquidatable',
  //   params.trancheId,
  //   params.debt.format(),
  //   params.collateral?.toString(),
  //   params.collateral?.format(),
  //   parsedPositionHealth,
  //   sendLiquidation,
  //   liquidationState
  // );

  const primitiveLiquidate = async () => {
    const lendingAddress =
      params.trancheContract === addresses.IsolatedLending
        ? addresses.IsolatedLendingLiquidation
        : addresses.StableLendingLiquidation;
    const extantCollateral = parseFloatCurrencyValue(params.collateral!);
    const extantCollateralValue = parseFloatCurrencyValue(
      params.collateralValue
    );
    const ltvPer10k = params.borrowablePercent * 100;

    const debt = parseFloatCurrencyValue(params.debt);

    const requestedColVal =
      (debt +
        (10000 * debt - ltvPer10k * extantCollateralValue) /
          (10000 - ltvPer10k)) /
      2;

    const collateralRequested =
      (extantCollateral * requestedColVal) / extantCollateralValue;

    const bidTarget = await viewBidTarget(
      params.trancheId,
      lendingAddress,
      requestedColVal.toString(),
      0
    );

    const rebalancingBid = (1000 * bidTarget) / 984;
    console.log(
      'rebalancingBid',
      requestedColVal,
      collateralRequested,
      rebalancingBid
    );
    sendLiquidation(
      params.trancheId,
      collateralRequested.toString(),
      rebalancingBid.toString(),
      account!
    );
  };

  return (
    <>
      <Tr key={`${params.trancheId}`}>
        <Td>
          <Text
            color={
              positionHealthColor == 'accent'
                ? 'accent_color'
                : positionHealthColor
            }
          >
            {parsedPositionHealth ?? ''}
          </Text>
        </Td>
        <Td>
          <TokenDescription token={token} />
        </Td>

        <Td>
          {((1 / (params.borrowablePercent / 100)) * 100).toFixed(2) + '%'}
        </Td>

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

        <Td>
          {liquidateButton ? (
            <Button
              {...(action?.callback
                ? {
                  ...actionArgs(params),
                  onClick: () => action.callback!(params),
                }
                : actionArgs(params))}
            >
              Liquidate
            </Button>
          ) : (
            <Text>Not Liquidatable Yet</Text>
          )}
        </Td>
        <Td>
          {liquidateButton ? (
            <>
              <TransactionErrorDialog
                title="Primitive Liquidate"
                state={liquidationState}
              />
              <Button onClick={primitiveLiquidate}>Liquidate</Button>
            </>
          ) : (
            <Text>Not Liquidatable Yet</Text>
          )}
        </Td>
      </Tr>
    </>
  );
}
