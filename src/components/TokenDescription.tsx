import { HStack, AvatarGroup, Avatar, Text, Flex } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { getIconsFromTokenAddress } from '../chain-interaction/tokens';

export function TokenDescription({
  token,
  iconSize,
  textSize,
}: {
  token?: Token;
  iconSize?: string;
  textSize?: string;
}) {
  const targetSize = iconSize ?? 'xs';
  return token ? (
    <HStack spacing="1">
      <Link to={`/token/${token.address}`}>
        <Flex>
          <AvatarGroup size={targetSize} max={2}>
            {(getIconsFromTokenAddress(token.address) ?? []).map(
              (iconUrl, i) => (
                <Avatar src={iconUrl} key={i + 1} />
              )
            )}
          </AvatarGroup>
          <Text size={textSize}>{token.name}</Text>
        </Flex>
      </Link>
    </HStack>
  ) : (
    <Text>Loading token information</Text>
  );
}
