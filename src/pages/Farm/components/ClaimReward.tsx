import { Avatar, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import { getIconsFromTokenAddress } from '../../../chain-interaction/tokens';
import { useClaimReward } from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';

export default function ClaimReward({
  token,
  rewards,
}: //   stakeMeta,
React.PropsWithChildren<{
  token: Token;
  rewards: number;
  //   stakeMeta: ParsedStakingMetadata;
}>) {
  const { sendClaim, claimState } = useClaimReward();

  //   const buttonDisabled = stakeMeta?.vested?.isZero();
  //   console.log(buttonDisabled);

  //   const timeDelta = (Date.now() - stakeMeta.vestingStart.getTime()) / 1000;

  //   const vested =
  //     (parseFloatCurrencyValue(stakeMeta.rewards) * timeDelta) /
  //     (60 * 24 * 60 * 60);

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
        <Text>Claim Reward </Text>
        <HStack textAlign={'center'}>
          <Avatar
            size={'sm'}
            src={getIconsFromTokenAddress(token.address)[0]}
          />
          {/* <Text>{vested.toFixed(2)} MORE</Text> */}
          <Text>{rewards} MORE</Text>
        </HStack>
        <Button
          //   isDisabled={stakeMeta.earned.add(stakeMeta.rewards).isZero()}
          type="submit"
          w={'100%'}
          variant="submit-primary"
          onClick={sendClaim}
        >
          {'Claim'}
        </Button>
        <TransactionErrorDialog state={claimState} title={'Claim Reward'} />
      </VStack>
    </Flex>
  );
}
