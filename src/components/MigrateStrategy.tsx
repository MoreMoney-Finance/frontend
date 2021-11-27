import { Button, VStack } from '@chakra-ui/react';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
  useStable,
} from '../chain-interaction/contracts';
import {
  useApproveTrans,
  useMigrateStrategy,
} from '../chain-interaction/transactions';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import DepositBorrowForm from './DepositBorrowForm';
import { StrategyDataTable } from './StrategyDataTable';

export function MigrateStrategy(
  params: ParsedStratMetaRow,
  position: ParsedPositionMetaRow
) {
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

  const stable = useStable();
  const { sendMigrateStrategy, migrateStrategyState } = useMigrateStrategy();
  const { approveState, sendApprove } = useApproveTrans(token.address);

  console.log('MigrateStrategy');
  return (
    <VStack>
      {allowance.gt(walletBalance) === false ? (
        <Button
          onClick={() => sendApprove(strategyAddress)}
          isLoading={
            approveState.status == TxStatus.SUCCESS &&
            allowance.gt(walletBalance) === false
          }
        >
          Approve {strategyName} to withdraw {token.name}{' '}
        </Button>
      ) : (
        <DepositBorrowForm {...params} />
      )}
      <Button
        onClick={() =>
          sendMigrateStrategy(
            position.trancheId,
            strategyAddress,
            stable,
            account!
          )
        }
        isLoading={
          migrateStrategyState.status == TxStatus.SUCCESS &&
          allowance.gt(walletBalance) === false
        }
      >
        Migrate to this strategy
      </Button>
      <StrategyDataTable {...params} />
    </VStack>
  );
}
