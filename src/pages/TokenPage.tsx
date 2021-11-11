import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { TokenDataTable } from '../components/TokenDataTable';
import { MintNewTranche } from '../components/MintNewTranche';

export function TokenPage(props: React.PropsWithChildren<unknown>) {
  const params = useParams<'tokenAddress'>();
  const tokenAddress = params.tokenAddress;
  const allStratMeta = React.useContext(StrategyMetadataContext);

  const stratMeta: ParsedStratMetaRow[] = tokenAddress && tokenAddress in allStratMeta ? allStratMeta[tokenAddress] : [];
  // const positionMeta: Record<string, ParsedPositionMetaRow> = useIsolatedPositionMetadata();

  return (
    <>
      { props.children }
      <HStack>
        <TokenDataTable tokenData={(stratMeta.length > 0 ? stratMeta[0] : undefined)} />
        <Box>
          <VStack>
            {stratMeta.map((meta, i) => (
              <MintNewTranche key={i} {...meta} />
            ))}
          </VStack>
        </Box>
      </HStack>
    </>
  );
}