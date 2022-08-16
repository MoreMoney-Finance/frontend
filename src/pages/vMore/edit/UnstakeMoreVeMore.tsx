import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useAddresses } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import {
  useGetStakedMoreVeMoreToken,
  useUnstakeVeMoreTokenForMore,
} from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import WarningMessage from '../../../components/notifications/WarningMessage';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import { parseFloatNoNaN } from '../../../utils';

export function UnstakeMoreVeMore(props: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const veMoreTokenToken = getTokenFromAddress(
    chainId,
    useAddresses().VeMoreToken
  );
  const account = React.useContext(UserAddressContext);
  const veMoreTokenStaked = useGetStakedMoreVeMoreToken(account!);

  const veMoreTokenBalance = new CurrencyValue(
    veMoreTokenToken,
    BigNumber.from(veMoreTokenStaked)
  );

  const token = getTokenFromAddress(chainId, veMoreTokenToken.address);

  const { sendUnstake, unstakeState } = useUnstakeVeMoreTokenForMore();

  const {
    handleSubmit: handleSubmitDepForm,
    register: registerDepForm,
    setValue: setValueDepForm,
    formState: { errors: errorsDepForm, isSubmitting: isSubmittingDepForm },
    watch,
  } = useForm();

  const [veMoreTokenUnstakeInput] = watch(['veMoreToken-unstake']);

  function onStakeMore(data: { [x: string]: any }) {
    console.log('data', data);
    sendUnstake(token, data['veMoreToken-unstake']);
  }

  const stakeMoreDisabled = veMoreTokenBalance.isZero();
  const unstakeMoreButtonDisabled =
    parseFloatNoNaN(veMoreTokenUnstakeInput) === 0;

  const showWarning = veMoreTokenUnstakeInput > 0;

  return (
    <form onSubmit={handleSubmitDepForm(onStakeMore)}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <WarningMessage
            message="You will lose all of your accumulated veMORE and pending veMORE after unstaking MORE."
            isOpen={showWarning}
          >
            <Text
              variant={'bodyExtraSmall'}
              color={'whiteAlpha.600'}
              lineHeight={'14px'}
            >
              Unstake More
            </Text>
          </WarningMessage>
        </Box>
        <TokenAmountInputField
          name="veMoreToken-unstake"
          max={veMoreTokenBalance}
          isDisabled={stakeMoreDisabled}
          placeholder={'MORE to unstake'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
          errorsForm={errorsDepForm}
          width="full"
        />
      </Flex>
      <TransactionErrorDialog state={unstakeState} title={'Unstake MORE'} />
      <Box marginTop={'10px'}>
        <Button
          variant={unstakeMoreButtonDisabled ? 'submit' : 'submit-primary'}
          type="submit"
          isLoading={isSubmittingDepForm}
          isDisabled={unstakeMoreButtonDisabled}
        >
          Unstake MORE
        </Button>
      </Box>
      {props.children}
    </form>
  );
}
