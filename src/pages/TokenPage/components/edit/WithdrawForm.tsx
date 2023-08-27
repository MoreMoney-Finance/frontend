import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Text,
} from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { parseUnits } from 'ethers/lib/utils';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../../../chain-interaction/contracts';
import { TransactionErrorDialog } from '../../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../../components/tokens/TokenAmountInputField';
import { TokenDescriptionInput } from '../../../../components/tokens/TokenDescriptionInput';
import { PositionContext } from '../../../../contexts/PositionContext';

export default function WithdrawForm({
  stratMeta,
  position,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { setCollateralWithdraw } = React.useContext(PositionContext);
  const {
    handleSubmit: handleSubmitRepayForm,
    register: registerRepayForm,
    setValue: setValueRepayForm,
    formState: { errors: errorsRepayForm, isSubmitting: isSubmittingRepayForm },
    watch,
  } = useForm();

  const [collateralInput /*customPercentageInput*/] = watch([
    'collateral-withdraw',
    // 'custom-percentage',
  ]);
  const {
    token,
    repayWithdrawButtonDisabled,
    repayWithdrawState,
    sendNativeWithdrawState,
    repayWithdrawDisabled,
  } = React.useContext(PositionContext).repayAndWithdrawFunctions;
  const { repayAndWithdrawClicked, lockRepayWithdraw } =
    React.useContext(PositionContext);
  React.useEffect(() => {
    if (collateralInput) {
      setCollateralWithdraw?.(
        new CurrencyValue(token, parseUnits(collateralInput, token.decimals))
      );
    }
  }, [collateralInput]);
  // const currentPercentage =
  //   totalCollateral > 0 ? (100 * extantDebt) / (totalCollateral * usdPrice) : 0;

  // const percentageStep = Math.max(currentPercentage / 5, 10);
  // const percentageSteps =
  //   10 >= currentPercentage
  //     ? [currentPercentage / 2]
  //     : Array(Math.floor((currentPercentage - 0.5) / percentageStep))
  //       .fill(0)
  //       .map((p, i) => Math.round((p + (i + 1) * percentageStep) / 5) * 5);

  // const percentageLabel =
  //   totalCollateral > 0 ? `${totalPercentage.toFixed(0)} %` : 'LTV %';
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

  const yyLink = `https://yieldyak.com/swap?outputCurrency=0x0f577433Bf59560Ef2a79c124E9Ff99fCa258948`;

  const inputStyle = {
    padding: '8px 8px 8px 20px',
    bg: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(2px)',
    borderRadius: '12px',
    justifyContent: 'space-between',
    height: '112px',
  };

  // const residualDebt =
  //   position && position.debt.gt(position.yield)
  //     ? position.debt.sub(position.yield)
  //     : new CurrencyValue(stable, BigNumber.from(0));

  // const liquidatableZone = borrowablePercent;
  // const criticalZone = (90 * borrowablePercent) / 100;
  // const riskyZone = (80 * borrowablePercent) / 100;
  // const healthyZone = (50 * borrowablePercent) / 100;

  return (
    <>
      {/* <ConfirmPositionModal
        title="Confirm Withdraw"
        isOpen={isOpen}
        onClose={onClose}
        confirm={repayWithdraw}
        body={[
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
      /> */}
      <form onSubmit={handleSubmitRepayForm(repayAndWithdrawClicked)}>
        <Flex flexDirection={'column'} justify={'start'}>
          <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
            <Flex flexDirection={'column'} justify={'start'} marginTop={'20px'}>
              <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
                <Flex
                  w={'full'}
                  marginBottom={'0px'}
                  flexDirection="row"
                  justifyContent={'space-between'}
                >
                  <Text
                    variant={'bodyExtraSmall'}
                    color={'whiteAlpha.600'}
                    lineHeight={'14px'}
                  ></Text>
                  <Text
                    variant={'bodyExtraSmall'}
                    color={'whiteAlpha.600'}
                    lineHeight={'14px'}
                    fontSize="16px"
                  >
                    Balance: {position?.collateral?.format({ suffix: '' })}
                  </Text>
                </Flex>
              </Box>
              <HStack {...inputStyle}>
                <TokenDescriptionInput token={stratMeta.token} />
                <TokenAmountInputField
                  name="collateral-withdraw"
                  // max={position?.collateral}
                  isDisabled={repayWithdrawDisabled}
                  placeholder={'Collateral withdraw'}
                  registerForm={registerRepayForm}
                  setValueForm={setValueRepayForm}
                  errorsForm={errorsRepayForm}
                />
              </HStack>
            </Flex>
          </Box>
        </Flex>
        <br />
        <HStack justifyContent={'space-between'}>
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
              href={yyLink}
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
          <Text fontWeight={'400'}>
            {lockRepayWithdraw ? 'Repay and Withdraw' : 'Withdraw'}
          </Text>
        </Button>
      </form>
    </>
  );
}
