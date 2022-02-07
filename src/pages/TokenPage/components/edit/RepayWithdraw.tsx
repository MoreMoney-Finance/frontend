import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Text,
  HStack,
  VStack,
  Alert,
  AlertIcon,
  Link,
  useDisclosure,
  Progress,
  // NumberInput,
  // NumberInputField,
  // InputRightElement,
} from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { getAddress, parseEther } from 'ethers/lib/utils';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import WarningMessage from '../../../../components/notifications/WarningMessage';
import farminfo from '../../../../contracts/farminfo.json';
import { useContext, useState } from 'react';
import { ConfirmPositionModal } from './ConfirmPositionModal';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
  calcLiqPriceFromNum,
} from '../../../../chain-interaction/contracts';
import {
  useRepayWithdrawTrans,
  useNativeRepayWithdrawTrans,
} from '../../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../../components/tokens/TokenAmountInputField';
import { TokenDescription } from '../../../../components/tokens/TokenDescription';
import { WNATIVE_ADDRESS } from '../../../../constants/addresses';
import {
  useWalletBalance,
  WalletBalancesContext,
} from '../../../../contexts/WalletBalancesContext';
import { parseFloatNoNaN } from '../../../../utils';

export default function RepayWithdraw({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { token, usdPrice, borrowablePercent } = stratMeta;
  const { chainId } = useEthers();
  const [data, setData] = useState<{ [x: string]: any }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const stable = useStable();
  const isNativeToken =
    getAddress(WNATIVE_ADDRESS[chainId!]) === getAddress(token.address);
  const balanceCtx = useContext(WalletBalancesContext);

  const {
    handleSubmit: handleSubmitRepayForm,
    register: registerRepayForm,
    setValue: setValueRepayForm,
    formState: { errors: errorsRepayForm, isSubmitting: isSubmittingRepayForm },
    watch,
  } = useForm();

  const { sendRepayWithdraw, repayWithdrawState } = useRepayWithdrawTrans(
    position && position.trancheId,
    token,
    position ? position.trancheContract : undefined
  );
  // console.log('position.trancheId', position?.trancheId);
  const {
    sendRepayWithdraw: sendNativeRepayWithdraw,
    repayWithdrawState: sendNativeWithdrawState,
  } = useNativeRepayWithdrawTrans(
    position && position.trancheId,
    token,
    position ? position.trancheContract : undefined
  );

  function onRepayWithdraw(data: { [x: string]: any }) {
    // console.log('repay withdraw');
    // console.log(data);
    setData(data);
    onOpen();
  }

  function repayWithdraw() {
    if (isNativeToken) {
      sendNativeRepayWithdraw(
        data!['collateral-withdraw'] ?? '0',
        data!['money-repay'] ?? '0'
      );
    } else {
      sendRepayWithdraw(
        data!['collateral-withdraw'] ?? '0',
        data!['money-repay'] ?? '0'
      );
    }
  }

  const walletBalance =
    useWalletBalance(stable.address) ??
    new CurrencyValue(stable, BigNumber.from('0'));

  const repayWithdrawDisabled =
    !position ||
    !position.collateral ||
    (position.collateral.isZero() && position.debt.isZero());

  const [collateralInput, repayInput /*customPercentageInput*/] = watch([
    'collateral-withdraw',
    'money-repay',
    // 'custom-percentage',
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
  const totalCollateral = extantCollateral - parseFloatNoNaN(collateralInput);

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
  const totalDebt = extantDebt - parseFloatNoNaN(repayInput);

  // const currentPercentage =
  //   totalCollateral > 0 ? (100 * extantDebt) / (totalCollateral * usdPrice) : 0;

  // const percentageStep = Math.max(currentPercentage / 5, 10);
  // const percentageSteps =
  //   10 >= currentPercentage
  //     ? [currentPercentage / 2]
  //     : Array(Math.floor((currentPercentage - 0.5) / percentageStep))
  //       .fill(0)
  //       .map((p, i) => Math.round((p + (i + 1) * percentageStep) / 5) * 5);

  const totalPercentage =
    totalCollateral > 0 && usdPrice > 0
      ? (100 * totalDebt) / (totalCollateral * usdPrice)
      : 0;

  const percentageLabel =
    totalCollateral > 0 ? `${totalPercentage.toFixed(0)} %` : 'LTV %';
  // const percentages = Object.fromEntries(
  //   percentageSteps.map((percentage) => [
  //     `${percentage.toFixed(0)} %`,
  //     totalCollateral - (totalDebt * 100) / (usdPrice * customPercentageInput)
  //   ])
  // );

  // React.useEffect(() => {
  //   if (customPercentageInput) {
  //     setValueRepayForm(
  //       'collateral-withdraw',
  //       totalCollateral - (totalDebt * 100) / (usdPrice * customPercentageInput)
  //     );
  //   } else if (
  //     collateralInput &&
  //     collateralInput > 0 &&
  //     totalPercentage > borrowablePercent
  //   ) {
  //     setValueRepayForm(
  //       'money-repay',
  //       (borrowablePercent * totalCollateral * usdPrice) / 100 - extantDebt
  //     );
  //   }
  // }, [
  //   customPercentageInput,
  //   collateralInput,
  //   totalCollateral,
  //   extantDebt,
  //   usdPrice,
  // ]);

  const farmInfoIdx = (chainId?.toString() ?? '43114') as keyof typeof farminfo;
  const curveLink = `https://avax.curve.fi/factory/${farminfo[farmInfoIdx].curvePoolIdx}/`;

  const repayingMoreThanBalance =
    !isNaN(parseFloat(repayInput)) &&
    parseEther(repayInput || '0').gt(walletBalance.value);

  const repayWithdrawButtonDisabled =
    (parseFloatNoNaN(collateralInput) === 0 &&
      parseFloatNoNaN(repayInput) === 0) ||
    totalPercentage > borrowablePercent ||
    (totalCollateral === 0 && totalDebt > 0) ||
    repayingMoreThanBalance;

  const inputStyle = {
    padding: '8px 8px 8px 20px',
    bg: 'whiteAlpha.50',
    borderRadius: '10px',
    justifyContent: 'space-between',
  };

  const showWarning =
    (!(
      parseFloatNoNaN(collateralInput) === 0 &&
      parseFloatNoNaN(repayInput) === 0
    ) &&
      totalPercentage > borrowablePercent) ||
    repayingMoreThanBalance ||
    (totalCollateral === 0 && totalDebt > 0);

  const warningMsgText = repayingMoreThanBalance
    ? 'Input more than wallet balance: buy more MONEY'
    : 'Repay more to keep position cRatio healthy';

  const residualDebt =
    position && position.debt.gt(position.yield)
      ? position.debt.sub(position.yield)
      : new CurrencyValue(stable, BigNumber.from(0));

  const dangerousPosition =
    totalPercentage > borrowablePercent * 0.92 && totalDebt > 0;
  const liquidatableZone = borrowablePercent;
  const criticalZone = (90 * borrowablePercent) / 100;
  const riskyZone = (80 * borrowablePercent) / 100;
  const healthyZone = (50 * borrowablePercent) / 100;

  const positionHealthColor = position?.debt.value.lt(parseEther('0.1'))
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
  return (
    <>
      <ConfirmPositionModal
        title="Confirm Repay / Withdraw"
        isOpen={isOpen}
        onClose={onClose}
        confirm={repayWithdraw}
        body={[
          {
            title: <TokenDescription token={stable} />,
            value: <Text>{data ? data!['money-repay'] : ''}</Text>,
          },
          {
            title: <TokenDescription token={stratMeta.token} />,
            value: <Text>{data ? data!['collateral-withdraw'] : ''}</Text>,
          },
          {
            title: 'At Loan-To-Value %',
            value: totalPercentage.toFixed(1) + ' %',
          },
        ]}
        dangerous={dangerousPosition}
      />
      <form onSubmit={handleSubmitRepayForm(onRepayWithdraw)}>
        <Flex flexDirection={'column'} justify={'start'}>
          <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
            <WarningMessage message={warningMsgText} isOpen={showWarning}>
              <Text
                variant={'bodyExtraSmall'}
                color={'whiteAlpha.600'}
                lineHeight={'14px'}
              >
                Repay MONEY
              </Text>
            </WarningMessage>
          </Box>
          <HStack {...inputStyle}>
            <TokenDescription token={stable} />
            <TokenAmountInputField
              name="money-repay"
              max={
                balanceCtx.get(stable.address)?.gt(residualDebt)
                  ? residualDebt
                  : balanceCtx.get(stable.address)
              }
              isDisabled={repayWithdrawDisabled}
              placeholder={'MONEY repay'}
              registerForm={registerRepayForm}
              setValueForm={setValueRepayForm}
              errorsForm={errorsRepayForm}
              percentage={percentageLabel}
            />
          </HStack>
        </Flex>
        <Flex flexDirection={'column'} justify={'start'} marginTop={'20px'}>
          <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
            <Text
              variant={'bodyExtraSmall'}
              color={'whiteAlpha.600'}
              lineHeight={'14px'}
            >
              Withdraw Collateral
            </Text>
          </Box>
          <HStack {...inputStyle}>
            <TokenDescription token={stratMeta.token} />
            <TokenAmountInputField
              name="collateral-withdraw"
              max={position?.collateral}
              isDisabled={repayWithdrawDisabled}
              placeholder={'Collateral withdraw'}
              registerForm={registerRepayForm}
              setValueForm={setValueRepayForm}
              errorsForm={errorsRepayForm}
            />
          </HStack>
        </Flex>
        <br />
        <HStack justifyContent={'space-between'}>
          {/* {percentages &&
          Object.entries(percentages).map(([key, value]) => (
            <Button
              variant={'secondary'}
              borderRadius={'full'}
              padding={'6px 16px'}
              key={'percentage' + key}
              onClick={() =>
                setValueRepayForm('collateral-withdraw', value.toFixed(18))
              }
            >
              {key}
            </Button>
          ))} */}

          {/* <NumberInput
          borderRadius={'full'}
          padding={'0px 16px'}
          bg="whiteAlpha.100"
          border="none"
          key={'custom'}
          fontWeight="500"
        >
          <NumberInputField
            {...registerRepayForm('custom-percentage')}
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
        </NumberInput> */}
          <Alert
            status="info"
            justifyContent={'center'}
            fontSize={'md'}
            borderRadius={'lg'}
          >
            <AlertIcon />
            <b>To unwind / repay minting fee:</b>

            <Button
              as={Link}
              href={curveLink}
              isExternal
              color={'white'}
              variant={'primary'}
              padding="12px"
              ml="16px"
            >
              Buy MONEY &nbsp;
              <ExternalLinkIcon />
            </Button>
          </Alert>
        </HStack>
        <br />
        <HStack justifyContent={'space-between'} marginTop={'24px'}>
          <VStack spacing={'2px'}>
            <Text variant={'bodyExtraSmall'} color={'whiteAlpha.600'}>
              Withdrawal Value
            </Text>
            <Text variant={'bodyMedium'} fontWeight={'500'}>
              $ {(usdPrice * (extantCollateral - totalCollateral)).toFixed(2)}
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
                value={totalPercentage}
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
        <HStack marginTop={'24px'} spacing={'8px'}>
          <Text variant={'h300'} color={'whiteAlpha.600'}>
            Price:
          </Text>
          <Text variant={'bodySmall'}>{`1 ${
            token.ticker
          } = $ ${usdPrice.toFixed(2)}`}</Text>
        </HStack>

        <TransactionErrorDialog
          state={repayWithdrawState}
          title={'Repay | Withdraw'}
        />
        <TransactionErrorDialog
          state={sendNativeWithdrawState}
          title={'Repay | Withdraw'}
        />

        <Button
          variant={repayWithdrawButtonDisabled ? 'submit' : 'submit-primary'}
          marginTop={'10px'}
          type="submit"
          isLoading={isSubmittingRepayForm}
          isDisabled={repayWithdrawButtonDisabled}
        >
          <Text variant={'bodyMedium'} fontWeight={'600'}>
            Repay & Withdraw
          </Text>
        </Button>
      </form>
    </>
  );
}
