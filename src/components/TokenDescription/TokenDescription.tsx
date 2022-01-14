import { HStack, AvatarGroup, Avatar, Text, Flex } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import {
  getAuxIconFromTokenAddress,
  getIconsFromTokenAddress,
} from '../../chain-interaction/tokens';

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
  const auxIcon = getAuxIconFromTokenAddress(token?.address ?? '');

  return token ? (
    <HStack spacing="1">
      <Flex>
        <AvatarGroup size={targetSize} max={2}>
          {(getIconsFromTokenAddress(token.address) ?? []).map((iconUrl, i) => (
            <Avatar src={iconUrl} key={i + 1} />
          ))}
        </AvatarGroup>
        &nbsp;
        <Text size={textSize} isTruncated>
          {token.ticker}
        </Text>
        &nbsp;
        {auxIcon ? (
          <>
            (
            <AvatarGroup size={targetSize} max={2}>
              <Avatar src={auxIcon} />
            </AvatarGroup>
            )
          </>
        ) : undefined}
      </Flex>
    </HStack>
  ) : (
    <Text>Loading token information</Text>
  );
}
