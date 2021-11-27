import { HStack, AvatarGroup, Avatar, Text, Flex } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { getIconsFromTokenAddress } from '../chain-interaction/tokens';

export function TokenDescription({ token }: { token: Token }) {
  return (
    <HStack spacing="0.25rem">
      <Link to={`/token/${token.address}`}>
        <Flex>
          <AvatarGroup size="xs" max={2}>
            {(getIconsFromTokenAddress(token.address) ?? []).map((iconUrl, i) => (
              <Avatar src={iconUrl} key={i + 1} />
            ))}
          </AvatarGroup>
          <Text>{token.name}</Text>
        </Flex>
      </Link>
    </HStack>
  );
}
