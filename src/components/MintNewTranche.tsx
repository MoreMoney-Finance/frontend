import { Button, VStack } from '@chakra-ui/react';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import { ParsedStratMetaRow, TxStatus } from '../chain-interaction/contracts';
import { useApproveTrans } from '../chain-interaction/transactions';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import DepositBorrowForm from './DepositBorrowForm';
import { EnsureWalletConnected } from './EnsureWalletConnected';
import { StrategyDataTable } from './StrategyDataTable';

export function MintNewTranche(params: ParsedStratMetaRow) {
  const { token, strategyAddress, strategyName } = params;

  const { account } = useEthers();

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, strategyAddress) ??
      BigNumber.from('0')
  );

  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));
  console.log(
    `wallet balance for ${token.name}: ${walletBalance.format({
      significantDigits: Infinity,
    })}`
  );
  const { approveState, sendApprove } = useApproveTrans(token.address);

  return (
    <VStack>
      {allowance.gt(walletBalance) === false ? (
        <EnsureWalletConnected>
          <Button
            onClick={() => sendApprove(strategyAddress)}
            isLoading={
              approveState.status == TxStatus.SUCCESS &&
              allowance.gt(walletBalance) === false
            }
          >
            Approve {strategyName} strategy
          </Button>
        </EnsureWalletConnected>
      ) : (
        <DepositBorrowForm Stacking={VStack} {...params} />
      )}
      <StrategyDataTable {...params} />
    </VStack>
  );
}
