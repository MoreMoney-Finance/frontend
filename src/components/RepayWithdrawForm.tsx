import { useForm } from 'react-hook-form';
import { Button, VStack } from '@chakra-ui/react';
import { TokenAmountInputField } from './TokenAmountInputField';
import React from 'react';
import { useRepayWithdrawTrans } from '../chain-interaction/transactions';

export default function DepositBorrowForm(params: any) {
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

    sendRepayWithdraw(data['collateral-withdraw'], data['usdm-repay']);
  }

  const repayWithdrawDisabled = collateralBalance === 0 || debtBalance === 0;

  return (
    <form onSubmit={handleSubmitRepayForm(onRepayWithdraw)}>
      <VStack spacing="0.5rem">
        <TokenAmountInputField
          name="collateral-withdraw"
          min={0}
          max={collateralBalance}
          isDisabled={repayWithdrawDisabled}
          showMaxButton={true}
          placeholder={'Collateral withdraw'}
          registerForm={registerRepayForm}
          setValueForm={setValueRepayForm}
          errorsForm={errorsRepayForm}
        />

        <TokenAmountInputField
          name="usdm-repay"
          min={0}
          max={debtBalance}
          isDisabled={repayWithdrawDisabled}
          placeholder={'USDm repay'}
          registerForm={registerRepayForm}
          setValueForm={setValueRepayForm}
          errorsForm={errorsRepayForm}
        />

        <Button
          type="submit"
          isLoading={isSubmittingRepayForm}
          isDisabled={repayWithdrawDisabled}
        >
          Repay &amp; Withdraw
        </Button>
      </VStack>
    </form>
  );
}
