import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { parseUnits } from 'ethers/lib/utils';
import * as React from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
  useStable,
} from '../../../../chain-interaction/contracts';
import { EnsureWalletConnected } from '../../../../components/account/EnsureWalletConnected';
import { TransactionErrorDialog } from '../../../../components/notifications/TransactionErrorDialog';
import WarningMessage from '../../../../components/notifications/WarningMessage';
import { TokenAmountInputField } from '../../../../components/tokens/TokenAmountInputField';
import { TokenDescriptionInput } from '../../../../components/tokens/TokenDescriptionInput';
import { PositionContext } from '../../../../contexts/PositionContext';

export default function BorrowForm({}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { setBorrowInput, lockDepositBorrow } = useContext(PositionContext);
  const stable = useStable();
  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();
  const [borrowInput, customPercentageInput] = watch([
    'money-borrow',
    'custom-percentage',
  ]);
  const {
    token,
    totalCollateral,
    usdPrice,
    isNativeToken,
    extantDebt,
    balance,
    depositBorrowDisabled,
    collateralInputUsd,
    approveState,
    depositBorrowState,
    nativeDepositBorrowState,
    allowance,
    inputExceedsAllowance,
    sendApprove,
    strategyAddress,
    depositBorrowButtonDisabled,
    percentages,
    depositAndBorrowClicked,
  } = useContext(PositionContext);

  React.useEffect(() => {
    if (borrowInput) {
      setBorrowInput?.(
        new CurrencyValue(stable, parseUnits(borrowInput, stable.decimals))
      );
    }
  }, [borrowInput]);

  React.useEffect(() => {
    // console.log('In effect', customPercentageInput);
    if (customPercentageInput) {
      setValueDepForm(
        'money-borrow',
        (customPercentageInput * totalCollateral * usdPrice) / 100 - extantDebt,
        { shouldDirty: true }
      );
    }
  }, [customPercentageInput, totalCollateral, extantDebt, usdPrice]);

  // const isJoeToken =
  //   getAddress(token.address) ===
  //   getAddress('0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd');

  // const depositBorrowButtonDisabledForJoe =
  //   parseFloatNoNaN(collateralInput) > 0 && isJoeToken;

  // const depositBorrowButtonDisabled =
  //   (parseFloatNoNaN(collateralInput) === 0 &&
  //     parseFloatNoNaN(borrowInput) === 0) ||
  //   totalPercentage > borrowablePercent;

  const inputStyle = {
    padding: '8px 8px 8px 20px',
    bg: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(2px)',
    borderRadius: '12px',
    justifyContent: 'space-between',
    height: '112px',
  };

  // console.log(
  //   'DepositBorrow',
  //   position?.debt,
  //   borrowablePercent,
  //   totalPercentage,
  //   currentPercentage
  // );

  // const dangerousPosition = totalPercentage > borrowablePercent * 0.92;
  // console.log('customPercentageInput', customPercentageInput);

  // const balance = isNativeToken ? nativeTokenBalance : walletBalance;
  // const collateralInputUsd = parseFloatNoNaN(collateralInput) * usdPrice;
  // const modalTitle = lockDepositBorrow
  //   ? 'Confirm Deposit and Borrow'
  //   : 'Confirm Borrow';

  // let modalBody: { title: React.ReactNode; value: React.ReactNode }[] = [];

  // if (lockDepositBorrow) {
  //   modalBody = [
  //     {
  //       title: <TokenDescription token={stable} />,
  //       value: <Text>{data ? data!['money-borrow'] : ''}</Text>,
  //     },
  //     {
  //       title: <TokenDescription token={stable} />,
  //       value: <Text>{data ? data!['money-borrow'] : ''}</Text>,
  //     },
  //   ];
  // }
  // modalBody.push({
  //   title: <Text>At Loan-To-Value %</Text>,
  //   value: <Text>{totalPercentage.toFixed(1)}%</Text>,
  // });

  return (
    <>
      <form onSubmit={handleSubmitDepForm(depositAndBorrowClicked)}>
        <Flex flexDirection={'column'} justify={'start'}>
          <Flex
            w={'full'}
            marginBottom={'6px'}
            flexDirection="row"
            justifyContent={'space-between'}
          >
            <WarningMessage
              message="JOE deposits currently disabled."
              // isOpen={depositBorrowButtonDisabledForJoe}
              isOpen={false}
            >
              <Text
                variant={'bodyExtraSmall'}
                color={'whiteAlpha.600'}
                lineHeight={'14px'}
              ></Text>
            </WarningMessage>
            <Text
              variant={'bodyExtraSmall'}
              color={'whiteAlpha.600'}
              lineHeight={'14px'}
              fontSize="16px"
            >
              Balance: {balance.format({ suffix: '' })}
            </Text>
          </Flex>
          <HStack {...inputStyle}>
            <TokenDescriptionInput token={stable} />
            <Flex direction="column">
              <TokenAmountInputField
                name="money-borrow"
                // max={balance}
                width="full"
                isDisabled={depositBorrowDisabled}
                placeholder={''}
                registerForm={registerDepForm}
                setValueForm={setValueDepForm}
                errorsForm={errorsDepForm}
              />
              <Text
                color="black"
                fontSize="16px"
                textAlign="right"
                marginRight="43px"
              >
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(collateralInputUsd)}
              </Text>
            </Flex>
          </HStack>
        </Flex>

        <br />
        <HStack justifyContent={'space-between'}>
          {percentages &&
            Object.entries(percentages).map(([key, value]) => (
              <Button
                w="full"
                variant={'secondary'}
                borderRadius={'full'}
                padding={'6px 16px'}
                key={'percentage' + key}
                onClick={() => {
                  setValueDepForm('custom-percentage', '');
                  setValueDepForm('money-borrow', value.toFixed(10), {
                    shouldDirty: true,
                  });
                }}
              >
                <Text variant={'bodySmall'} fontWeight={'500'}>
                  {key}
                </Text>
              </Button>
            ))}
          <InputGroup width="120px" border={'none'}>
            <Input
              {...registerDepForm('custom-percentage')}
              key={'custom'}
              placeholder="Custom"
              variant={
                customPercentageInput ? 'percentage' : 'percentage_inactive'
              }
            />
            <InputRightElement width="auto" marginRight="16px">
              %
            </InputRightElement>
          </InputGroup>
        </HStack>
        <br />
        <TransactionErrorDialog state={approveState} title={'Approve'} />
        <TransactionErrorDialog
          state={depositBorrowState}
          title={'Deposit Borrow'}
        />
        <TransactionErrorDialog
          state={nativeDepositBorrowState}
          title={'Deposit Borrow'}
        />

        <Box marginTop={'10px'}>
          {allowance && inputExceedsAllowance && !isNativeToken ? (
            <EnsureWalletConnected>
              <Button
                variant={'submit-primary'}
                onClick={() => sendApprove(strategyAddress)}
                isLoading={
                  approveState.status === TxStatus.MINING &&
                  allowance &&
                  inputExceedsAllowance
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
              isDisabled={
                // depositBorrowButtonDisabled || depositBorrowButtonDisabledForJoe
                depositBorrowButtonDisabled
              }
            >
              {lockDepositBorrow ? 'Deposit and Borrow' : 'Borrow'}
            </Button>
          )}
        </Box>
      </form>
    </>
  );
}
