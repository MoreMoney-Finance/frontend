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
import { Box, Center, VStack } from '@chakra-ui/react';
import { TokenDescription } from '../components/TokenDescription';
import { getTokenFromAddress } from '../chain-interaction/tokens';
import { PositionBody } from '../components/PositionBody';
import { BigNumber } from 'ethers';
import { EditTranche } from '../components/EditTranche';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { TrancheTable } from '../components/TrancheTable';

export function TokenPage(props: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const params = useParams<'tokenAddress'>();
  const tokenAddress = params.tokenAddress;
  const allStratMeta = React.useContext(StrategyMetadataContext);
  const token = tokenAddress
    ? getTokenFromAddress(chainId!, tokenAddress)
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

  const liquidationRewardPer10k: BigNumber = useIsolatedLendingLiquidationView(
    'liquidationRewardPer10k',
    [tokenAddress],
    BigNumber.from(0)
  );

  const stable = useStable();

  const boxStyle = {
    border: '1px solid transparent',
    borderColor: 'gray.600',
    borderRadius: '3xl',
    borderStyle: 'solid',
  };

  return (
    <VStack spacing="8" margin="8">
      {token ? (
        <h1>
          <TokenDescription token={token} iconSize="xs" textSize="6xl" />
        </h1>
      ) : undefined}

      <Center>
        {positionMeta.length === 0 ? (
          <Box {...boxStyle}>
            <PositionBody
              stratMeta={stratMeta}
              liquidationRewardPer10k={liquidationRewardPer10k}
            />
          </Box>
        ) : (
          positionMeta.map((position, i) => (
            <Box key={i} {...boxStyle}>
              <VStack>
                <Box padding="8">
                  <TrancheTable positions={[position]} />
                </Box>
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
            </Box>
          ))
        )}
        {props.children}
      </Center>
    </VStack>
  );
}
