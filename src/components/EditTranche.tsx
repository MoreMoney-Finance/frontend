import * as React from 'react';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
} from '../chain-interaction/contracts';
import { useApproveTrans } from '../chain-interaction/transactions';
import { Button, HStack } from '@chakra-ui/react';
import DepositBorrowForm from './DepositBorrowForm';
import RepayWithdrawForm from './RepayWithdrawForm';

export function EditTranche(
  params: React.PropsWithChildren<
    ParsedStratMetaRow &
      ParsedPositionMetaRow & { collateral: CurrencyValue; debt: CurrencyValue }
  >
) {
  const { token, strategyAddress } = params;
  const { account } = useEthers();

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, strategyAddress) ??
      BigNumber.from('0')
  );

  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  const { approveState, sendApprove } = useApproveTrans(token.address);

  return (
    <>
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
        <DepositBorrowForm Stacking={HStack} {...params} />
      )}
      <RepayWithdrawForm {...params} />
    </>
  );
}
