import { Avatar, Button, HStack, VStack, Text } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import { ParsedStakingMetadata } from '../../../chain-interaction/contracts';
import { getIconsFromTokenAddress } from '../../../chain-interaction/tokens';
import { useClaimReward } from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { parseFloatNoNaN } from '../../../utils';

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
    (parseFloatNoNaN(
      stakeMeta.rewards.format({
        suffix: '',
        thousandSeparator: '',
        decimalSeparator: '.',
      })
    ) *
      timeDelta) /
    (60 * 24 * 60 * 60);

  return (
    <VStack
      flexDirection={'column'}
      textAlign={'center'}
      alignItems={'center'}
      justifyContent={'space-between'}
      height={'full'}
    >
      <Text>Vested Reward</Text>
      <HStack textAlign={'center'}>
        <Avatar size={'sm'} src={getIconsFromTokenAddress(token.address)[0]} />
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
  );
}
