import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TokenStratPositionMetadata,
  useIsolatedLendingLiquidationView,
  useIsolatedPositionMetadata,
} from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { Box, VStack } from '@chakra-ui/react';
import { TokenDataTable } from '../components/TokenDataTable';
import { MintNewTranche } from '../components/MintNewTranche';
import { TrancheTable } from '../components/TrancheTable';
import { TokenDescription } from '../components/TokenDescription';
import { addressToken } from '../chain-interaction/tokens';
import { getAddress } from 'ethers/lib/utils';

export function TokenPage(props: React.PropsWithChildren<unknown>) {
  const params = useParams<'tokenAddress'>();
  const tokenAddress = params.tokenAddress;
  const allStratMeta = React.useContext(StrategyMetadataContext);
  const token = tokenAddress
    ? addressToken.get(getAddress(tokenAddress))
    : undefined;

  const stratMeta: Record<string, ParsedStratMetaRow> =
    tokenAddress && tokenAddress in allStratMeta
      ? allStratMeta[tokenAddress]
      : {};
  const allPositionMeta: TokenStratPositionMetadata =
    useIsolatedPositionMetadata();
  const positionMeta: ParsedPositionMetaRow[] = tokenAddress
    ? allPositionMeta[tokenAddress] ?? []
    : [];
  const tokenKey = Object.keys(stratMeta)[0];
  const liquidationRewardPer10k = useIsolatedLendingLiquidationView(
    'liquidationRewardPer10k',
    [tokenAddress]
  );

  return (
    <VStack>
      {token ? (
        <h1>
          <TokenDescription token={token} />
        </h1>
      ) : undefined}
      <Box>
        {positionMeta.length > 0 ? (
          <TrancheTable positions={positionMeta} />
        ) : undefined}
      </Box>
      <Box>
        <VStack>
          {Object.values(stratMeta).map((meta, i) => (
            <VStack key={i}>
              <Box>
                <h3 text-align="center">
                  {' '}
                  Open new position using {meta.strategyName}:{' '}
                </h3>
              </Box>
              <MintNewTranche {...meta} />
            </VStack>
          ))}
        </VStack>
      </Box>
      <TokenDataTable
        tokenData={
          Object.keys(stratMeta).length > 0 ? stratMeta[tokenKey] : undefined
        }
        liquidationFee={liquidationRewardPer10k}
      />
      {props.children}
    </VStack>
  );
}
