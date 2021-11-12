import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ParsedPositionMetaRow, ParsedStratMetaRow, TokenStratPositionMetadata, useIsolatedPositionMetadata } from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { TokenDataTable } from '../components/TokenDataTable';
import { MintNewTranche } from '../components/MintNewTranche';
import { TrancheTable } from '../components/TrancheTable';
import { TokenDescription } from '../components/TokenDescription';
import { addressToken } from '../chain-interaction/tokens';

export function TokenPage(props: React.PropsWithChildren<unknown>) {
  const params = useParams<'tokenAddress'>();
  const tokenAddress = params.tokenAddress;
  const allStratMeta = React.useContext(StrategyMetadataContext);
  const token = tokenAddress ? addressToken.get(tokenAddress) : undefined;

  const stratMeta: Record<string, ParsedStratMetaRow> = tokenAddress && tokenAddress in allStratMeta ? allStratMeta[tokenAddress] : {};
  const allPositionMeta: TokenStratPositionMetadata = useIsolatedPositionMetadata();
  const positionMeta: ParsedPositionMetaRow[] = tokenAddress ? allPositionMeta[tokenAddress] ?? [] : [];
  return (
    <>
      {props.children}
      <VStack>
        {token ? (
          <h1>
            <TokenDescription token={token} />
          </h1>
        ) : undefined}
        <HStack>
          <TokenDataTable tokenData={(Object.keys(stratMeta).length > 0 ? stratMeta[0] : undefined)} />
          <Box>
            {positionMeta.length > 0 ? (<TrancheTable positions={positionMeta} />) : undefined}
          </Box>
        </HStack>
        <Box>
          <VStack>
            <h2> Open new position </h2>
            {Object.values(stratMeta).map((meta, i) => (
              <VStack key={i}>
                <Box>
                  <h3 text-align="center"> {meta.strategyName} </h3>
                </Box>
                <MintNewTranche {...meta} />
              </VStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </>
  );
}