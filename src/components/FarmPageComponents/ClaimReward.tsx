import { Avatar, Button, HStack, VStack, Text } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import { ParsedStakingMetadata } from '../../chain-interaction/contracts';
import { getIconsFromTokenAddress } from '../../chain-interaction/tokens';
import { useClaimReward } from '../../chain-interaction/transactions';
import { StatusTrackModal } from '../StatusTrackModal';

export default function ClaimReward({
  token,
  stakeMeta,
}: React.PropsWithChildren<{
  token: Token;
  stakeMeta: ParsedStakingMetadata;
}>) {
  const { sendClaim, claimState } = useClaimReward();

  return (
    <VStack
      flexDirection={'column'}
      textAlign={'center'}
      alignItems={'center'}
      justifyContent={'space-between'}
      height={'full'}
    >
      <Text>Reward</Text>
      <HStack textAlign={'center'}>
        <Avatar size={'sm'} src={getIconsFromTokenAddress(token.address)[0]} />
        <Text>&nbsp; {stakeMeta.vested.format({})}</Text>
      </HStack>
      <Button type="submit" w={'50%'} onClick={sendClaim}>
        Claim
      </Button>
      <StatusTrackModal state={claimState} title={'Claim Reward'} />
    </VStack>
  );
}
