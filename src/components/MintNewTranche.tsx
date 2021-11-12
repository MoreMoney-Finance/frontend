import { Button, Grid, GridItem } from '@chakra-ui/react';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import React from 'react';
import { ParsedStratMetaRow, TxStatus } from '../chain-interaction/contracts';
import { useApproveTrans } from '../chain-interaction/transactions';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import DepositBorrowForm from './DepositBorrowForm';
import { StrategyDataTable } from './StrategyDataTable';

export function MintNewTranche(params: ParsedStratMetaRow) {
  const { token, strategyAddress, debtCeiling, strategyName } = params;

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
  console.log(`wallet balance for ${token.name}: ${walletBalance.format()}`);

  const { approveState, sendApprove } = useApproveTrans(token.address);

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={1}>
          <StrategyDataTable {...params} />
        </GridItem>
        <GridItem colSpan={1}>
          {allowance.gt(walletBalance) === false ? (
            <Button
              onClick={() => sendApprove(strategyAddress)}
              isLoading={
                approveState.status == TxStatus.SUCCESS &&
                allowance.gt(walletBalance) === false
              }
            >
              Approve {strategyName} for {token.name}{' '}
            </Button>
          ) : (
            <DepositBorrowForm trancheId={undefined} {...params} />
          )}
        </GridItem>
      </Grid>
    </>
  );
}
