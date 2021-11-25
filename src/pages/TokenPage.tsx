import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TokenStratPositionMetadata,
  useIsolatedLendingLiquidationView,
  useIsolatedPositionMetadata,
  useStable,
} from '../chain-interaction/contracts';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';
import { Box, VStack } from '@chakra-ui/react';
import { TokenDescription } from '../components/TokenDescription';
import { getTokenFromAddress } from '../chain-interaction/tokens';
import { PositionBody } from '../components/PositionBody';
import { BigNumber } from 'ethers';
import { EditTranche } from '../components/EditTranche';
import { CurrencyValue } from '@usedapp/core';

export function TokenPage(props: React.PropsWithChildren<unknown>) {
  const params = useParams<'tokenAddress'>();
  const tokenAddress = params.tokenAddress;
  const allStratMeta = React.useContext(StrategyMetadataContext);
  const token = tokenAddress ? getTokenFromAddress(tokenAddress) : undefined;

  const stratMeta: Record<string, ParsedStratMetaRow> =
    tokenAddress && tokenAddress in allStratMeta
      ? allStratMeta[tokenAddress]
      : {};
  const allPositionMeta: TokenStratPositionMetadata =
    useIsolatedPositionMetadata();
  const positionMeta: ParsedPositionMetaRow[] = tokenAddress
    ? allPositionMeta[tokenAddress] ?? []
    : [];

  const liquidationRewardPer10k: BigNumber = useIsolatedLendingLiquidationView(
    'liquidationRewardPer10k',
    [tokenAddress],
    BigNumber.from(0)
  );

  const stable = useStable();

  return (
    <VStack spacing="1rem">
      {token ? (
        <h1>
          <TokenDescription token={token} />
        </h1>
      ) : undefined}

      {positionMeta.length === 0 ? (
        <PositionBody
          stratMeta={stratMeta}
          liquidationRewardPer10k={liquidationRewardPer10k}
        />
      ) : (
        positionMeta.map((position, i) => (
          <VStack key={i} spacing="0.5rem">
            <Box>
              <EditTranche
                {...{
                  ...position,
                  ...stratMeta[position.strategy],
                  collateral:
                    position.collateral ??
                    new CurrencyValue(position.token, BigNumber.from(0)),
                  debt:
                    position.debt ??
                    new CurrencyValue(stable, BigNumber.from(0)),
                }}
              />
            </Box>
            <PositionBody
              position={position}
              stratMeta={stratMeta}
              liquidationRewardPer10k={liquidationRewardPer10k}
            />
          </VStack>
        ))
      )}
      {props.children}
    </VStack>
  );
}
