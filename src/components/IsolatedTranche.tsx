import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/accordion';
import { Avatar, AvatarGroup } from '@chakra-ui/avatar';
import { Button, FormControl, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../chain-interaction/contracts';
import { addressIcons } from '../chain-interaction/tokens';
import { useWalletBalance } from './WalletBalancesContext';
import { useForm } from 'react-hook-form';
import {
  useApproveTrans,
  useMintDepositBorrowTrans,
  useRepayWithdrawTrans,
} from '../chain-interaction/transactions';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { TokenAmountInputField } from './TokenAmountInputField';

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

  const { sendMintDepositBorrow /*depositBorrowState*/ } =
    useMintDepositBorrowTrans();

  const { sendRepayWithdraw } = useRepayWithdrawTrans(
    'trancheId' in params ? params.trancheId : null,
    token
  );

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

    sendMintDepositBorrow(
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

  const { sendApprove } = useApproveTrans(token.address);

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
        <Button onClick={() => sendApprove(strategyAddress)}>
          Approve {token.name}{' '}
        </Button>
        <form onSubmit={handleSubmitDepForm(onDepositBorrow)}>
          <FormControl isInvalid={errorsDepForm.name}>
            <HStack spacing="0.5rem">
              <TokenAmountInputField
                name="collateral-deposit"
                min={0}
                max={depositMax}
                showMaxButton={true}
                placeholder={'Collateral Deposit'}
                registerForm={registerDepForm}
                setValueForm={setValueDepForm}
                errorsForm={errorsDepForm}
              />

              <TokenAmountInputField
                name="usdm-borrow"
                min={0}
                placeholder={'USDm borrow'}
                registerForm={registerDepForm}
                setValueForm={setValueDepForm}
                errorsForm={errorsDepForm}
              />

              <Button type="submit" isLoading={isSubmittingDepForm}>
                Deposit &amp; Borrow
              </Button>
            </HStack>
          </FormControl>
        </form>

        <form onSubmit={handleSubmitRepayForm(onRepayWithdraw)}>
          <FormControl isInvalid={errorsRepayForm.name}>
            <HStack spacing="0.5rem">
              <TokenAmountInputField
                name="collateral-withdraw"
                min={0}
                max={collateralBalance}
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
                placeholder={'USDm repay'}
                registerForm={registerRepayForm}
                setValueForm={setValueRepayForm}
                errorsForm={errorsRepayForm}
              />

              <Button type="submit" isLoading={isSubmittingRepayForm}>
                Repay &amp; Withdraw
              </Button>
            </HStack>
          </FormControl>
        </form>
      </AccordionPanel>
    </AccordionItem>
  );
}
