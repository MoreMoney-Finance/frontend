import { Box, Button, Flex, Text } from '@chakra-ui/react';
import {
  CurrencyValue,
  Token,
  TransactionStatus,
  useEtherBalance,
  useEthers,
} from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { EnsureWalletConnected } from '../../../components/account/EnsureWalletConnected';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';
import { WNATIVE_ADDRESS } from '../../../constants/addresses';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import { useWalletBalance } from '../../../contexts/WalletBalancesContext';
import { parseFloatNoNaN } from '../../../utils';
import { useTokenAllowance } from '@usedapp/core';
import { useApproveTrans } from '../../../chain-interaction/transactions';
import { TxStatus } from '../../../chain-interaction/contracts';

export default function DepositForm({
  token,
  sendStake,
  stakingAddress,
  stakeState,
}: React.PropsWithChildren<{
  token: Token;
  stakingAddress?: string;
  sendStake: (token: Token, amount: string | number) => Promise<any>;
  stakeState: TransactionStatus;
}>) {
  // const token = stakeMeta.stakingToken;
  // const stakingAddress = useAddresses().CurvePoolRewards;
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);

  const isNativeToken = WNATIVE_ADDRESS[chainId!] === token.address;

  const etherBalance = useEtherBalance(account);

  const nativeTokenBalance = etherBalance
    ? new CurrencyValue(token, etherBalance)
    : new CurrencyValue(token, BigNumber.from('0'));

  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  const [depositInput] = watch(['amount-stake']);

  function onDeposit(data: { [x: string]: any }) {
    // console.log('data', data, position);
    sendStake(token, data['amount-stake']);
    setValueDepForm('amount-stake', '');
  }

  const confirmButtonEnabled = parseFloatNoNaN(depositInput) > 0;

  const depositBorrowDisabled = isNativeToken
    ? nativeTokenBalance.isZero()
    : walletBalance.isZero();

  const allowResult = useTokenAllowance(token.address, account, stakingAddress);
  const allowCV = new CurrencyValue(token, allowResult ?? BigNumber.from('0'));
  const allowance = token.address && account && stakingAddress && allowCV;

  const { approveState, sendApprove } = useApproveTrans(token.address);

  return (
    <form onSubmit={handleSubmitDepForm(onDeposit)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
          >
            Deposit
          </Text>
        </Box>
        <TokenAmountInputField
          name="amount-stake"
          width="full"
          max={isNativeToken ? nativeTokenBalance : walletBalance}
          isDisabled={depositBorrowDisabled}
          placeholder={'Deposit'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
        />
      </Flex>

      <TransactionErrorDialog state={approveState} title={'Approve'} />
      <TransactionErrorDialog state={stakeState} title={'Stake Action'} />

      <Box marginTop={'10px'}>
        {allowance && !allowance.gt(walletBalance) && !isNativeToken ? (
          <EnsureWalletConnected>
            <Button
              variant={'submit-primary'}
              onClick={() => sendApprove(stakingAddress)}
              isLoading={
                approveState.status === TxStatus.MINING &&
                allowance &&
                !allowance.gt(walletBalance)
              }
            >
              Approve {token.name}{' '}
            </Button>
          </EnsureWalletConnected>
        ) : (
          <EnsureWalletConnected>
            <Button
              type="submit"
              width={'full'}
              variant={!confirmButtonEnabled ? 'submit' : 'submit-primary'}
              isLoading={isSubmittingDepForm}
              isDisabled={!confirmButtonEnabled}
            >
              Confirm
            </Button>
          </EnsureWalletConnected>
        )}
      </Box>
    </form>
  );
}
