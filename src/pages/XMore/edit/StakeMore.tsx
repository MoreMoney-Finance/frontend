import { Box, Button, Flex, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { EnsureWalletConnected } from '../../../components/account/EnsureWalletConnected';
import { TokenAmountInputField } from '../../../components/tokens/TokenAmountInputField';

export function StakeMore(props: React.PropsWithChildren<unknown>) {
  const { register: registerDepForm, setValue: setValueDepForm } = useForm();

  return (
    <form>
      <Flex flexDirection={'column'} justify={'start'}>
        <Box w={'full'} textAlign={'start'} marginBottom={'6px'}>
          <Text
            variant={'bodyExtraSmall'}
            color={'whiteAlpha.600'}
            lineHeight={'14px'}
          >
            Stake MORE
          </Text>
        </Box>
        <TokenAmountInputField
          name="amount-stake"
          width="full"
          // max={'100'}
          isDisabled={false}
          placeholder={'Deposit'}
          registerForm={registerDepForm}
          setValueForm={setValueDepForm}
        />
      </Flex>
      <Box marginTop={'10px'}>
        <EnsureWalletConnected>
          <Button width={'full'} variant={'submit-primary'} isLoading={false}>
            Approve
          </Button>
        </EnsureWalletConnected>
      </Box>
      {props.children}
    </form>
  );
}
