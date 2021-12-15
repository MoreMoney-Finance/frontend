import { Box, Flex, Text, Button, VStack, HStack } from '@chakra-ui/react';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
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
      data['money-borrow']
    );
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

  const inputStyle = {
    padding: '8px 8px 8px 20px',
    bg: 'brand.whiteAlpha050',
    borderRadius: '10px',
    justifyContent: 'space-between',
  };

  return (
    <form onSubmit={handleSubmitDepForm(onDepositBorrow)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'brand.whiteAlpha60'}
            lineHeight={'14px'}
          >
            Deposit Collateral
          </Text>
        </Box>
        <HStack {...inputStyle}>
          <Text>PGL-WAVAX-WETHe</Text>
          <TokenAmountInputField
            name="collateral-deposit"
            max={walletBalance}
            isDisabled={depositBorrowDisabled}
            placeholder={'Collateral Deposit'}
            registerForm={registerDepForm}
            setValueForm={setValueDepForm}
            errorsForm={errorsDepForm}
          />
        </HStack>
      </Flex>
      <Flex flexDirection={'column'} justify={'start'} marginTop={'20px'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'brand.whiteAlpha60'}
            lineHeight={'14px'}
          >
            Borrow MONEY
          </Text>
        </Box>
        <HStack {...inputStyle}>
          <Text>Money</Text>
          <TokenAmountInputField
            name="money-borrow"
            isDisabled={depositBorrowDisabled}
            placeholder={'MONEY borrow'}
            registerForm={registerDepForm}
            setValueForm={setValueDepForm}
            errorsForm={errorsDepForm}
            percentage={percentageLabel}
          />
        </HStack>
      </Flex>
      <br />
      <HStack justifyContent={'space-between'}>
        {percentages &&
          Object.entries(percentages).map(([key, value]) => (
            <Button
              variant={'secondary'}
              borderRadius={'full'}
              padding={'6px 16px'}
              key={'percentage' + key}
              onClick={() => setValueDepForm('money-borrow', value.toFixed(10))}
            >
              <Text variant={'bodySmall'} fontWeight={'500'}>
                {key}
              </Text>
            </Button>
          ))}
        <Button
          variant={'secondary'}
          borderRadius={'full'}
          padding={'6px 16px'}
        >
          <Text variant={'bodySmall'} fontWeight={'500'}>
            Custom
          </Text>
        </Button>
      </HStack>
      <HStack justifyContent={'space-between'} marginTop={'40px'}>
        <VStack spacing={'2px'}>
          <Text variant={'bodyExtraSmall'} color={'brand.whiteAlpha60'}>
            Amount
          </Text>
          <Text variant={'bodyMedium'} fontWeight={'500'}>
            -$0.00
          </Text>
        </VStack>
        <VStack spacing={'2px'}>
          <Text variant={'bodyExtraSmall'} color={'brand.whiteAlpha60'}>
            Expected Liquidation Price
          </Text>
          <Text variant={'bodyMedium'} fontWeight={'500'}>
            ${' '}
            {calcLiqPriceFromNum(
              borrowablePercent,
              totalDebt,
              totalCollateral
            ).toFixed(2)}
          </Text>
        </VStack>
        <VStack spacing={'2px'}>
          <Text variant={'bodyExtraSmall'} color={'brand.whiteAlpha60'}>
            cRatio
          </Text>
          <Text variant={'bodyMedium'} fontWeight={'500'}>
            {totalDebt > 0.1 ? (totalCollateral / totalDebt).toFixed(2) : '∞'}
          </Text>
        </VStack>
      </HStack>
      <HStack marginTop={'30px'} spacing={'8px'}>
        <Text varinat={'h300'} color={'brand.whiteAlpha60'}>
          Price:
        </Text>
        <Text varinat={'bodySmall'}>{`1 ${token.ticker} = $ ${usdPrice.toFixed(
          2
        )}`}</Text>
      </HStack>
      <StatusTrackModal state={approveState} title={'Approve'} />
      <StatusTrackModal state={depositBorrowState} title={'Deposit Borrow'} />

      <Box marginTop={'10px'}>
        {allowance.gt(walletBalance) === false ? (
          <EnsureWalletConnected>
            <Button
              variant={'submit'}
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
            variant={'submit'}
            type="submit"
            disabled={depositBorrowDisabled}
            isLoading={isSubmittingDepForm}
            isDisabled={depositBorrowDisabled}
          >
            Deposit & Borrow
          </Button>
        )}
      </Box>
    </form>
  );
}
