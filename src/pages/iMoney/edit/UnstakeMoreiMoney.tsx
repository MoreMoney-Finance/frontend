import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useAddresses, useStable } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import { useWithdrawIMoney } from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';
import { WalletBalancesContext } from '../../../contexts/WalletBalancesContext';
import { parseFloatNoNaN } from '../../../utils';

export function UnstakeMoreIMoney(props: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const iMoneyToken = getTokenFromAddress(chainId, useAddresses().VeMoreToken);
  const balanceCtx = React.useContext(WalletBalancesContext);
  const iMoneyAddress = useAddresses().StableLending2InterestForwarder;
  const stable = useStable();
  const iMoneyBalance =
    balanceCtx.get(iMoneyAddress) ??
    new CurrencyValue(stable, BigNumber.from('0'));

  const token = getTokenFromAddress(chainId, iMoneyToken.address);

  const { sendWithdrawIMoney: sendUnstake, withdrawState: unstakeState } =
    useWithdrawIMoney();

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  const [veMoreTokenUnstakeInput] = watch(['imoney-unstake']);

  function onStakeMore(data: { [x: string]: any }) {
    console.log('data', data);
    sendUnstake(token, data['imoney-unstake']);
  }

  const stakeMoreDisabled = iMoneyBalance.isZero();
  const unstakeMoreButtonDisabled =
    parseFloatNoNaN(veMoreTokenUnstakeInput) === 0;

  return (
    <form onSubmit={handleSubmitDepForm(onStakeMore)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
          >
            Unstake MONEY
          </Text>
        </Box>
        <TokenAmountInputField
          name="imoney-unstake"
          max={iMoneyBalance}
          isDisabled={stakeMoreDisabled}
          placeholder={'MONEY to unstake'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
          width="full"
        />
      </Flex>
      <TransactionErrorDialog state={unstakeState} title={'Unstake MONEY'} />
      <Box marginTop={'10px'}>
        <Button
          variant={unstakeMoreButtonDisabled ? 'submit' : 'submit-primary'}
          type="submit"
          isLoading={isSubmittingDepForm}
          isDisabled={unstakeMoreButtonDisabled}
        >
          Unstake MONEY
        </Button>
      </Box>
      {props.children}
    </form>
  );
}
