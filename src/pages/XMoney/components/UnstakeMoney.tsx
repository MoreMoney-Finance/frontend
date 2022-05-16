import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useAddresses } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import { useUnstakeMore } from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';
import { WalletBalancesContext } from '../../../contexts/WalletBalancesContext';
import { parseFloatNoNaN } from '../../../utils';

export function UnstakeMoney(props: React.PropsWithChildren<unknown>) {
  const balanceCtx = React.useContext(WalletBalancesContext);
  const xMoney = useAddresses().xMoney;
  const { chainId } = useEthers();

  const token = getTokenFromAddress(chainId, xMoney);

  const { sendUnstake, unstakeState } = useUnstakeMore();

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

  const stakeMoreDisabled = balanceCtx.get(xMoney)?.isZero();
  const unstakeMoreButtonDisabled = parseFloatNoNaN(xmoreUnstakeInput) === 0;

  return (
    <form onSubmit={handleSubmitDepForm(onStakeMore)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
          >
            Unstake xMORE
          </Text>
        </Box>
        <TokenAmountInputField
          name="xmore-unstake"
          max={balanceCtx.get(xMoney)}
          isDisabled={stakeMoreDisabled}
          placeholder={'xMORE to unstake'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
          width="full"
        />
      </Flex>
      <TransactionErrorDialog state={unstakeState} title={'Unstake xMORE'} />
      <Box marginTop={'10px'}>
        <Button
          variant={unstakeMoreButtonDisabled ? 'submit' : 'submit-primary'}
          type="submit"
          isLoading={isSubmittingDepForm}
          isDisabled={unstakeMoreButtonDisabled}
        >
          Unstake xMORE
        </Button>
      </Box>
      {props.children}
    </form>
  );
}
