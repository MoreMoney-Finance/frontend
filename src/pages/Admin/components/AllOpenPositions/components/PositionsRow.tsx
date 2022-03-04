import { Button, Td, Text, Tr } from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
} from '../../../../../chain-interaction/contracts';
import { TokenDescription } from '../../../../../components/tokens/TokenDescription';
import CopyClipboard from '../../CopyClipboard/CopyClipboard';
import { LiquidatableAction } from './PositionsTable';

export function PositionsRow(
  params: React.PropsWithChildren<
    ParsedStratMetaRow & ParsedPositionMetaRow & { action?: LiquidatableAction }
  >
) {
  const { token, action, liquidateButton } = params;

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

  return (
    <Tr key={`${params.trancheId}`}>
      <Td>
        <Link to={`/token/${params.token.address}?account=${params.owner}`}>
          View
        </Link>
      </Td>
      {/* <Td>
          <Text
            color={
              positionHealthColor == 'accent'
                ? 'accent_color'
                : positionHealthColor
            }
          >
            {parsedPositionHealth ?? ''}
          </Text>
        </Td> */}
      <Td>
        <TokenDescription token={token} />
      </Td>
      <Td>
        <CopyClipboard
          value={params.trancheId.toString()}
          label={params.trancheId.toString()}
        />
      </Td>

      <Td>{((1 / (params.borrowablePercent / 100)) * 100).toFixed(2) + '%'}</Td>

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
    </Tr>
  );
}
