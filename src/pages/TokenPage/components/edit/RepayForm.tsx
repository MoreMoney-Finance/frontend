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
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
} from '../../../../chain-interaction/contracts';
import { TransactionErrorDialog } from '../../../../components/notifications/TransactionErrorDialog';
import WarningMessage from '../../../../components/notifications/WarningMessage';
import { TokenAmountInputField } from '../../../../components/tokens/TokenAmountInputField';
import { TokenDescriptionInput } from '../../../../components/tokens/TokenDescriptionInput';
import { PositionContext } from '../../../../contexts/PositionContext';
import { useWalletBalance } from '../../../../contexts/WalletBalancesContext';

export default function RepayForm({}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  // const { token, usdPrice, borrowablePercent } = stratMeta;
  // const { chainId } = useEthers();
  const { setRepayInput, lockRepayWithdraw } =
    React.useContext(PositionContext);
  // const [data, setData] = useState<{ [x: string]: any }>();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const stable = useStable();
  // const isNativeToken = chainId
  //   ? getAddress(WNATIVE_ADDRESS[chainId!]) === getAddress(token.address)
  //   : false;
  // const balanceCtx = useContext(WalletBalancesContext);

  const {
    handleSubmit: handleSubmitRepayForm,
    register: registerRepayForm,
    setValue: setValueRepayForm,
    formState: { errors: errorsRepayForm, isSubmitting: isSubmittingRepayForm },
    watch,
  } = useForm();

  const [repayInput /*customPercentageInput*/] = watch([
    'money-repay',
    // 'custom-percentage',
  ]);
  const {
    token,
    repayWithdrawButtonDisabled,
    repayWithdrawState,
    sendNativeWithdrawState,
    repayingMoreThanBalance,
    showWarning,
    repayWithdrawDisabled,
  } = React.useContext(PositionContext).repayAndWithdrawFunctions;
  const { repayAndWithdrawClicked } = React.useContext(PositionContext);

  // const { sendRepayWithdraw, repayWithdrawState } = useRepayWithdrawTrans(
  //   position && position.trancheId,
  //   token,
  //   position?.debt
  // );
  // // console.log('position.trancheId', position?.trancheId);
  // const {
  //   sendRepayWithdraw: sendNativeRepayWithdraw,
  //   repayWithdrawState: sendNativeWithdrawState,
  // } = useNativeRepayWithdrawTrans(
  //   position && position.trancheId,
  //   token,
  //   position?.debt
  // );

  // function onRepayWithdraw(data: { [x: string]: any }) {
  //   // console.log('repay withdraw');
  //   // console.log(data);
  //   setData(data);
  //   onOpen();
  // }

  // function repayWithdraw() {
  //   if (isNativeToken) {
  //     sendNativeRepayWithdraw('0', data!['money-repay'] || '0');
  //   } else {
  //     sendRepayWithdraw('0', data!['money-repay'] || '0');
  //   }
  // }

  // const walletBalance =
  //   useWalletBalance(stable.address) ??
  //   new CurrencyValue(stable, BigNumber.from('0'));

  // const repayWithdrawDisabled =
  //   !position ||
  //   !position.collateral ||
  //   (position.collateral.isZero() && position.debt.isZero());

  React.useEffect(() => {
    if (repayInput) {
      setRepayInput?.(
        new CurrencyValue(stable, parseUnits(repayInput, stable.decimals))
      );
    }
  }, [repayInput]);

  // const extantCollateral =
  //   position && position.collateral
  //     ? parseFloatCurrencyValue(position.collateral)
  //     : 0;
  // const totalCollateral = extantCollateral - parseFloatNoNaN(collateralInput);

  // const extantDebt =
  //   position && position.debt && position.debt.gt(position.yield)
  //     ? parseFloatCurrencyValue(position.debt.sub(position.yield))
  //     : 0;
  // const totalDebt = extantDebt - parseFloatNoNaN(repayInput);

  // const currentPercentage =
  //   totalCollateral > 0 ? (100 * extantDebt) / (totalCollateral * usdPrice) : 0;

  // const percentageStep = Math.max(currentPercentage / 5, 10);
  // const percentageSteps =
  //   10 >= currentPercentage
  //     ? [currentPercentage / 2]
  //     : Array(Math.floor((currentPercentage - 0.5) / percentageStep))
  //       .fill(0)
  //       .map((p, i) => Math.round((p + (i + 1) * percentageStep) / 5) * 5);

  // const totalPercentage =
  //   totalCollateral > 0 && usdPrice > 0
  //     ? (100 * totalDebt) / (totalCollateral * usdPrice)
  //     : 0;

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

  const warningMsgText = repayingMoreThanBalance
    ? 'Input more than wallet balance: buy more MONEY'
    : 'Repay more to keep position cRatio healthy';

  // const residualDebt =
  //   position && position.debt.gt(position.yield)
  //     ? position.debt.sub(position.yield)
  //     : new CurrencyValue(stable, BigNumber.from(0));

  // const dangerousPosition =
  //   totalPercentage > borrowablePercent * 0.92 && totalDebt > 0;
  // const liquidatableZone = borrowablePercent;
  // const criticalZone = (90 * borrowablePercent) / 100;
  // const riskyZone = (80 * borrowablePercent) / 100;
  // const healthyZone = (50 * borrowablePercent) / 100;

  const moneyBalance =
    useWalletBalance(stable.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  return (
    <>
      {/* <ConfirmPositionModal
        title="Confirm Repay"
        isOpen={isOpen}
        onClose={onClose}
        confirm={repayWithdraw}
        body={[
          {
            title: <TokenDescription token={stable} />,
            value: <Text>{data ? data!['money-repay'] : ''}</Text>,
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
            <Flex
              w={'full'}
              marginBottom={'6px'}
              flexDirection="row"
              justifyContent={'space-between'}
            >
              <WarningMessage message={warningMsgText} isOpen={showWarning}>
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
                fontSize={'16px'}
              >
                Balance: {moneyBalance.format({ suffix: '' })}
              </Text>
            </Flex>
          </Box>
          <HStack {...inputStyle}>
            <TokenDescriptionInput token={stable} />
            <TokenAmountInputField
              name="money-repay"
              // max={
              //   balanceCtx.get(stable.address)?.gt(residualDebt)
              //     ? residualDebt
              //     : balanceCtx.get(stable.address)
              // }
              isDisabled={repayWithdrawDisabled}
              placeholder={'MONEY repay'}
              registerForm={registerRepayForm}
              setValueForm={setValueRepayForm}
              errorsForm={errorsRepayForm}
              // percentage={percentageLabel}
            />
          </HStack>
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
            {lockRepayWithdraw ? 'Repay and Withdraw' : 'Repay'}
          </Text>
        </Button>
      </form>
    </>
  );
}
