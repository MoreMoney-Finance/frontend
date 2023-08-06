import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';
import {
  getIconsFromTokenAddress,
  getTokenFromAddress,
} from '../../chain-interaction/tokens';
import { BackButton } from '../../components/navigation/BackButton';
import DeprecatedTokenMessage from '../../components/notifications/DeprecatedTokenMessage';
import { StrategyMetadataContext } from '../../contexts/StrategyMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { PositionBody } from './components/PositionBody';
import { TokenPageBody } from './components/TokenPageBody';
import robotPfp from '../../assets/img/robot-token-page.svg';

export default function TokenPage(props: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const account = useContext(UserAddressContext);
  const params = useParams<'tokenAddress'>();
  const tokenAddress = params.tokenAddress;
  const allStratMeta = React.useContext(StrategyMetadataContext);
  const token = tokenAddress
    ? getTokenFromAddress(chainId, tokenAddress)
    : undefined;

  const stratMeta: Record<string, ParsedStratMetaRow> =
    tokenAddress && tokenAddress in allStratMeta
      ? allStratMeta[tokenAddress]
      : {};

  return Object.values(stratMeta).length > 0 ? (
    <Box margin={['0px', '0px', '60px 100px 100px']}>
      <Box
        position="absolute"
        width={['full', '300px', '300px']}
        height="200px"
        filter="blur(200px)"
        opacity="0.3"
        right="300px"
        top="450px"
        pointerEvents="none"
        bgGradient="radial(farthest-side, hsla(169, 100%, 46%, 1), hsla(169, 100%, 46%, 0))"
        zIndex="var(--chakra-zIndices-base)"
      />
      <DeprecatedTokenMessage />
      <Box>
        <Flex alignItems="center" position="relative">
          <Avatar width="160px" height="160px" src={robotPfp} />
          {token && token.address && (
            <Avatar
              width="75px"
              height="75px"
              position="absolute"
              bottom="0"
              left="100px"
              src={getIconsFromTokenAddress(token.address)[0]}
            />
          )}
          <Text fontSize="88px" fontWeight="700" ml="15px">
            {token?.ticker}
          </Text>
        </Flex>
      </Box>
      <br />
      <BackButton />
      {account ? (
        <TokenPageBody
          tokenAddress={tokenAddress}
          stratMeta={stratMeta}
          account={account}
        />
      ) : (
        <PositionBody stratMeta={stratMeta} />
      )}
      {props.children}
    </Box>
  ) : (
    <> </>
  );
}
