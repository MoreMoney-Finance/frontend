import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  CurrencyValue,
  useEtherBalance,
  useEthers,
  useTokenAllowance,
} from '@usedapp/core';
import { BigNumber } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import * as React from 'react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
  useAddresses,
  useStable,
} from '../../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../../chain-interaction/tokens';
import {
  useApproveTrans,
  useDepositBorrowTrans,
  useNativeDepositBorrowTrans,
} from '../../../../chain-interaction/transactions';
import { EnsureWalletConnected } from '../../../../components/account/EnsureWalletConnected';
import { TransactionErrorDialog } from '../../../../components/notifications/TransactionErrorDialog';
import WarningMessage from '../../../../components/notifications/WarningMessage';
import { TokenAmountInputField } from '../../../../components/tokens/TokenAmountInputField';
import { TokenDescription } from '../../../../components/tokens/TokenDescription';
import { TokenDescriptionInput } from '../../../../components/tokens/TokenDescriptionInput';
import { WNATIVE_ADDRESS } from '../../../../constants/addresses';
import { MakeMostOfMoneyContext } from '../../../../contexts/MakeMostOfMoneyContext';
import { UserAddressContext } from '../../../../contexts/UserAddressContext';
import { useWalletBalance } from '../../../../contexts/WalletBalancesContext';
import { parseFloatCurrencyValue, parseFloatNoNaN } from '../../../../utils';
import { ConfirmPositionModal } from './ConfirmPositionModal';

export default function BorrowForm({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { token, strategyAddress, borrowablePercent, usdPrice } = stratMeta;
  const { chainId } = useEthers();
  const addresses = useAddresses();
  const stablecoinToken = getTokenFromAddress(chainId, addresses.Stablecoin);
  const [data, setData] = useState<{ [x: string]: any }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onToggle, onClose: onClosePopover } = React.useContext(
    MakeMostOfMoneyContext
  );
  const account = useContext(UserAddressContext);
  const stable = useStable();

  const isNativeToken = WNATIVE_ADDRESS[chainId!] === token.address;

  const allowTokenExtrawurst =
    getAddress(token.address) === '0x9e295B5B976a184B14aD8cd72413aD846C299660'
      ? '0x5643F4b25E36478eE1E90418d5343cb6591BcB9d'
      : token.address;
  const allowResult = useTokenAllowance(
    allowTokenExtrawurst,
    account,
    strategyAddress
  );
  const allowCV = new CurrencyValue(token, allowResult ?? BigNumber.from('0'));
  const allowance = token.address && account && strategyAddress && allowCV;

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
    // position ? position.trancheContract : undefined
  );
  const {
    sendDepositBorrow: sendNativeDepositBorrow,
    depositBorrowState: nativeDepositBorrowState,
  } = useNativeDepositBorrowTrans(
    position ? position.trancheId : undefined
    // position ? position.trancheContract : undefined
  );

  function onDepositBorrow(data: { [x: string]: any }) {
    // console.log('deposit borrow');
    // console.log(data);
    setData(data);
    onOpen();
  }

  function confirmDeposit() {
    if (isNativeToken) {
      sendNativeDepositBorrow(
        token,
        strategyAddress,
        '0',
        data!['money-borrow'] || '0'
      );
    } else {
      sendDepositBorrow(
        token,
        strategyAddress,
        '0',
        data!['money-borrow'] || '0'
      );
    }
  }

  const [collateralInput, borrowInput, customPercentageInput] = watch([
    'collateral-deposit',
    'money-borrow',
    'custom-percentage',
  ]);

  const inputExceedsAllowance =
    allowCV &&
    parseFloatNoNaN(collateralInput) > parseFloatCurrencyValue(allowCV);

  const extantCollateral =
    position && position.collateral
      ? parseFloatCurrencyValue(position.collateral)
      : 0;
  const totalCollateral = parseFloatNoNaN(collateralInput) + extantCollateral;

  const extantDebt =
    position && position.debt && position.debt.gt(position.yield)
      ? parseFloatCurrencyValue(position.debt.sub(position.yield))
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

  const percentages = Object.fromEntries(
    percentageSteps.map((percentage) => [
      `${percentage.toFixed(0)} %`,
      (percentage * totalCollateral * usdPrice) / 100 - extantDebt,
    ])
  );

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

  React.useEffect(() => {
    async function waitTransactionResult() {
      const depositBorrowResult = await depositBorrowState.transaction?.wait();
      const nativeDepositBorrowResult =
        await nativeDepositBorrowState.transaction?.wait();
      if (
        depositBorrowResult?.status === 1 ||
        nativeDepositBorrowResult?.status === 1
      ) {
        onToggle();
        setTimeout(() => {
          onClosePopover();
        }, 60000);
      }
    }
    waitTransactionResult();
  }, [depositBorrowState, nativeDepositBorrowState]);

  const depositBorrowDisabled =
    !position &&
    (isNativeToken ? nativeTokenBalance.isZero() : walletBalance.isZero());

  // const isJoeToken =
  //   getAddress(token.address) ===
  //   getAddress('0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd');

  // const depositBorrowButtonDisabledForJoe =
  //   parseFloatNoNaN(collateralInput) > 0 && isJoeToken;

  const depositBorrowButtonDisabled =
    (parseFloatNoNaN(collateralInput) === 0 &&
      parseFloatNoNaN(borrowInput) === 0) ||
    totalPercentage > borrowablePercent;

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

  const dangerousPosition = totalPercentage > borrowablePercent * 0.92;
  console.log('customPercentageInput', customPercentageInput);

  const balance = isNativeToken ? nativeTokenBalance : walletBalance;
  const collateralInputUsd = parseFloatNoNaN(collateralInput) * usdPrice;
  return (
    <>
      <ConfirmPositionModal
        title="Confirm Borrow"
        isOpen={isOpen}
        onClose={onClose}
        confirm={confirmDeposit}
        body={[
          {
            title: <TokenDescription token={stable} />,
            value: <Text>{data ? data!['money-borrow'] : ''}</Text>,
          },
          {
            title: 'At Loan-To-Value %',
            value: totalPercentage.toFixed(1) + ' %',
          },
        ]}
        dangerous={dangerousPosition}
      />
      <form onSubmit={handleSubmitDepForm(onDepositBorrow)}>
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
            >
              Balance: {balance.format({ suffix: '' })}
            </Text>
          </Flex>
          <HStack {...inputStyle}>
            <TokenDescriptionInput token={stablecoinToken} />
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
              Borrow
            </Button>
          )}
        </Box>
      </form>
    </>
  );
}
