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
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { addressIcons } from '../chain-interaction/tokens';
import { useWalletBalance } from './WalletBalancesContext';
import { useForm } from 'react-hook-form';
import {
  useApproveTrans,
  useMintDepositBorrowTrans,
} from '../chain-interaction/transactions';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';

export function IsolatedTranche({
  token,
  APY,
  strategyName,
  strategyAddress,
  debtCeiling,
}: React.PropsWithChildren<ParsedStratMetaRow>) {

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const { sendMintDepositBorrow /*depositBorrowState*/ } =
    useMintDepositBorrowTrans();

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
        <form onSubmit={handleSubmit(onDepositBorrow)}>
          <FormControl isInvalid={errors.name}>
            <HStack spacing="0.5rem">

              <NumberInput min={0} max={depositMax}>
                <NumberInputField
                  {...register('collateral-deposit', {
                    required: 'This is required',
                    min: 0,
                    max: depositMax,
                  })}
                  placeholder={'Collateral deposit'}
                ></NumberInputField>

                <InputRightElement width="4.5rem">
                  <Button
                    size="xs"
                    onClick={() => setValue('collateral-deposit', depositMax)}
                  >
                    MAX
                  </Button>
                </InputRightElement>

              </NumberInput>

              <NumberInput min={0}>
                <NumberInputField
                  {...register('usdm-borrow', {
                    required: 'This is required',
                    min: 0,
                  })}
                  placeholder={'USDm borrow'}
                ></NumberInputField>
              </NumberInput>

              <Button type="submit" isLoading={isSubmitting}>
                Deposit &amp; Borrow
              </Button>

            </HStack>
          </FormControl>
        </form>
      </AccordionPanel>
    </AccordionItem>
  );
}
