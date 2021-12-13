import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  calcLiqPriceFromNum,
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';
import { useRepayWithdrawTrans } from '../../chain-interaction/transactions';
import { StatusTrackModal } from '../StatusTrackModal';
import { TokenAmountInputField } from '../TokenAmountInputField';

export default function RepayWithdraw({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { token, usdPrice, borrowablePercent } = stratMeta;

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

  function onRepayWithdraw(data: { [x: string]: any }) {
    console.log('repay withdraw');
    console.log(data);

    sendRepayWithdraw(data['collateral-withdraw'], data['money-repay']);
  }

  const repayWithdrawDisabled =
    position &&
    position.collateral &&
    position.collateral.isZero() &&
    position.debt.isZero();

  const [collateralInput, repayInput] = watch([
    'collateral-withdraw',
    'money-repay',
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
  const totalCollateral = extantCollateral - parseFloat(collateralInput);

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
  const totalDebt = extantDebt - parseFloat(repayInput);

  const currentPercentage =
    totalCollateral > 0 ? (100 * extantDebt) / (totalCollateral * usdPrice) : 0;

  const percentageStep = Math.max(currentPercentage / 5, 10);
  const percentageSteps =
    10 >= currentPercentage
      ? [currentPercentage / 2]
      : Array(Math.floor((currentPercentage - 0.5) / percentageStep))
        .fill(0)
        .map((p, i) => p + (i + 1) * percentageStep);

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

  return (
    <form onSubmit={handleSubmitRepayForm(onRepayWithdraw)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'}>
          <Text fontSize={'sm'}>Withdraw Collateral</Text>
        </Box>
        <TokenAmountInputField
          name="collateral-withdraw"
          max={position?.collateral}
          isDisabled={repayWithdrawDisabled}
          placeholder={'Collateral withdraw'}
          registerForm={registerRepayForm}
          setValueForm={setValueRepayForm}
          errorsForm={errorsRepayForm}
        />
      </Flex>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'}>
          <Text fontSize={'sm'}>Repay MONEY</Text>
        </Box>
        <TokenAmountInputField
          name="money-repay"
          max={position?.debt}
          isDisabled={repayWithdrawDisabled}
          placeholder={'MONEY repay'}
          registerForm={registerRepayForm}
          setValueForm={setValueRepayForm}
          errorsForm={errorsRepayForm}
          percentage={percentageLabel}
        />
      </Flex>
      <br />
      <Grid
        templateColumns={`repeat(${Object.values(percentages).length}, 1fr)`}
        gap={2}
        w={'full'}
      >
        {Object.entries(percentages).map(([key, value]) => (
          <Button
            borderRadius={'xl'}
            key={'percentage' + key}
            onClick={() => setValueRepayForm('money-repay', value.toFixed(10))}
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

      <StatusTrackModal state={repayWithdrawState} title={'Repay | Withdraw'} />

      <Button
        w={'full'}
        type="submit"
        isLoading={isSubmittingRepayForm}
        isDisabled={repayWithdrawDisabled}
      >
        Repay & Withdraw
      </Button>
    </form>
  );
}
