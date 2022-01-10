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
  // NumberInput,
  // NumberInputField,
  // InputRightElement,
} from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
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
import { useWalletBalance } from '../../contexts/WalletBalancesContext';
import { parseFloatNoNaN } from '../../utils';
import { StatusTrackModal } from '../StatusTrackModal';
import { TokenAmountInputField } from '../TokenAmountInputField';
import { TokenDescription } from '../TokenDescription';
import WarningMessage from './WarningMessage';
import farminfo from '../../contracts/farminfo.json';
import { useState } from 'react';
import { ConfirmPositionModal } from './ConfirmPositionModal';

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
  console.log('position.trancheId', position?.trancheId);
  const {
    sendRepayWithdraw: sendNativeRepayWithdraw,
    repayWithdrawState: sendNativeWithdrawState,
  } = useNativeRepayWithdrawTrans(position && position.trancheId, token);

  function onRepayWithdraw(data: { [x: string]: any }) {
    console.log('repay withdraw');
    console.log(data);
    setData(data);
    onOpen();
  }

  function repayWithdraw() {
    if (isNativeToken) {
      sendNativeRepayWithdraw(
        data!['collateral-withdraw'],
        data!['money-repay']
      );
    } else {
      sendRepayWithdraw(data!['collateral-withdraw'], data!['money-repay']);
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
          thousandSeparator: ',',
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
          thousandSeparator: ',',
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

  return (
    <>
      <ConfirmPositionModal
        title="Confirm Repay"
        isOpen={isOpen}
        onClose={onClose}
        confirm={repayWithdraw}
        body={[
          {
            title: 'Money Repay',
            value: data ? data['money-repay'] : '',
          },
          {
            title: 'Collateral Withdraw',
            value: data ? data!['collateral-withdraw'] : ' ',
          },
          {
            title: 'Resulting Loan-To-Value Ratio',
            value: totalPercentage,
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
              max={residualDebt}
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
        <HStack marginTop={'24px'} spacing={'8px'}>
          <Text variant={'h300'} color={'whiteAlpha.600'}>
            Price:
          </Text>
          <Text variant={'bodySmall'}>{`1 ${
            token.ticker
          } = $ ${usdPrice.toFixed(2)}`}</Text>
        </HStack>

        <StatusTrackModal
          state={repayWithdrawState}
          title={'Repay | Withdraw'}
        />
        <StatusTrackModal
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
