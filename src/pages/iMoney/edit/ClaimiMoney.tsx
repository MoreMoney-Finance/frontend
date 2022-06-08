import { Button, Flex, Text } from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useAddresses, useStable } from '../../../chain-interaction/contracts';
import {
  useClaimIMoney,
  useViewPendingReward,
} from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import { WalletBalancesContext } from '../../../contexts/WalletBalancesContext';

export default function ClaimIMoney({
  children,
}: React.PropsWithChildren<any>) {
  const balanceCtx = React.useContext(WalletBalancesContext);
  const account = React.useContext(UserAddressContext);
  const iMoneyAddress = useAddresses().StableLending2InterestForwarder;
  const stable = useStable();
  const iMoneyBalance =
    balanceCtx.get(iMoneyAddress) ??
    new CurrencyValue(stable, BigNumber.from('0'));

  const { sendClaim, claimState } = useClaimIMoney();

  const pendingRewards = new CurrencyValue(
    stable,
    useViewPendingReward(account!, BigNumber.from(0))
  );

  return (
    <>
      <TransactionErrorDialog state={claimState} title="Claim iMoney" />
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
            Staked MONEY
          </Text>
          <Flex direction={'column'} justifyContent={'flex-start'}>
            <Text variant="bodyHuge">{iMoneyBalance.format()}</Text>
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
            <Text variant="bodyHuge">{pendingRewards.format()}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Button variant={'submit-primary'} type="submit" onClick={sendClaim}>
        Claim
      </Button>
      {children}
    </>
  );
}
