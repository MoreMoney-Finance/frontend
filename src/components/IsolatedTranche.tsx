import { Button } from '@chakra-ui/react';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
} from '../chain-interaction/contracts';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import { useApproveTrans } from '../chain-interaction/transactions';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import DepositBorrowForm from './DepositBorrowForm';
import RepayWithdrawForm from './RepayWithdrawForm';
import { Tr, Td, Center, HStack } from '@chakra-ui/react';
import { TokenDescription } from './TokenDescription';

export function IsolatedTranche(
  params: React.PropsWithChildren<ParsedStratMetaRow & ParsedPositionMetaRow>
) {
  const { token, APY, strategyName, strategyAddress, debtCeiling } = params;
  const { account } = useEthers();

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, strategyAddress) ??
      BigNumber.from('0')
  );

  console.log(`allowance for ${token.name}: ${allowance.format()}`);
  console.log(`debt ceiling for ${token.name}: ${debtCeiling.format()}`);

  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));
  console.log(
    `wallet balance for ${token.name}: ${walletBalance.format({
      significantDigits: 30,
    })} (${token.address})`
  );

  const { approveState, sendApprove } = useApproveTrans(token.address);

  const collateralBalance =
    'collateral' in params && params.collateral
      ? parseFloat(params.collateral.format({ significantDigits: 30 }))
      : 0;
  const debtBalance =
    'debt' in params
      ? parseFloat(params.debt.format({ significantDigits: 30 }))
      : 0;

  return (
    <>
      <Tr>
        <Td>
          <TokenDescription token={token} />
        </Td>
        <Td>{strategyName}</Td>
        <Td>{APY.toPrecision(4)} % APY</Td>
        <Td>
          {params.debtCeiling
            .sub(params.totalDebt)
            .format({ significantDigits: 6 })}
        </Td>

        <Td>{(100 / params.borrowablePercent).toPrecision(4)} %</Td>
        <Td>
          {collateralBalance.toPrecision(4)} {token.ticker}
        </Td>
        <Td> {debtBalance.toPrecision(4)} debt </Td>
      </Tr>
      <Td colspan="7">
        <Center>
          <HStack>
            {allowance.gt(walletBalance) === false ? (
              <Button
                onClick={() => sendApprove(strategyAddress)}
                isLoading={
                  approveState.status == TxStatus.SUCCESS &&
                  allowance.gt(walletBalance) === false
                }
              >
                Approve {token.name}{' '}
              </Button>
            ) : (
              <DepositBorrowForm {...params} />
            )}
            <RepayWithdrawForm
              collateralBalance={collateralBalance}
              debtBalance={debtBalance}
              {...params}
            />
          </HStack>
        </Center>
      </Td>
    </>
  );
}
