import { Avatar, Button, Flex, Text } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';
import { getIconsFromTokenAddress } from '../../chain-interaction/tokens';

export default function ClaimReward({
  token,
  stratMeta,
}: React.PropsWithChildren<{
  token: Token;
  stratMeta: ParsedStratMetaRow;
}>) {
  function onClaim() {
    console.log(stratMeta);
  }

  return (
    <Flex
      flexDirection={'column'}
      textAlign={'center'}
      alignItems={'center'}
      justifyContent={'space-between'}
      height={'full'}
    >
      <Text>Reward</Text>
      <Flex textAlign={'center'}>
        <Avatar size={'sm'} src={getIconsFromTokenAddress(token.address)[0]} />
        <Text>&nbsp; 200.15 {token.name}</Text>
      </Flex>
      <Button type="submit" w={'50%'} onClick={onClaim}>
        Claim
      </Button>
    </Flex>
  );
}
