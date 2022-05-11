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
import { LiquidatableAction } from './LiquidatablePositionsTable';
import { TransactionErrorDialog } from '../../components/notifications/TransactionErrorDialog';
import { formatEther, formatUnits } from 'ethers/lib/utils';

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
    const extantCollateral = params.collateral!.value;
    const extantCollateralValue = params.collateralValue.value;

    const ltvPer10k = params.borrowablePercent * 100;

    const debt = params.debt.value;

    if (debt.gt(extantCollateralValue.mul(85).div(100))) {
      sendLiquidation(params.trancheId, extantCollateral, debt, account!);
    } else {
      const requestedColVal =
        debt
          .add(debt
            .mul(10000)
            .sub(extantCollateralValue.mul(ltvPer10k))
            .div(10000 - ltvPer10k)
          )
          .div(2);

      const collateralRequested =
        extantCollateral.mul(requestedColVal).div(extantCollateralValue);

      const bidTarget = await viewBidTarget(
        params.trancheId,
        lendingAddress,
        requestedColVal,
        BigNumber.from(0)
      );

      const rebalancingBid = bidTarget.mul(1000).div(984);
      console.log(
        'rebalancingBid',
        formatEther(requestedColVal),
        formatUnits(collateralRequested, params.token.decimals),
        formatEther(rebalancingBid)
      );
      sendLiquidation(
        params.trancheId,
        collateralRequested,
        rebalancingBid,
        account!
      );
    }
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
