import {
  Box,
  Button,
  Flex,
  Text,
  HStack,
  VStack,
  NumberInput,
  NumberInputField,
  InputRightElement,
} from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  calcLiqPriceFromNum,
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
} from '../../chain-interaction/contracts';
import {
  useNativeRepayWithdrawTrans,
  useRepayWithdrawTrans,
} from '../../chain-interaction/transactions';
import { WNATIVE_ADDRESS } from '../../constants/addresses';
import { StatusTrackModal } from '../StatusTrackModal';
import { TokenAmountInputField } from '../TokenAmountInputField';
import { TokenDescription } from '../TokenDescription';

export default function RepayWithdraw({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { token, usdPrice, borrowablePercent } = stratMeta;
  const { chainId } = useEthers();
  const stable = useStable();
  const isNativeToken = WNATIVE_ADDRESS[chainId!] === token.address;

  const {
    handleSubmit: handleSubmitRepayForm,
    register: registerRepayForm,
    setValue: setValueRepayForm,
    formState: { errors: errorsRepayForm, isSubmitting: isSubmittingRepayForm },
    watch,
  } = useForm();

  const { sendRepayWithdraw, repayWithdrawState } = useRepayWithdrawTrans(
    position && position.trancheId,
    token
  );

  const {
    sendRepayWithdraw: sendNativeRepayWithdraw,
    repayWithdrawState: sendNativeWithdrawState,
  } = useNativeRepayWithdrawTrans(position && position.trancheId, token);

  function onRepayWithdraw(data: { [x: string]: any }) {
    console.log('repay withdraw');
    console.log(data);
    if (isNativeToken) {
      sendNativeRepayWithdraw(data['collateral-withdraw'], data['money-repay']);
    } else {
      sendRepayWithdraw(data['collateral-withdraw'], data['money-repay']);
    }
  }

  const repayWithdrawDisabled =
    position &&
    position.collateral &&
    position.collateral.isZero() &&
    position.debt.isZero();

  const [collateralInput, repayInput, customPercentageInput] = watch([
    'collateral-withdraw',
    'money-repay',
    'custom-percentage',
  ]);

  const repayWithdrawButtonDisabled =
    parseFloat(collateralInput) > 0 && parseFloat(repayInput) > 0;

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
  const totalCollateral = extantCollateral - parseFloat(collateralInput);

  const extantDebt =
    position && position.debt && position.debt.gt(position.yield)
      ? parseFloat(
        position.debt.sub(position.yield).format({
          significantDigits: Infinity,
          prefix: '',
          suffix: '',
        })
      )
      : 0;
  const totalDebt = extantDebt - parseFloat(repayInput);

  const currentPercentage =
    totalCollateral > 0 ? (100 * extantDebt) / (totalCollateral * usdPrice) : 0;

  const percentageStep = Math.max(currentPercentage / 5, 10);
  const percentageSteps =
    10 >= currentPercentage
      ? [currentPercentage / 2]
      : Array(Math.floor((currentPercentage - 0.5) / percentageStep))
        .fill(0)
        .map((p, i) => Math.round((p + (i + 1) * percentageStep) / 5) * 5);

  const totalPercentage =
    totalCollateral > 0 ? (100 * totalDebt) / (totalCollateral * usdPrice) : 0;

  const percentageLabel =
    totalCollateral > 0 ? `${totalPercentage.toFixed(0)} %` : 'LTV %';
  const percentages = Object.fromEntries(
    percentageSteps.map((percentage) => [
      `${percentage.toFixed(0)} %`,
      extantDebt - (percentage * totalCollateral * usdPrice) / 100,
    ])
  );

  React.useEffect(() => {
    if (customPercentageInput) {
      setValueRepayForm(
        'money-repay',
        (customPercentageInput * totalCollateral * usdPrice) / 100 - extantDebt
      );
    }

    if (collateralInput && collateralInput > 0) {
      setValueRepayForm(
        'money-repay',
        position?.debt.format({
          significantDigits: Infinity,
          prefix: '',
          suffix: '',
        })
      );
    }
  }, [
    customPercentageInput,
    collateralInput,
    totalCollateral,
    extantDebt,
    usdPrice,
  ]);

  const inputStyle = {
    padding: '8px 8px 8px 20px',
    bg: 'whiteAlpha.50',
    borderRadius: '10px',
    justifyContent: 'space-between',
  };

  return (
    <form onSubmit={handleSubmitRepayForm(onRepayWithdraw)}>
      <Flex flexDirection={'column'} justify={'start'}>
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
      <Flex flexDirection={'column'} justify={'start'} marginTop={'20px'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
          >
            Repay MONEY
          </Text>
        </Box>
        <HStack {...inputStyle}>
          <TokenDescription token={stable} />
          <TokenAmountInputField
            name="money-repay"
            max={
              position && position.debt.gt(position.yield)
                ? position.debt.sub(position.yield)
                : new CurrencyValue(stratMeta.token, BigNumber.from(0))
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
                setValueRepayForm('money-repay', value.toFixed(10))
              }
            >
              {key}
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
        </NumberInput>
      </HStack>
      <HStack justifyContent={'space-between'} marginTop={'40px'}>
        <VStack spacing={'2px'}>
          <Text variant={'bodyExtraSmall'} color={'whiteAlpha.600'}>
            Amount
          </Text>
          <Text variant={'bodyMedium'} fontWeight={'500'}>
            $ {(usdPrice * (extantCollateral - totalCollateral)).toFixed(2)}
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
              ? ((100 * totalCollateral) / totalDebt).toFixed(2)
              : '∞'}
          </Text>
        </VStack>
      </HStack>
      <HStack marginTop={'30px'} spacing={'8px'}>
        <Text varinat={'h300'} color={'whiteAlpha.600'}>
          Price:
        </Text>
        <Text varinat={'bodySmall'}>{`1 ${token.ticker} = $ ${usdPrice.toFixed(
          2
        )}`}</Text>
      </HStack>

      <StatusTrackModal state={repayWithdrawState} title={'Repay | Withdraw'} />
      <StatusTrackModal
        state={sendNativeWithdrawState}
        title={'Repay | Withdraw'}
      />

      <Button
        variant={repayWithdrawButtonDisabled ? 'submit-primary' : 'submit'}
        marginTop={'10px'}
        type="submit"
        isLoading={isSubmittingRepayForm}
        isDisabled={!repayWithdrawButtonDisabled}
      >
        <Text variant={'bodyMedium'} fontWeight={'600'}>
          Repay & Withdraw
        </Text>
      </Button>
    </form>
  );
}
