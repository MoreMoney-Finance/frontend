import { useForm } from 'react-hook-form';
import { Button, HStack } from '@chakra-ui/react';
import { TokenAmountInputField } from './TokenAmountInputField';
import React from 'react';
import { useRepayWithdrawTrans } from '../chain-interaction/transactions';
import { CurrencyValue, Token } from '@usedapp/core';

export default function RepayWithdrawForm(params: {
  token: Token;
  trancheId: number;
  collateralBalance: CurrencyValue;
  debtBalance: CurrencyValue;
}) {
  const { token, trancheId, collateralBalance, debtBalance } = params;

  const {
    handleSubmit: handleSubmitRepayForm,
    register: registerRepayForm,
    setValue: setValueRepayForm,
    formState: { errors: errorsRepayForm, isSubmitting: isSubmittingRepayForm },
  } = useForm();

  const { sendRepayWithdraw } = useRepayWithdrawTrans(trancheId, token);

  function onRepayWithdraw(data: { [x: string]: any }) {
    console.log('repay withdraw');
    console.log(data);

    sendRepayWithdraw(data['collateral-withdraw'], data['money-repay']);
  }

  const repayWithdrawDisabled =
    collateralBalance.isZero() && debtBalance.isZero();

  return (
    <form onSubmit={handleSubmitRepayForm(onRepayWithdraw)}>
      <HStack spacing="0.5rem">
        <TokenAmountInputField
          name="collateral-withdraw"
          max={collateralBalance}
          isDisabled={repayWithdrawDisabled}
          placeholder={'Collateral withdraw'}
          registerForm={registerRepayForm}
          setValueForm={setValueRepayForm}
          errorsForm={errorsRepayForm}
        />

        <TokenAmountInputField
          name="money-repay"
          max={debtBalance}
          isDisabled={repayWithdrawDisabled}
          placeholder={'MONEY repay'}
          registerForm={registerRepayForm}
          setValueForm={setValueRepayForm}
          errorsForm={errorsRepayForm}
        />

        <Button
          type="submit"
          isLoading={isSubmittingRepayForm}
          isDisabled={repayWithdrawDisabled}
          width="22rem"
        >
          Repay &amp; Withdraw
        </Button>
      </HStack>
    </form>
  );
}
