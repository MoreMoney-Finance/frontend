import { useForm } from 'react-hook-form';
import { Button, HStack } from '@chakra-ui/react';
import { TokenAmountInputField } from './TokenAmountInputField';
import React from 'react';
import { useRepayWithdrawTrans } from '../chain-interaction/transactions';
import { CurrencyValue, Token } from '@usedapp/core';
import { StatusTrackModal } from './StatusTrackModal';

export default function RepayWithdrawForm(params: {
  token: Token;
  trancheId: number;
  collateral: CurrencyValue;
  debt: CurrencyValue;
}) {
  const { token, trancheId, collateral, debt } = params;

  const {
    handleSubmit: handleSubmitRepayForm,
    register: registerRepayForm,
    setValue: setValueRepayForm,
    formState: { errors: errorsRepayForm, isSubmitting: isSubmittingRepayForm },
  } = useForm();

  const { sendRepayWithdraw, repayWithdrawState } = useRepayWithdrawTrans(
    trancheId,
    token
  );

  function onRepayWithdraw(data: { [x: string]: any }) {
    console.log('repay withdraw');
    console.log(data);

    sendRepayWithdraw(data['collateral-withdraw'], data['money-repay']);
  }

  const repayWithdrawDisabled = collateral.isZero() && debt.isZero();

  return (
    <>
      <StatusTrackModal state={repayWithdrawState} title={'Repay | Withdraw'} />
      <form onSubmit={handleSubmitRepayForm(onRepayWithdraw)}>
        <HStack spacing="0.5rem" margin="0.5rem">
          <TokenAmountInputField
            name="collateral-withdraw"
            max={collateral}
            isDisabled={repayWithdrawDisabled}
            placeholder={'Collateral withdraw'}
            registerForm={registerRepayForm}
            setValueForm={setValueRepayForm}
            errorsForm={errorsRepayForm}
          />

          <TokenAmountInputField
            name="money-repay"
            max={debt}
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
    </>
  );
}
