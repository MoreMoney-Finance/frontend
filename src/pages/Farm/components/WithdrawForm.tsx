import { HStack, Box, Button, Flex, Text } from '@chakra-ui/react';
import {
  CurrencyValue,
  Token,
  TransactionStatus,
  useEtherBalance,
  useEthers,
} from '@usedapp/core';
import { BigNumber } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import * as React from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { EnsureWalletConnected } from '../../../components/account/EnsureWalletConnected';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';
import { WNATIVE_ADDRESS } from '../../../constants/addresses';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import { parseFloatNoNaN } from '../../../utils';

export default function WithdrawForm({
  token,
  stakedBalance,
  sendWithdraw,
  withdrawState,
}: React.PropsWithChildren<{
  token: Token;
  stakedBalance: CurrencyValue;
  sendWithdraw: (token: Token, amount: string | number) => Promise<any>;
  withdrawState: TransactionStatus;
}>) {
  // const token = stakeMeta.stakingToken;

  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);

  const isNativeToken =
    getAddress(WNATIVE_ADDRESS[chainId!]) === getAddress(token.address);

  const etherBalance = useEtherBalance(account);

  const nativeTokenBalance = etherBalance
    ? new CurrencyValue(token, etherBalance)
    : new CurrencyValue(token, BigNumber.from('0'));

  const walletBalance =
    stakedBalance ?? new CurrencyValue(token, BigNumber.from('0'));

  // const { sendWithdraw, withdrawState } = useWithdraw();

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  function onWithdraw(data: { [x: string]: any }) {
    // console.log('withdraw from farm', data, position);
    sendWithdraw(token, data['amount-withdraw']);
    setValueDepForm('amount-withdraw', '');
  }

  const [withdrawInput] = watch(['amount-withdraw']);

  const confirmButtonEnabled = parseFloatNoNaN(withdrawInput) > 0;

  const depositBorrowDisabled = isNativeToken
    ? nativeTokenBalance.isZero()
    : walletBalance.isZero();
  const inputStyle = {
    bg: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(2px)',
    borderRadius: '12px',
    justifyContent: 'space-between',
  };
  return (
    <form onSubmit={handleSubmitDepForm(onWithdraw)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Flex
          w={'full'}
          justifyContent="space-between"
          textAlign={'start'}
          marginBottom={'16px'}
        >
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
            fontSize="16px"
          >
            Withdraw
          </Text>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
            fontSize="16px"
            cursor="pointer"
            onClick={() => {
              setValueDepForm(
                'amount-withdraw',
                walletBalance.format({
                  significantDigits: Infinity,
                  prefix: '',
                  suffix: '',
                  thousandSeparator: '',
                  decimalSeparator: '.',
                }),
                { shouldDirty: true, shouldTouch: true }
              );
            }}
          >
            Balance: {walletBalance.format({ suffix: '' })}
          </Text>
        </Flex>
        <HStack {...inputStyle}>
          <TokenAmountInputField
            name="amount-withdraw"
            width="full"
            // max={walletBalance}
            isDisabled={depositBorrowDisabled}
            placeholder={'Withdraw'}
            registerForm={registerDepForm}
            setValueForm={setValueDepForm}
            errorsForm={errorsDepForm}
          />
        </HStack>
      </Flex>

      <TransactionErrorDialog state={withdrawState} title={'Withdraw Action'} />

      <Box marginTop={'10px'}>
        <EnsureWalletConnected>
          <Button
            type="submit"
            width={'full'}
            variant={!confirmButtonEnabled ? 'submit' : 'submit-primary'}
            isLoading={isSubmittingDepForm}
            isDisabled={!confirmButtonEnabled}
          >
            Withdraw
          </Button>
        </EnsureWalletConnected>
      </Box>
    </form>
  );
}
