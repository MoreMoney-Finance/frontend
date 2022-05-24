import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { TxStatus, useAddresses } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import {
  useApproveTrans,
  useStakeMore,
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

export function StakeMoney(props: React.PropsWithChildren<unknown>) {
  const iMoneyContract = useAddresses().StableLending2InterestForwarder;
  const balanceCtx = useContext(WalletBalancesContext);
  const moneyToken = useAddresses().Stablecoin;
  const account = useContext(UserAddressContext);
  const { chainId } = useEthers();

  const token = getTokenFromAddress(chainId, moneyToken);
  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  const { sendStake, stakeState } = useStakeMore();

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, iMoneyContract) ??
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

  const [moreStakeInput] = watch(['more-stake']);

  function onStakeMore(data: { [x: string]: any }) {
    console.log('data', data);
    sendStake(token, data['more-stake']);
  }

  const stakeMoreDisabled = balanceCtx.get(moneyToken)?.isZero();
  const stakeMoreButtonDisabled = parseFloatNoNaN(moreStakeInput) === 0;

  return (
    <form onSubmit={handleSubmitDepForm(onStakeMore)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
          >
            Stake MONEY
          </Text>
        </Box>
        <TokenAmountInputField
          name="more-stake"
          max={balanceCtx.get(moneyToken)}
          isDisabled={stakeMoreDisabled}
          placeholder={'MONEY to stake'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
          width="full"
        />
      </Flex>
      <TransactionErrorDialog state={approveState} title={'Approve'} />
      <TransactionErrorDialog state={stakeState} title={'Stake MORE'} />
      <Box marginTop={'10px'}>
        {allowance.gt(walletBalance) === false ? (
          <EnsureWalletConnected>
            <Button
              variant={'submit-primary'}
              onClick={() => sendApprove(iMoneyContract)}
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
