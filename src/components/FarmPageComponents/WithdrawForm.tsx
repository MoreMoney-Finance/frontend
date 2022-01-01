import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { CurrencyValue, useEtherBalance, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  ParsedPositionMetaRow,
  ParsedStakingMetadata,
} from '../../chain-interaction/contracts';
import { useWithdraw } from '../../chain-interaction/transactions';
import { WNATIVE_ADDRESS } from '../../constants/addresses';
import { EnsureWalletConnected } from '../EnsureWalletConnected';
import { StatusTrackModal } from '../StatusTrackModal';
import { TokenAmountInputField } from '../TokenAmountInputField';

export default function WithdrawForm({
  position,
  stakeMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stakeMeta: ParsedStakingMetadata;
}>) {
  const token = stakeMeta.stakingToken;

  const { chainId, account } = useEthers();

  const isNativeToken = WNATIVE_ADDRESS[chainId!] === token.address;

  const etherBalance = useEtherBalance(account);

  const nativeTokenBalance = etherBalance
    ? new CurrencyValue(token, etherBalance)
    : new CurrencyValue(token, BigNumber.from('0'));

  const walletBalance =
    stakeMeta.stakedBalance ?? new CurrencyValue(token, BigNumber.from('0'));

  const { sendWithdraw, withdrawState } = useWithdraw();

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  function onWithdraw(data: { [x: string]: any }) {
    console.log('deposit borrow');
    console.log(data, position);
    sendWithdraw(token, data['amount-withdraw']);
    setValueDepForm('amount-withdraw', '');
  }

  const [withdrawInput] = watch(['amount-withdraw']);

  const confirmButtonDisabled = parseFloat(withdrawInput) > 0;

  const depositBorrowDisabled = isNativeToken
    ? nativeTokenBalance.isZero()
    : walletBalance.isZero();

  return (
    <form onSubmit={handleSubmitDepForm(onWithdraw)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
          >
            Withdraw
          </Text>
        </Box>
        <TokenAmountInputField
          name="amount-withdraw"
          width="full"
          max={walletBalance}
          isDisabled={depositBorrowDisabled}
          placeholder={'Withdraw'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
        />
      </Flex>

      <StatusTrackModal state={withdrawState} title={'Withdraw Action'} />

      <Box marginTop={'10px'}>
        <EnsureWalletConnected>
          <Button
            type="submit"
            width={'full'}
            variant={!confirmButtonDisabled ? 'submit' : 'submit-primary'}
            isLoading={isSubmittingDepForm}
            isDisabled={!confirmButtonDisabled}
          >
            Withdraw
          </Button>
        </EnsureWalletConnected>
      </Box>
    </form>
  );
}
