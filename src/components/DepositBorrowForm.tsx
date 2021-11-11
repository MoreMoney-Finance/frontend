import { useForm } from 'react-hook-form';
import { Button, VStack } from '@chakra-ui/react';
import { TokenAmountInputField } from './TokenAmountInputField';
import React from 'react';
import { useDepositBorrowTrans } from '../chain-interaction/transactions';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { useWalletBalance } from '../contexts/WalletBalancesContext';

export default function DepositBorrowForm(params: any) {
  const { token, strategyAddress, trancheId } = params;

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
  } = useForm();

  const { sendDepositBorrow /*depositBorrowState*/ } =
    useDepositBorrowTrans(trancheId);
  const { account } = useEthers();
  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, strategyAddress) ??
      BigNumber.from('0')
  );
  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  const depositMax = parseFloat(
    (allowance.gt(walletBalance) ? walletBalance : allowance).format()
  );

  function onDepositBorrow(data: { [x: string]: any }) {
    console.log('deposit borrow');
    console.log(data);

    sendDepositBorrow(
      token,
      strategyAddress,
      data['collateral-deposit'],
      data['usdm-borrow']
    );
  }
  const depositBorrowDisabled = depositMax === 0;

  return (
    <form onSubmit={handleSubmitDepForm(onDepositBorrow)}>
      <VStack spacing="0.5rem">
        <TokenAmountInputField
          name="collateral-deposit"
          min={0}
          max={depositMax}
          isDisabled={depositBorrowDisabled}
          showMaxButton={true}
          placeholder={'Collateral Deposit'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
        />

        <TokenAmountInputField
          name="usdm-borrow"
          min={0}
          isDisabled={depositBorrowDisabled}
          placeholder={'USDm borrow'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
        />

        <Button
          type="submit"
          isLoading={isSubmittingDepForm}
          isDisabled={depositBorrowDisabled}
        >
          Deposit &amp; Borrow
        </Button>
      </VStack>
    </form>
  );
}
