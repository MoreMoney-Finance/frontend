import { Avatar, AvatarGroup, Flex, Text } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import {
  getAuxIconFromTokenAddress,
  getIconsFromTokenAddress,
} from '../../chain-interaction/tokens';
import { deprecatedTokenList } from '../../constants/deprecated-token-list';

export function TokenDescriptionTable({
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
    <Flex alignItems="center">
      <AvatarGroup size={targetSize} max={2}>
        {(getIconsFromTokenAddress(token.address) ?? []).map((iconUrl, i) => (
          <Avatar
            width="40px"
            height="40px"
            borderColor="transparent"
            src={iconUrl}
            key={i + 1}
          />
        ))}
      </AvatarGroup>
      &nbsp;
      <Flex flexDirection="column" ml="8px">
        <Text fontSize="24px" fontWeight="600" color="white">
          {token.ticker}
          {isDeprecated ? <>(deprecated)</> : ''}
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
  ) : (
    <Text>Loading token information</Text>
  );
}
