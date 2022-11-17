import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
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
import { getAddress } from 'ethers/lib/utils';
import * as React from 'react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  calcLiqPriceFromNum,
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
  useStable,
} from '../../../../chain-interaction/contracts';
// import { getTokenFromAddress } from '../../../../chain-interaction/tokens';
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
import { WNATIVE_ADDRESS } from '../../../../constants/addresses';
import { MakeMostOfMoneyContext } from '../../../../contexts/MakeMostOfMoneyContext';
import { UserAddressContext } from '../../../../contexts/UserAddressContext';
import { useWalletBalance } from '../../../../contexts/WalletBalancesContext';
import { parseFloatCurrencyValue, parseFloatNoNaN } from '../../../../utils';
import { ConfirmPositionModal } from './ConfirmPositionModal';
import GenerateNFTModal from './GenerateNFTModal';

export default function DepositBorrow({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { token, strategyAddress, borrowablePercent, usdPrice } = stratMeta;
  const { chainId } = useEthers();
  // const [isNftGenerating, setIsNftGenerating] = React.useState<boolean>(false);
  const [data, setData] = useState<{ [x: string]: any }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    nftModal,
    setNftModal,
    onToggle,
    onClose: onClosePopover,
  } = React.useContext(MakeMostOfMoneyContext);
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
        data!['collateral-deposit'] || '0',
        data!['money-borrow'] || '0'
      );
    } else {
      sendDepositBorrow(
        token,
        strategyAddress,
        data!['collateral-deposit'] || '0',
        data!['money-borrow'] || '0'
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
        setNftModal(true);
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

  const isJoeToken =
    getAddress(token.address) ===
    getAddress('0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd');

  const depositBorrowButtonDisabledForJoe =
    parseFloatNoNaN(collateralInput) > 0 && isJoeToken;

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

  const liquidatableZone = borrowablePercent;
  const criticalZone = (90 * borrowablePercent) / 100;
  const riskyZone = (80 * borrowablePercent) / 100;
  const healthyZone = (50 * borrowablePercent) / 100;

  const positionHealthColor =
    0.1 > totalDebt
      ? 'accent'
      : totalPercentage > liquidatableZone
      ? 'purple.400'
      : totalPercentage > criticalZone
      ? 'red'
      : totalPercentage > riskyZone
      ? 'orange'
      : totalPercentage > healthyZone
      ? 'green'
      : 'accent';

  const positionHealth = {
    accent: 'Safe',
    green: 'Healthy',
    orange: 'Risky',
    red: 'Critical',
    ['purple.400']: 'Liquidatable',
  };

  // console.log(
  //   'DepositBorrow',
  //   position?.debt,
  //   borrowablePercent,
  //   totalPercentage,
  //   currentPercentage
  // );

  const dangerousPosition = totalPercentage > borrowablePercent * 0.92;
  console.log('customPercentageInput', customPercentageInput, nftModal);
  const balance = isNativeToken ? nativeTokenBalance : walletBalance;

  return (
    <>
      <ConfirmPositionModal
        title="Confirm Deposit / Borrow"
        isOpen={isOpen}
        onClose={onClose}
        confirm={confirmDeposit}
        body={[
          {
            title: <TokenDescription token={stratMeta.token} />,
            value: <Text>{data ? data!['collateral-deposit'] : ''}</Text>,
          },
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
      {nftModal ? <GenerateNFTModal trancheId={position?.trancheId} /> : null}
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
              isOpen={depositBorrowButtonDisabledForJoe}
            >
              <Text
                variant={'bodyExtraSmall'}
                color={'whiteAlpha.600'}
                lineHeight={'14px'}
              >
                Deposit Collateral
              </Text>
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
            <TokenDescription token={stratMeta.token} />
            <TokenAmountInputField
              name="collateral-deposit"
              max={balance}
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
              Liquidation Price
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
          <VStack spacing="2px">
            <Text variant="bodyExtraSmall" color="whiteAlpha.600">
              {positionHealth[positionHealthColor]} Position
            </Text>
            <Box height="24px" margin="2px" padding="6px">
              <Progress
                colorScheme={positionHealthColor}
                value={(100 * totalPercentage) / borrowablePercent}
                width="100px"
                height="14px"
                borderRadius={'10px'}
                opacity="65%"
              />
            </Box>
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
          {allowance && !allowance.gt(walletBalance) && !isNativeToken ? (
            <EnsureWalletConnected>
              <Button
                variant={'submit-primary'}
                onClick={() => sendApprove(strategyAddress)}
                isLoading={
                  approveState.status === TxStatus.MINING &&
                  allowance &&
                  !allowance.gt(walletBalance)
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
                depositBorrowButtonDisabled || depositBorrowButtonDisabledForJoe
              }
            >
              Deposit & Borrow
            </Button>
          )}
        </Box>
      </form>
    </>
  );
}
