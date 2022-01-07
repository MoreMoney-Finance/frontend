import { Button, FormControl } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import {
  ChainId,
  CurrencyValue,
  NativeCurrency,
  useEtherBalance,
  useEthers,
} from '@usedapp/core';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useWrapNative } from '../chain-interaction/transactions';
import { UserAddressContext } from '../contexts/UserAddressContext';
import { EnsureWalletConnected } from './EnsureWalletConnected';
import { StatusTrackModal } from './StatusTrackModal';
import { TokenAmountInputField } from './TokenAmountInputField';

export function WrapNativeCurrency() {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);
  const bignumBalance = useEtherBalance(account) ?? BigNumber.from('0');

  const ethBalance = new CurrencyValue(
    new NativeCurrency(
      'Native currency',
      'NATIVE',
      chainId ?? ChainId.Avalanche
    ),
    bignumBalance
  );

  const { sendWrapNative, wrapNativeState } = useWrapNative();

  function onWrap(data: { [x: string]: any }) {
    console.log(data);
    sendWrapNative(data['wrap-amount']);
  }

  return (
    <>
      <StatusTrackModal state={wrapNativeState} title={'Wrap Native'} />
      <form onSubmit={handleSubmit(onWrap)}>
        <FormControl isInvalid={errors.name}>
          <TokenAmountInputField
            name="wrap-amount"
            max={ethBalance}
            placeholder={'Native currency to wrap'}
            registerForm={register}
            setValueForm={setValue}
          />
          <EnsureWalletConnected>
            <Button type="submit" isLoading={isSubmitting}>
              Wrap native currency
            </Button>
          </EnsureWalletConnected>
        </FormControl>
      </form>
    </>
  );
}
