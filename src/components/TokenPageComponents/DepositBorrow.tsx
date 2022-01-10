import {
  Box,
  Button,
  Flex,
  HStack,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {
  CurrencyValue,
  useEtherBalance,
  useEthers,
  useTokenAllowance,
} from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  calcLiqPriceFromNum,
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
  useStable,
} from '../../chain-interaction/contracts';
import {
  useApproveTrans,
  useDepositBorrowTrans,
  useNativeDepositBorrowTrans,
} from '../../chain-interaction/transactions';
import { WNATIVE_ADDRESS } from '../../constants/addresses';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { useWalletBalance } from '../../contexts/WalletBalancesContext';
import { parseFloatNoNaN } from '../../utils';
import { EnsureWalletConnected } from '../EnsureWalletConnected';
import { StatusTrackModal } from '../StatusTrackModal';
import { TokenAmountInputField } from '../TokenAmountInputField';
import { TokenDescription } from '../TokenDescription';
import { ConfirmPositionModal } from './ConfirmPositionModal';
import WarningMessage from './WarningMessage';

export default function DepositBorrow({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { token, strategyAddress, borrowablePercent, usdPrice } = stratMeta;
  const { chainId } = useEthers();
  const [data, setData] = useState<{ [x: string]: any }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const account = useContext(UserAddressContext);
  const stable = useStable();

  const isNativeToken = WNATIVE_ADDRESS[chainId!] === token.address;

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, strategyAddress) ??
      BigNumber.from('0')
  );
  const etherBalance = useEtherBalance(account);

  const nativeTokenBalance = etherBalance
    ? new CurrencyValue(token, etherBalance)
    : new CurrencyValue(token, BigNumber.from('0'));

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
    setData(data);
    onOpen();
  }

  function confirmDeposit() {
    if (isNativeToken) {
      sendNativeDepositBorrow(
        token,
        strategyAddress,
        data!['collateral-deposit'],
        data!['money-borrow']
      );
    } else {
      sendDepositBorrow(
        token,
        strategyAddress,
        data!['collateral-deposit'],
        data!['money-borrow']
      );
    }
  }

  const [collateralInput, borrowInput, customPercentageInput] = watch([
    'collateral-deposit',
    'money-borrow',
    'custom-percentage',
  ]);

  const extantCollateral =
    position && position.collateral
      ? parseFloatNoNaN(
        position.collateral.format({
          significantDigits: Infinity,
          prefix: '',
          suffix: '',
          decimalSeparator: '.',
          thousandSeparator: '',
        })
      )
      : 0;
  const totalCollateral = parseFloatNoNaN(collateralInput) + extantCollateral;

  const extantDebt =
    position && position.debt && position.debt.gt(position.yield)
      ? parseFloatNoNaN(
        position.debt.sub(position.yield).format({
          significantDigits: Infinity,
          prefix: '',
          suffix: '',
          decimalSeparator: '.',
          thousandSeparator: '',
        })
      )
      : 0;
  const totalDebt = parseFloatNoNaN(borrowInput) + extantDebt;

  const currentPercentage =
    totalCollateral > 0 && usdPrice > 0
      ? (100 * extantDebt) / (totalCollateral * usdPrice)
      : 0;
  const percentageRange = borrowablePercent - currentPercentage;

  const percentageStep = Math.max(percentageRange / 5, 10);
  const percentageSteps =
    10 >= percentageRange
      ? [(currentPercentage + borrowablePercent) / 2]
      : Array(Math.floor((percentageRange - 0.5) / percentageStep))
        .fill(currentPercentage)
        .map((p, i) => Math.round((p + (i + 1) * percentageStep) / 5) * 5);

  const totalPercentage =
    totalCollateral > 0 && usdPrice > 0
      ? (100 * totalDebt) / (totalCollateral * usdPrice)
      : 0;

  const percentageLabel =
    totalCollateral > 0 && usdPrice > 0
      ? `${totalPercentage.toFixed(0)} %`
      : 'LTV %';
  const percentages = Object.fromEntries(
    percentageSteps.map((percentage) => [
      `${percentage.toFixed(0)} %`,
      (percentage * totalCollateral * usdPrice) / 100 - extantDebt,
    ])
  );

  const showWarning =
    !(
      parseFloatNoNaN(collateralInput) === 0 &&
      parseFloatNoNaN(borrowInput) === 0
    ) && totalPercentage > borrowablePercent;

  React.useEffect(() => {
    console.log('In effect', customPercentageInput);
    if (customPercentageInput) {
      setValueDepForm(
        'money-borrow',
        (customPercentageInput * totalCollateral * usdPrice) / 100 - extantDebt,
        { shouldDirty: true }
      );
    }
  }, [customPercentageInput, totalCollateral, extantDebt, usdPrice]);

  const depositBorrowDisabled =
    !position &&
    (isNativeToken ? nativeTokenBalance.isZero() : walletBalance.isZero());

  const depositBorrowButtonDisabled =
    (parseFloatNoNaN(collateralInput) === 0 &&
      parseFloatNoNaN(borrowInput) === 0) ||
    totalPercentage > borrowablePercent;

  const inputStyle = {
    padding: '8px 8px 8px 20px',
    bg: 'whiteAlpha.50',
    borderRadius: '10px',
    justifyContent: 'space-between',
  };

  const dangerousPosition = totalPercentage > borrowablePercent * 0.92;

  return (
    <>
      <ConfirmPositionModal
        title="Confirm Borrow"
        isOpen={isOpen}
        onClose={onClose}
        confirm={confirmDeposit}
        body={[
          {
            title: 'Deposit Collateral',
            value: data ? data['collateral-deposit'] : '',
          },
          {
            title: 'Debt taken',
            value: data ? data!['money-borrow'] : ' ',
          },
          {
            title: 'Resulting Loan-To-Value Ratio',
            value: totalPercentage,
          },
        ]}
        dangerous={dangerousPosition}
      />
      <form onSubmit={handleSubmitDepForm(onDepositBorrow)}>
        <Flex flexDirection={'column'} justify={'start'}>
          <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
            <Text
              variant={'bodyExtraSmall'}
              color={'whiteAlpha.600'}
              lineHeight={'14px'}
            >
              Deposit Collateral
            </Text>
          </Box>
          <HStack {...inputStyle}>
            <TokenDescription token={stratMeta.token} />
            <TokenAmountInputField
              name="collateral-deposit"
              max={isNativeToken ? nativeTokenBalance : walletBalance}
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
            <WarningMessage
              message="Borrow amount too high"
              isOpen={showWarning}
            >
              <Text
                variant={'bodyExtraSmall'}
                color={'whiteAlpha.600'}
                lineHeight={'14px'}
              >
                Borrow MONEY
              </Text>
            </WarningMessage>
          </Box>
          <HStack {...inputStyle}>
            <TokenDescription token={stable} />
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
                onClick={() =>
                  setValueDepForm('money-borrow', value.toFixed(10), {
                    shouldDirty: true,
                  })
                }
              >
                <Text variant={'bodySmall'} fontWeight={'500'}>
                  {key}
                </Text>
              </Button>
            ))}
          <NumberInput
            borderRadius={'full'}
            padding={'0px 16px'}
            bg="whiteAlpha.100"
            border="none"
            key={'custom'}
            fontWeight="500"
          >
            <NumberInputField
              {...registerDepForm('custom-percentage')}
              placeholder="Custom"
              name="custom-percentage"
              border="none"
              marginLeft="0px"
              marginRight="18px"
              bg="transparent"
              width="65px"
              padding="0px"
              textAlign="right"
            />
            <InputRightElement width="auto" marginRight="16px">
              %
            </InputRightElement>
          </NumberInput>
        </HStack>
        <HStack justifyContent={'space-between'} marginTop={'40px'}>
          <VStack spacing={'2px'}>
            <Text variant={'bodyExtraSmall'} color={'whiteAlpha.600'}>
              Deposit Value
            </Text>
            <Text variant={'bodyMedium'} fontWeight={'500'}>
              $ {(usdPrice * (totalCollateral - extantCollateral)).toFixed(2)}
            </Text>
          </VStack>
          <VStack spacing={'2px'}>
            <Text variant={'bodyExtraSmall'} color={'whiteAlpha.600'}>
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
            <Text variant={'bodyExtraSmall'} color={'whiteAlpha.600'}>
              cRatio
            </Text>
            <Text variant={'bodyMedium'} fontWeight={'500'}>
              {totalDebt > 0.01
                ? ((100 * usdPrice * totalCollateral) / totalDebt).toFixed(2)
                : '∞'}
            </Text>
          </VStack>
        </HStack>
        <HStack marginTop={'30px'} spacing={'8px'}>
          <Text variant={'h300'} color={'whiteAlpha.600'}>
            Price:
          </Text>
          <Text variant={'bodySmall'}>{`1 ${
            token.ticker
          } = $ ${usdPrice.toFixed(2)}`}</Text>
        </HStack>
        <StatusTrackModal state={approveState} title={'Approve'} />
        <StatusTrackModal state={depositBorrowState} title={'Deposit Borrow'} />
        <StatusTrackModal
          state={nativeDepositBorrowState}
          title={'Deposit Borrow'}
        />

        <Box marginTop={'10px'}>
          {allowance.gt(walletBalance) === false && isNativeToken === false ? (
            <EnsureWalletConnected>
              <Button
                variant={'submit-primary'}
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
              variant={
                depositBorrowButtonDisabled ? 'submit' : 'submit-primary'
              }
              type="submit"
              isLoading={isSubmittingDepForm}
              isDisabled={depositBorrowButtonDisabled}
            >
              Deposit & Borrow
            </Button>
          )}
        </Box>
      </form>
    </>
  );
}
