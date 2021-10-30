import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/accordion';
import { Avatar, AvatarGroup } from '@chakra-ui/avatar';
import {
  Button,
  FormControl,
  HStack,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
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

export function IsolatedTranche(
  params: React.PropsWithChildren<
    ParsedStratMetaRow | (ParsedStratMetaRow & ParsedPositionMetaRow)
  >
) {
  const { token, APY, strategyName, strategyAddress, debtCeiling } = params;
  // todo: get positions by owner (either to context or toplevel hook and merge data in isolatedlending)
  // either merge or query the data stucture
  // hand that to form.
  // next up display balances somehow
  // sendRepayWithdraw

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

  const withdrawMax =
    'collateral' in params && params.collateral
      ? parseFloat(params.collateral.format())
      : 0;
  const repayMax = 'debt' in params ? parseFloat(params.debt.format()) : 0;

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
              <NumberInput min={0} max={depositMax}>
                <NumberInputField
                  {...registerDepForm('collateral-deposit', {
                    required: 'This is required',
                    min: 0,
                    max: depositMax,
                  })}
                  placeholder={'Collateral deposit'}
                ></NumberInputField>

                <InputRightElement width="4.5rem">
                  <Button
                    size="xs"
                    onClick={() => setValueDepForm('collateral-deposit', depositMax)}
                  >
                    MAX
                  </Button>
                </InputRightElement>
              </NumberInput>

              <NumberInput min={0}>
                <NumberInputField
                  {...registerDepForm('usdm-borrow', {
                    required: 'This is required',
                    min: 0,
                  })}
                  placeholder={'USDm borrow'}
                ></NumberInputField>
              </NumberInput>

              <Button type="submit" isLoading={isSubmittingDepForm}>
                Deposit &amp; Borrow
              </Button>
            </HStack>
          </FormControl>
        </form>

        <form onSubmit={handleSubmitRepayForm(onRepayWithdraw)}>
          <FormControl isInvalid={errorsRepayForm.name}>
            <HStack spacing="0.5rem">
              <NumberInput min={0} max={withdrawMax}>
                <NumberInputField
                  {...registerRepayForm('collateral-withdraw', {
                    required: 'This is required',
                    min: 0,
                    max: withdrawMax,
                  })}
                  placeholder={'Collateral withdraw'}
                ></NumberInputField>

                <InputRightElement width="4.5rem">
                  <Button
                    size="xs"
                    onClick={() => setValueRepayForm('collateral-withdraw', withdrawMax)}
                  >
                    MAX
                  </Button>
                </InputRightElement>
              </NumberInput>

              <NumberInput min={0} max={repayMax}>
                <NumberInputField
                  {...registerRepayForm('usdm-repay', {
                    required: 'This is required',
                    min: 0,
                    max: repayMax,
                  })}
                  placeholder={'USDm repay'}
                ></NumberInputField>

                <InputRightElement width="4.5rem">
                  <Button
                    size="xs"
                    onClick={() => setValueRepayForm('collateral-withdraw', repayMax)}
                  >
                    MAX
                  </Button>
                </InputRightElement>
              </NumberInput>

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
