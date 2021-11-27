import { useForm } from 'react-hook-form';
import { Button, HStack, Text } from '@chakra-ui/react';
import { TokenAmountInputField } from './TokenAmountInputField';
import React from 'react';
import { useDepositBorrowTrans } from '../chain-interaction/transactions';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../chain-interaction/contracts';

export default function DepositBorrowForm(
  params: React.PropsWithChildren<
    ParsedStratMetaRow | (ParsedStratMetaRow & ParsedPositionMetaRow)
  >
) {
  const { token, strategyAddress, borrowablePercent, usdPrice } = params;

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  const { sendDepositBorrow /*depositBorrowState*/ } = useDepositBorrowTrans(
    'trancheId' in params ? params.trancheId : undefined
  );
  const { account } = useEthers();
  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, strategyAddress) ??
    BigNumber.from('0')
  );
  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  const depositMax = allowance.gt(walletBalance) ? walletBalance : allowance;

  function onDepositBorrow(data: { [x: string]: any; }) {
    console.log('deposit borrow');
    console.log(data);

    sendDepositBorrow(
      token,
      strategyAddress,
      data['collateral-deposit'],
      data['money-borrow']
    );
  }
  const depositBorrowDisabled = depositMax.isZero();

  const [collateralInput, borrowInput] = watch([
    'collateral-deposit',
    'money-borrow',
  ]);

  const extantCollateral = 'collateral' in params && params.collateral
    ? parseFloat(
      params.collateral.format({
        significantDigits: Infinity,
        prefix: '',
        suffix: '',
      })
    )
    : 0;
  const totalCollateral = parseFloat(collateralInput) + extantCollateral;

  const extantDebt = 'debt' in params && params.debt
    ? parseFloat(
      params.debt.format({
        significantDigits: Infinity,
        prefix: '',
        suffix: '',
      })
    )
    : 0;
  const totalDebt = parseFloat(borrowInput) + extantDebt;

  console.log('extant, totals:' , extantCollateral, totalCollateral, extantDebt, totalDebt);
  const currentPercentage = totalCollateral > 0 ? 100 * extantDebt / totalCollateral : 0;
  console.log('currentPercentage', currentPercentage);
  const percentageRange = borrowablePercent - currentPercentage;
  console.log('percentageRange', percentageRange);
  const percentageStep = Math.max(percentageRange / 5, 10);
  const percentageSteps = 10 >= percentageRange
    ? [(currentPercentage + borrowablePercent) / 2]
    : Array(Math.floor((percentageRange - 0.5) / percentageStep))
      .fill(currentPercentage)
      .map((p, i) => p + (i + 1) * percentageStep);


  const percentages: { label: string; values: Record<string, number>; } = {
    label:
      totalCollateral > 0
        ? `${(100 * totalDebt / totalCollateral).toFixed(0)} %`
        : 'LTV %',
    values: Object.fromEntries(
      percentageSteps.map((percentage) => [
        `${percentage.toFixed(0)} %`,
        (percentage * totalCollateral * usdPrice) / 100 - extantDebt,
      ])
    ),
  };

  return (
    <form onSubmit={handleSubmitDepForm(onDepositBorrow)}>
      <HStack spacing="0.5rem" margin="0.5rem">
        <TokenAmountInputField
          name="collateral-deposit"
          max={depositMax}
          isDisabled={depositBorrowDisabled}
          placeholder={'Collateral Deposit'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
        />

        <TokenAmountInputField
          name="money-borrow"
          isDisabled={depositBorrowDisabled}
          placeholder={'MONEY borrow'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
          percentages={percentages}
        />

        <Button
          type="submit"
          isLoading={isSubmittingDepForm}
          isDisabled={depositBorrowDisabled}
          width="22rem"
        >
          <Text>Deposit &amp; Borrow</Text>
        </Button>
      </HStack>
    </form>
  );
}
