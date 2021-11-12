import { HStack, AvatarGroup, Avatar, Text } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import { addressIcons } from '../chain-interaction/tokens';

export function TokenDescription({ token }: { token: Token }) {
  return (
    <HStack spacing="0.25rem">
      <AvatarGroup size="xs" max={2}>
        {(addressIcons.get(token.address) ?? []).map((iconUrl, i) => (
          <Avatar src={iconUrl} key={i + 1} />
        ))}
      </AvatarGroup>

      <Text>{token.name}</Text>
    </HStack>
  );
}
