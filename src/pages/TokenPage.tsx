import { Box, HStack, Image } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import ellipseGreen from '../assets/img/ellipse_green_2.svg';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { getTokenFromAddress } from '../chain-interaction/tokens';
import { BackButton } from '../components/BackButton';
import { TokenDescription } from '../components/TokenDescription';
import { PositionBody } from '../components/TokenPageComponents/PositionBody';
import { TokenPageBody } from '../components/TokenPageComponents/TokenPageBody';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';

export function TokenPage(props: React.PropsWithChildren<unknown>) {
  const { chainId, account } = useEthers();
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
    <Box margin={'60px 100px 100px'}>
      <Image
        src={ellipseGreen}
        position="absolute"
        right="0"
        pointerEvents="none"
        zIndex="var(--chakra-zIndices-docked)"
      />
      <HStack spacing={'20px'}>
        <BackButton />
        {token ? (
          <TokenDescription token={token} iconSize="xs" textSize="6xl" />
        ) : undefined}
      </HStack>
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
