import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useAddresses } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import {
  useGetStakedMoreVeMore,
  useUnstakeVeMoreForMore,
} from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import { parseFloatNoNaN } from '../../../utils';

export function UnstakeMoreVeMore(props: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const veMoreToken = getTokenFromAddress(chainId, useAddresses().VeMore);
  const account = React.useContext(UserAddressContext);
  const veMoreStaked = useGetStakedMoreVeMore(account!);

  const veMoreBalance = new CurrencyValue(
    veMoreToken,
    BigNumber.from(veMoreStaked)
  );

  const token = getTokenFromAddress(chainId, veMoreToken.address);

  const { sendUnstake, unstakeState } = useUnstakeVeMoreForMore();

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  const [veMoreUnstakeInput] = watch(['veMore-unstake']);

  function onStakeMore(data: { [x: string]: any }) {
    console.log('data', data);
    sendUnstake(token, data['veMore-unstake']);
  }

  const stakeMoreDisabled = veMoreBalance.isZero();
  const unstakeMoreButtonDisabled = parseFloatNoNaN(veMoreUnstakeInput) === 0;

  return (
    <form onSubmit={handleSubmitDepForm(onStakeMore)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
          >
            Unstake VeMore
          </Text>
        </Box>
        <TokenAmountInputField
          name="veMore-unstake"
          max={veMoreBalance}
          isDisabled={stakeMoreDisabled}
          placeholder={'veMore to unstake'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
          width="full"
        />
      </Flex>
      <TransactionErrorDialog state={unstakeState} title={'Unstake veMore'} />
      <Box marginTop={'10px'}>
        <Button
          variant={unstakeMoreButtonDisabled ? 'submit' : 'submit-primary'}
          type="submit"
          isLoading={isSubmittingDepForm}
          isDisabled={unstakeMoreButtonDisabled}
        >
          Unstake VeMore
        </Button>
      </Box>
      {props.children}
    </form>
  );
}
