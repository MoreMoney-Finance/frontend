import { Box, Button, Flex, Text } from '@chakra-ui/react';
import {
  CurrencyValue,
  useEtherBalance,
  useEthers,
  useTokenAllowance,
} from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  ParsedStakingMetadata,
  useAddresses,
  TxStatus,
} from '../../../chain-interaction/contracts';
import {
  useApproveTrans,
  useStake,
} from '../../../chain-interaction/transactions';
import { EnsureWalletConnected } from '../../../components/account/EnsureWalletConnected';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';
import { WNATIVE_ADDRESS } from '../../../constants/addresses';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import { useWalletBalance } from '../../../contexts/WalletBalancesContext';
import { parseFloatNoNaN } from '../../../utils';

export default function DepositForm({
  stakeMeta,
}: React.PropsWithChildren<{
  stakeMeta: ParsedStakingMetadata;
}>) {
  const token = stakeMeta.stakingToken;
  const stakingAddress = useAddresses().CurvePoolRewards;
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);

  const isNativeToken = WNATIVE_ADDRESS[chainId!] === token.address;

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, stakingAddress) ??
      BigNumber.from('0')
  );
  const etherBalance = useEtherBalance(account);

  const nativeTokenBalance = etherBalance
    ? new CurrencyValue(token, etherBalance)
    : new CurrencyValue(token, BigNumber.from('0'));

  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  const { approveState, sendApprove } = useApproveTrans(token.address);

  const { sendStake, stakeState } = useStake();

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
        {allowance.gt(walletBalance) === false && isNativeToken === false ? (
          <EnsureWalletConnected>
            <Button
              onClick={() => sendApprove(stakingAddress)}
              width={'full'}
              variant={'submit-primary'}
              isLoading={
                approveState.status == TxStatus.SUCCESS &&
                allowance.gt(walletBalance) === false
              }
            >
              Approve
            </Button>
          </EnsureWalletConnected>
        ) : (
          <Button
            type="submit"
            width={'full'}
            variant={!confirmButtonEnabled ? 'submit' : 'submit-primary'}
            isLoading={isSubmittingDepForm}
            isDisabled={!confirmButtonEnabled}
          >
            Confirm
          </Button>
        )}
      </Box>
    </form>
  );
}
