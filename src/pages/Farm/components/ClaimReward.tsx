import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Button,
  Flex,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import { getIconsFromTokenAddress } from '../../../chain-interaction/tokens';
import { ParsedStakingMetadata } from '../../../chain-interaction/views/contracts';
import { useClaimReward } from '../../../chain-interaction/views/staking';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { parseFloatCurrencyValue } from '../../../utils';

export default function ClaimReward({
  token,
  stakeMeta,
}: React.PropsWithChildren<{
  token: Token;
  stakeMeta: ParsedStakingMetadata;
}>) {
  const { sendClaim, claimState } = useClaimReward();

  const buttonDisabled = stakeMeta?.vested?.isZero();
  console.log(buttonDisabled);

  const timeDelta = (Date.now() - stakeMeta.vestingStart.getTime()) / 1000;

  const vested =
    (parseFloatCurrencyValue(stakeMeta.rewards) * timeDelta) /
    (60 * 24 * 60 * 60);

  return (
    <Flex flexDirection={'column'} justify={'start'}>
      <VStack
        flexDirection={'column'}
        textAlign={'center'}
        alignItems={'center'}
        justifyContent={'space-between'}
        height={'full'}
        width={'full'}
      >
        <Text>
          Vested Reward{' '}
          <Link href="https://moremoney.gitbook.io/docs/earn-with-moremoney/money3crv#vesting">
            <InfoOutlineIcon />
          </Link>
        </Text>
        <HStack textAlign={'center'}>
          <Avatar
            size={'sm'}
            src={getIconsFromTokenAddress(token.address)[0]}
          />
          <Text>{vested.toFixed(2)} MORE</Text>
        </HStack>
        <Button
          isDisabled={stakeMeta.earned.add(stakeMeta.rewards).isZero()}
          type="submit"
          w={'100%'}
          onClick={sendClaim}
        >
          {stakeMeta.earned.gt(stakeMeta.rewards.mul(2))
            ? `Vest ${stakeMeta.earned.format({
              fixedPrecisionDigits: 0,
              useFixedPrecision: true,
            })}`
            : 'Claim'}
        </Button>
        <TransactionErrorDialog state={claimState} title={'Claim Reward'} />
      </VStack>
    </Flex>
  );
}
