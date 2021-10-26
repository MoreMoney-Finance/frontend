import {
  Button,
  FormControl,
  InputRightElement,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import {
  ChainId,
  CurrencyValue,
  NativeCurrency,
  useEtherBalance,
  useEthers,
} from '@usedapp/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useWrapNative } from '../chain-interaction/transactions';

export function WrapNativeCurrency() {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const { account, chainId } = useEthers();
  const bignumBalance = useEtherBalance(account) ?? BigNumber.from('0');
  // TODO change from localhost to sensible default
  const ethBalance = new CurrencyValue(
    new NativeCurrency('Native currency', 'BLANK', chainId ?? ChainId.Hardhat),
    bignumBalance
  );

  const { sendWrapNative /*wrapNativeState*/ } = useWrapNative();
  function onWrap(data: { [x: string]: any }) {
    console.log(data);
    sendWrapNative(data['wrap-amount']);
  }
  return (
    <form onSubmit={handleSubmit(onWrap)}>
      <FormControl isInvalid={errors.name}>
        <NumberInput min={0} max={parseFloat(ethBalance.format())}>
          <NumberInputField
            {...register('wrap-amount', {
              required: 'This is required',
              min: 0,
              max: parseFloat(ethBalance.format()),
            })}
            placeholder={'Amount to wrap'}
          ></NumberInputField>
          <InputRightElement width="4.5rem">
            <Button
              size="xs"
              onClick={() => setValue('wrap-amount', ethBalance.format())}
            >
              MAX
            </Button>
          </InputRightElement>
        </NumberInput>

        <Button type="submit" isLoading={isSubmitting}>
          Wrap native currency
        </Button>
      </FormControl>
    </form>
  );
}
