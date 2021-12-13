import { HStack, Box } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { getTokenFromAddress } from '../chain-interaction/tokens';
import { TokenPageBody } from '../components/TokenPageComponents/TokenPageBody';
import { TokenDescription } from '../components/TokenDescription';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { PositionBody } from '../components/TokenPageComponents/PositionBody';
import { BackButton } from '../components/BackButton';

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
    <Box margin={'50px 50px 100px'}>
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
