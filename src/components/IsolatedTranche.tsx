import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/accordion';
import { Avatar, AvatarGroup } from '@chakra-ui/avatar';
import { Button, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
  YieldType,
} from '../chain-interaction/contracts';
import { addressIcons } from '../chain-interaction/tokens';
import { useWalletBalance } from './WalletBalancesContext';
import { useForm } from 'react-hook-form';
import {
  useApproveTrans,
  useDepositBorrowTrans,
  useRepayWithdrawTrans,
} from '../chain-interaction/transactions';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { TokenAmountInputField } from './TokenAmountInputField';
import { IsolatedTrancheTable } from './IsolatedTrancheTable';

export function IsolatedTranche(
  params: React.PropsWithChildren<
    ParsedStratMetaRow | (ParsedStratMetaRow & ParsedPositionMetaRow)
  >
) {
  const { token, APY, strategyName, strategyAddress, debtCeiling } = params;

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
  } = useForm();

  const {
    handleSubmit: handleSubmitRepayForm,
    register: registerRepayForm,
    setValue: setValueRepayForm,
    formState: { errors: errorsRepayForm, isSubmitting: isSubmittingRepayForm },
  } = useForm();

  const trancheId = 'trancheId' in params ? params.trancheId : null;
  const { sendDepositBorrow /*depositBorrowState*/ } =
    useDepositBorrowTrans(trancheId);

  const { sendRepayWithdraw } = useRepayWithdrawTrans(trancheId, token);

  const { account } = useEthers();

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, strategyAddress) ??
      BigNumber.from('0')
  );

  console.log(`allowance for ${token.name}: ${allowance.format()}`);
  console.log(`debt ceiling for ${token.name}: ${debtCeiling.format()}`);

  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));
  console.log(`wallet balance for ${token.name}: ${walletBalance.format()}`);

  const depositMax = parseFloat(
    (allowance.gt(walletBalance) ? walletBalance : allowance).format()
  );

  const collateralBalance =
    'collateral' in params && params.collateral
      ? parseFloat(params.collateral.format())
      : 0;
  const debtBalance = 'debt' in params ? parseFloat(params.debt.format()) : 0;

  // const collateralDeposit = watch('collateral-deposit');

  function onDepositBorrow(data: { [x: string]: any }) {
    console.log('deposit borrow');
    console.log(data);

    sendDepositBorrow(
      token,
      strategyAddress,
      data['collateral-deposit'],
      data['usdm-borrow']
    );
  }

  function onRepayWithdraw(data: { [x: string]: any }) {
    console.log('repay withdraw');
    console.log(data);

    sendRepayWithdraw(data['collateral-withdraw'], data['usdm-repay']);
  }

  const { approveState, sendApprove } = useApproveTrans(token.address);

  const depositBorrowDisabled = depositMax === 0;
  const repayWithdrawDisabled = collateralBalance === 0 || debtBalance === 0;

  return (
    <AccordionItem>
      <h4>
        <AccordionButton>
          <HStack spacing="0.5rem">
            <AvatarGroup size="xs" max={2}>
              {(addressIcons.get(token.address) ?? []).map((iconUrl, i) => (
                <Avatar src={iconUrl} key={i + 1} />
              ))}
            </AvatarGroup>
            <Text>{token.name}</Text>
            <Text>{strategyName}</Text>
            <Text>{APY.toPrecision(4)} % APY</Text>
            <Text>
              {collateralBalance.toPrecision(4)} {token.ticker}
            </Text>
            <Text> {debtBalance.toPrecision(4)} debt </Text>
            <AccordionIcon />
          </HStack>
        </AccordionButton>
      </h4>

      <AccordionPanel>
        {allowance.gt(walletBalance) === false ? (
          <Button
            onClick={() => sendApprove(strategyAddress)}
            isLoading={
              approveState.status == TxStatus.SUCCESS &&
              allowance.gt(walletBalance) === false
            }
          >
            Approve {token.name}{' '}
          </Button>
        ) : (
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            <GridItem colSpan={1}>
              <IsolatedTrancheTable
                rows={[
                  {
                    debtCeiling: allowance,
                    totalDebt: allowance,
                    stabilityFeePercent: 2.0,
                    mintingFeePercent: 2.0,
                    strategyAddress: '0x00000000',
                    token: token,
                    APY: 72.3,
                    totalCollateral: allowance,
                    borrowablePercent: 2.0,
                    usdPrice: 100,
                    strategyName: 'Strategy Name',
                    liqThreshPercent: 2.0,
                    tvlInToken: allowance,
                    tvlInPeg: allowance,
                    harvestBalance2Tally: allowance,
                    yieldType: YieldType.NOYIELD,
                  } as ParsedStratMetaRow,
                ]}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <form onSubmit={handleSubmitDepForm(onDepositBorrow)}>
                <VStack spacing="0.5rem">
                  <TokenAmountInputField
                    name="collateral-deposit"
                    min={0}
                    max={depositMax}
                    isDisabled={depositBorrowDisabled}
                    showMaxButton={true}
                    placeholder={'Collateral Deposit'}
                    registerForm={registerDepForm}
                    setValueForm={setValueDepForm}
                    errorsForm={errorsDepForm}
                  />

                  <TokenAmountInputField
                    name="usdm-borrow"
                    min={0}
                    isDisabled={depositBorrowDisabled}
                    placeholder={'USDm borrow'}
                    registerForm={registerDepForm}
                    setValueForm={setValueDepForm}
                    errorsForm={errorsDepForm}
                  />

                  <Button
                    type="submit"
                    isLoading={isSubmittingDepForm}
                    isDisabled={depositBorrowDisabled}
                  >
                    Deposit &amp; Borrow
                  </Button>
                </VStack>
              </form>
            </GridItem>
            <GridItem colSpan={1}>
              <form onSubmit={handleSubmitRepayForm(onRepayWithdraw)}>
                <VStack spacing="0.5rem">
                  <TokenAmountInputField
                    name="collateral-withdraw"
                    min={0}
                    max={collateralBalance}
                    isDisabled={repayWithdrawDisabled}
                    showMaxButton={true}
                    placeholder={'Collateral withdraw'}
                    registerForm={registerRepayForm}
                    setValueForm={setValueRepayForm}
                    errorsForm={errorsRepayForm}
                  />

                  <TokenAmountInputField
                    name="usdm-repay"
                    min={0}
                    max={debtBalance}
                    isDisabled={repayWithdrawDisabled}
                    placeholder={'USDm repay'}
                    registerForm={registerRepayForm}
                    setValueForm={setValueRepayForm}
                    errorsForm={errorsRepayForm}
                  />

                  <Button type="submit" isLoading={isSubmittingRepayForm} isDisabled={repayWithdrawDisabled}>
                    Repay &amp; Withdraw
                  </Button>
                </VStack>
              </form>
            </GridItem>
          </Grid>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}
