import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { parseUnits } from 'ethers/lib/utils';
import * as React from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  ParsedStratMetaRow,
  TxStatus,
} from '../../../../chain-interaction/contracts';
import { EnsureWalletConnected } from '../../../../components/account/EnsureWalletConnected';
import { TransactionErrorDialog } from '../../../../components/notifications/TransactionErrorDialog';
import WarningMessage from '../../../../components/notifications/WarningMessage';
import { TokenAmountInputField } from '../../../../components/tokens/TokenAmountInputField';
import { TokenDescriptionInput } from '../../../../components/tokens/TokenDescriptionInput';
import { PositionContext } from '../../../../contexts/PositionContext';

export default function DepositForm({
  stratMeta,
}: React.PropsWithChildren<{
  stratMeta: ParsedStratMetaRow;
}>) {
  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  const [collateralInput, customPercentageInput] = watch([
    'collateral-deposit',
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
  } = useContext(PositionContext).depositAndBorrowFunctions;

  const { setCollateralInput, lockDepositBorrow, depositAndBorrowClicked } =
    useContext(PositionContext);

  React.useEffect(() => {
    if (collateralInput) {
      setCollateralInput?.(
        new CurrencyValue(token, parseUnits(collateralInput, token.decimals))
      );
    }
  }, [collateralInput]);

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

  // const depositBorrowDisabled =
  //   !position &&
  //   (isNativeToken ? nativeTokenBalance.isZero() : walletBalance.isZero());

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
            <TokenDescriptionInput token={stratMeta.token} />
            <Flex direction="column">
              <TokenAmountInputField
                name="collateral-deposit"
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
              {lockDepositBorrow ? 'Deposit and Borrow' : 'Deposit'}
            </Button>
          )}
        </Box>
      </form>
    </>
  );
}
