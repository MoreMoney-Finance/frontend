import { Box, Flex, Text, Grid, Button } from '@chakra-ui/react';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
} from '../../chain-interaction/contracts';
import {
  useApproveTrans,
  useDepositBorrowTrans,
} from '../../chain-interaction/transactions';
import { useWalletBalance } from '../../contexts/WalletBalancesContext';
import { EnsureWalletConnected } from '../EnsureWalletConnected';
import { StatusTrackModal } from '../StatusTrackModal';
import { TokenAmountInputField } from '../TokenAmountInputField';

export default function DepositBorrow({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { token, strategyAddress, borrowablePercent, usdPrice } = stratMeta;
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

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  const { sendDepositBorrow, depositBorrowState } = useDepositBorrowTrans(
    position ? position.trancheId : undefined
  );

  function onDepositBorrow(data: { [x: string]: any }) {
    console.log('deposit borrow');
    console.log(data);

    sendDepositBorrow(
      token,
      strategyAddress,
      data['collateral-deposit'],
      data['mny-borrow']
    );
  }
  const depositBorrowDisabled = walletBalance.isZero();

  const [collateralInput, borrowInput] = watch([
    'collateral-deposit',
    'mny-borrow',
  ]);

  const extantCollateral =
    position && position.collateral
      ? parseFloat(
        position.collateral.format({
          significantDigits: Infinity,
          prefix: '',
          suffix: '',
        })
      )
      : 0;
  const totalCollateral = parseFloat(collateralInput) + extantCollateral;

  const extantDebt =
    position && position.debt
      ? parseFloat(
        position.debt.format({
          significantDigits: Infinity,
          prefix: '',
          suffix: '',
        })
      )
      : 0;
  const totalDebt = parseFloat(borrowInput) + extantDebt;

  const currentPercentage =
    totalCollateral > 0 ? (100 * extantDebt) / (totalCollateral * usdPrice) : 0;
  const percentageRange = borrowablePercent - currentPercentage;

  const percentageStep = Math.max(percentageRange / 5, 10);
  const percentageSteps =
    10 >= percentageRange
      ? [(currentPercentage + borrowablePercent) / 2]
      : Array(Math.floor((percentageRange - 0.5) / percentageStep))
        .fill(currentPercentage)
        .map((p, i) => p + (i + 1) * percentageStep);

  const totalPercentage =
    totalCollateral > 0 ? (100 * totalDebt) / (totalCollateral * usdPrice) : 0;

  const percentageLabel =
    totalCollateral > 0 ? `${totalPercentage.toFixed(0)} %` : 'LTV %';
  const percentages = Object.fromEntries(
    percentageSteps.map((percentage) => [
      `${percentage.toFixed(0)} %`,
      (percentage * totalCollateral * usdPrice) / 100 - extantDebt,
    ])
  );

  return (
    <form onSubmit={handleSubmitDepForm(onDepositBorrow)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'}>
          <Text fontSize={'sm'}>Deposit Collateral</Text>
        </Box>

        <TokenAmountInputField
          name="collateral-deposit"
          max={walletBalance}
          isDisabled={depositBorrowDisabled}
          placeholder={'Collateral Deposit'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
        />
      </Flex>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'}>
          <Text fontSize={'sm'}>Borrow MONEY</Text>
        </Box>

        <TokenAmountInputField
          name="mny-borrow"
          isDisabled={depositBorrowDisabled}
          placeholder={'MNY borrow'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
          percentage={percentageLabel}
        />
      </Flex>
      <br />
      <Grid
        templateColumns={`repeat(${
          percentages ? Object.values(percentages).length : 0
        }, 1fr)`}
        gap={2}
        w={'full'}
      >
        {percentages &&
          Object.entries(percentages).map(([key, value]) => (
            <Button
              borderRadius={'xl'}
              key={'percentage' + key}
              onClick={() => setValueDepForm('mny-borrow', value.toFixed(10))}
            >
              {key}
            </Button>
          ))}
      </Grid>
      <br />
      <Grid templateColumns="repeat(3, 1fr)" gap={2} w={'full'}>
        <Box textAlign={'center'}>
          <Text fontSize="sm" color={'gray'}>
            Amount
          </Text>
          <Text fontSize="md"> -$0.00</Text>
        </Box>
        <Box textAlign={'center'}>
          <Text fontSize="sm" color={'gray'}>
            Expected Liquidation Price
          </Text>
          <Text fontSize="md"> -$0.00</Text>
        </Box>
        <Box textAlign={'center'}>
          <Text fontSize="sm" color={'gray'}>
            cRatio
          </Text>
          <Text fontSize="md"> -100.00%</Text>
        </Box>
      </Grid>
      <br />
      <Flex>
        <Text fontSize={'sm'}>Price:</Text>
        <Text fontSize={'sm'}>1 WAVAX-WETHe= $2000</Text>
      </Flex>
      <StatusTrackModal state={approveState} title={'Approve'} />
      <StatusTrackModal state={depositBorrowState} title={'Deposit Borrow'} />

      {allowance.gt(walletBalance) === false ? (
        <EnsureWalletConnected>
          <Button
            onClick={() => sendApprove(strategyAddress)}
            isLoading={
              approveState.status == TxStatus.SUCCESS &&
              allowance.gt(walletBalance) === false
            }
          >
            Approve {token.name}{' '}
          </Button>
        </EnsureWalletConnected>
      ) : (
        <Button
          w={'full'}
          type="submit"
          disabled={depositBorrowDisabled}
          isLoading={isSubmittingDepForm}
          isDisabled={depositBorrowDisabled}
        >
          Deposit & Borrow
        </Button>
      )}
    </form>
  );
}
