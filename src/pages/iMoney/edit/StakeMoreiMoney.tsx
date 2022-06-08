import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useAddresses } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import { useStakeIMoney } from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';
import { WalletBalancesContext } from '../../../contexts/WalletBalancesContext';
import { parseFloatNoNaN } from '../../../utils';

export function StakeMoreIMoney(props: React.PropsWithChildren<unknown>) {
  const balanceCtx = useContext(WalletBalancesContext);
  const moneyToken = useAddresses().Stablecoin;
  const { chainId } = useEthers();

  const token = getTokenFromAddress(chainId, moneyToken);

  const { sendDepositIMoney: sendStake, depositState: stakeState } =
    useStakeIMoney();

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  const [moreStakeInput] = watch(['money-stake']);

  function onStakeMore(data: { [x: string]: any }) {
    console.log('data', data);
    sendStake(token, data['money-stake']);
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
          name="money-stake"
          max={balanceCtx.get(moneyToken)}
          isDisabled={stakeMoreDisabled}
          placeholder={'MONEY to stake'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
          width="full"
        />
      </Flex>
      <TransactionErrorDialog state={stakeState} title={'Stake MONEY'} />
      <Box marginTop={'10px'}>
        <Button
          variant={stakeMoreButtonDisabled ? 'submit' : 'submit-primary'}
          type="submit"
          isLoading={isSubmittingDepForm}
          isDisabled={stakeMoreButtonDisabled}
        >
          Stake MONEY
        </Button>
      </Box>
      {props.children}
    </form>
  );
}
