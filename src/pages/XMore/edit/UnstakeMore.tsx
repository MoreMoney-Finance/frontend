import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { TxStatus, useAddresses } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import {
  useApproveTrans,
  useUnstakeMore,
} from '../../../chain-interaction/transactions';
import { EnsureWalletConnected } from '../../../components/account/EnsureWalletConnected';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import {
  useWalletBalance,
  WalletBalancesContext,
} from '../../../contexts/WalletBalancesContext';
import { parseFloatNoNaN } from '../../../utils';

export function UnstakeMore(props: React.PropsWithChildren<unknown>) {
  const xMoreContract = useAddresses().xMore;
  const balanceCtx = React.useContext(WalletBalancesContext);
  const xMoreToken = useAddresses().xMore;
  const account = React.useContext(UserAddressContext);
  const { chainId } = useEthers();

  const token = getTokenFromAddress(chainId, xMoreToken);
  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  const { sendUnstake, unstakeState } = useUnstakeMore();

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, xMoreContract) ??
      BigNumber.from('0')
  );
  const { approveState, sendApprove } = useApproveTrans(token.address);

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  const [xmoreUnstakeInput] = watch(['xmore-unstake']);

  function onStakeMore(data: { [x: string]: any }) {
    console.log('data', data);
    sendUnstake(token, data['xmore-unstake']);
  }

  const stakeMoreDisabled = balanceCtx.get(xMoreToken)?.isZero();
  const stakeMoreButtonDisabled = parseFloatNoNaN(xmoreUnstakeInput) === 0;

  return (
    <form onSubmit={handleSubmitDepForm(onStakeMore)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
          >
            Unstake MORE
          </Text>
        </Box>
        <TokenAmountInputField
          name="xmore-unstake"
          max={balanceCtx.get(xMoreToken)}
          isDisabled={stakeMoreDisabled}
          placeholder={'More to unstake'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
          width="full"
        />
      </Flex>
      <TransactionErrorDialog state={approveState} title={'Approve'} />
      <TransactionErrorDialog state={unstakeState} title={'Unstake MORE'} />
      <Box marginTop={'10px'}>
        {allowance.gt(walletBalance) === false ? (
          <EnsureWalletConnected>
            <Button
              variant={'submit-primary'}
              onClick={() => sendApprove(xMoreContract)}
              isLoading={
                approveState.status == TxStatus.SUCCESS &&
                allowance.gt(walletBalance) === false
              }
            >
              Approve {token.name}{' '}
            </Button>
          </EnsureWalletConnected>
        ) : (
          <Button
            variant={stakeMoreButtonDisabled ? 'submit' : 'submit-primary'}
            type="submit"
            isLoading={isSubmittingDepForm}
            isDisabled={stakeMoreButtonDisabled}
          >
            Stake MORE
          </Button>
        )}
      </Box>
      {props.children}
    </form>
  );
}
