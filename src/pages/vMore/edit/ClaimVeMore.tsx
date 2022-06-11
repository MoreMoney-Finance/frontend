import { Button, Flex, Text } from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useAddresses } from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import {
  useClaimableVeMoreToken,
  useClaimVeMore,
  useGetStakedMoreVeMoreToken,
} from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { UserAddressContext } from '../../../contexts/UserAddressContext';

export default function ClaimVeMore({
  children,
}: React.PropsWithChildren<any>) {
  const { chainId } = useEthers();
  const account = React.useContext(UserAddressContext);
  const veMoreTokenToken = getTokenFromAddress(
    chainId,
    useAddresses().VeMoreToken
  );
  const moreToken = getTokenFromAddress(chainId, useAddresses().MoreToken);

  const stakedMore = useGetStakedMoreVeMoreToken(account!);
  const claimableVeMoreToken = useClaimableVeMoreToken(account!);

  const stakedMoreBalance = new CurrencyValue(
    moreToken,
    BigNumber.from(stakedMore)
  );
  const claimableVeMoreTokenBalance = new CurrencyValue(
    veMoreTokenToken,
    BigNumber.from(claimableVeMoreToken)
  );

  const { sendClaim, claimState } = useClaimVeMore();

  const disabledButton = BigNumber.from(claimableVeMoreToken).isZero();

  return (
    <>
      <TransactionErrorDialog state={claimState} title="Claim VeMoreToken" />
      <Flex
        flexDirection={['column', 'column', 'row']}
        height={'100%'}
        marginBottom="22px"
      >
        <Flex
          flexDirection={'column'}
          alignItems="flex-start"
          width={['100%', '100%', '50%']}
        >
          <Text fontSize={'md'} color={'gray.400'} marginBottom="12px">
            Staked MORE
          </Text>
          <Flex direction={'column'} justifyContent={'flex-start'}>
            <Text variant="bodyHuge">{stakedMoreBalance.format()}</Text>
          </Flex>
        </Flex>

        <Flex
          flexDirection={'column'}
          alignItems="flex-start"
          marginLeft={['0px', '0px', '70px']}
        >
          <Text fontSize={'md'} color={'gray.400'} marginBottom="12px">
            Claimable
          </Text>
          <Flex direction={'column'} justifyContent={'flex-start'}>
            <Text variant="bodyHuge">
              {claimableVeMoreTokenBalance.format()}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Button
        variant={disabledButton ? 'submit' : 'submit-primary'}
        type="submit"
        onClick={sendClaim}
        disabled={disabledButton}
      >
        Claim
      </Button>
      {children}
    </>
  );
}
