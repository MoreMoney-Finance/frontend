import { Box, Flex, Text, Grid, Button } from '@chakra-ui/react';
import {
  CurrencyValue,
  useEthers,
  useTokenAllowance,
  useTokenBalance,
} from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
  calcLiqPriceFromNum,
} from '../../chain-interaction/contracts';
import {
  useApproveTrans,
  useDepositBorrowTrans,
  useNativeDepositBorrowTrans,
} from '../../chain-interaction/transactions';
import { WNATIVE_ADDRESS } from '../../constants/addresses';
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
  const { chainId, account } = useEthers();

  const isNativeToken = WNATIVE_ADDRESS[chainId!] === token.address;

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, strategyAddress) ??
      BigNumber.from('0')
  );

  const nativeTokenBalance = new CurrencyValue(
    token,
    BigNumber.from(useTokenBalance(token.address, account)) ?? BigNumber.from('0')
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
  const {
    sendDepositBorrow: sendNativeDepositBorrow,
    depositBorrowState: nativeDepositBorrowState,
  } = useNativeDepositBorrowTrans(position ? position.trancheId : undefined);

  function onDepositBorrow(data: { [x: string]: any }) {
    console.log('deposit borrow');
    console.log(data);
    if (isNativeToken) {
      sendNativeDepositBorrow(
        token,
        strategyAddress,
        data['collateral-deposit'],
        data['money-borrow']
      );
    } else {
      sendDepositBorrow(
        token,
        strategyAddress,
        data['collateral-deposit'],
        data['money-borrow']
      );
    }
  }
  const depositBorrowDisabled = walletBalance.isZero();

  const [collateralInput, borrowInput] = watch([
    'collateral-deposit',
    'money-borrow',
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
          max={isNativeToken ? nativeTokenBalance : walletBalance}
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
          name="money-borrow"
          isDisabled={depositBorrowDisabled}
          placeholder={'MONEY borrow'}
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
              onClick={() => setValueDepForm('money-borrow', value.toFixed(10))}
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
          <Text fontSize="md"></Text>
        </Box>
        <Box textAlign={'center'}>
          <Text fontSize="sm" color={'gray'}>
            Expected Liquidation Price
          </Text>
          <Text fontSize="md">
            ${' '}
            {calcLiqPriceFromNum(
              borrowablePercent,
              totalDebt,
              totalCollateral
            ).toFixed(2)}
          </Text>
        </Box>
        <Box textAlign={'center'}>
          <Text fontSize="sm" color={'gray'}>
            cRatio
          </Text>
          <Text fontSize="md">
            {totalDebt > 0.1 ? (totalCollateral / totalDebt).toFixed(2) : '∞'}
          </Text>
        </Box>
      </Grid>
      <br />
      <Flex>
        <Text fontSize={'sm'}>Price:</Text>
        <Text fontSize={'sm'}>{`1 ${token.ticker} = $ ${usdPrice.toFixed(
          2
        )}`}</Text>
      </Flex>
      <StatusTrackModal state={approveState} title={'Approve'} />
      <StatusTrackModal state={depositBorrowState} title={'Deposit Borrow'} />
      <StatusTrackModal
        state={nativeDepositBorrowState}
        title={'Deposit Borrow'}
      />

      {allowance.gt(walletBalance) === false && isNativeToken === false ? (
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
