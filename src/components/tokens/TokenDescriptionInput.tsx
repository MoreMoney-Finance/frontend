import { HStack, AvatarGroup, Avatar, Text, Flex } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import {
  getAuxIconFromTokenAddress,
  getIconsFromTokenAddress,
} from '../../chain-interaction/tokens';
import { deprecatedTokenList } from '../../constants/deprecated-token-list';

export function TokenDescriptionInput({
  token,
  iconSize,
}: {
  token?: Token;
  iconSize?: string;
  textSize?: string;
}) {
  const targetSize = iconSize ?? 'xs';
  const auxIcon = getAuxIconFromTokenAddress(token?.address ?? '');
  const isDeprecated = deprecatedTokenList.includes(token?.address ?? '');

  return token ? (
    <HStack spacing="1">
      <Flex alignItems="center">
        <AvatarGroup size={targetSize} max={2}>
          {(getIconsFromTokenAddress(token.address) ?? []).map((iconUrl, i) => (
            <Avatar
              width="62px"
              height="62px"
              borderColor="transparent"
              src={iconUrl}
              key={i + 1}
            />
          ))}
        </AvatarGroup>
        &nbsp;
        <Flex flexDirection="column" ml="8px">
          <Text fontSize="32px" fontWeight="600" color="black" isTruncated>
            {token.ticker}
            {isDeprecated ? <>(deprecated)</> : ''}
          </Text>
          <Text fontSize="16px" color="black" isTruncated>
            {token.name}
          </Text>
        </Flex>
        &nbsp;
        {auxIcon ? (
          <>
            (
            <AvatarGroup size={targetSize} max={2}>
              <Avatar borderColor={'gray.300'} src={auxIcon} />
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
