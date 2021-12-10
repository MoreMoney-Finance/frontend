import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TokenStratPositionMetadata,
  useIsolatedLendingLiquidationView,
  useIsolatedPositionMetadata,
} from '../chain-interaction/contracts';
import { getTokenFromAddress } from '../chain-interaction/tokens';
import { TokenData } from '../components/TokenData';
import { TokenDescription } from '../components/TokenDescription';
import BorrowDeposit from '../components/TokenPageComponents/BorrowDeposit';
import CollateralAPY from '../components/TokenPageComponents/CollateralAPY';
import StrategyTokenData from '../components/TokenPageComponents/StrategyTokenData';
import TokenInformation from '../components/TokenPageComponents/TokenInformation';
import { StrategyMetadataContext } from '../contexts/StrategyMetadataContext';

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

  const navigate = useNavigate();

  const position = { ...positionMeta[0] };
  const stratMetaData = { ...stratMeta[position.strategy] };

  return (
    <VStack spacing="8" margin="8">
      <Flex flexDirection={'row'} w={'full'} alignContent={'center'}>
        <Box
          marginRight={'10px'}
          cursor={'pointer'}
          onClick={() => navigate(-1)}
        >
          <Flex flexDirection={'row'}>
            <Text>
              <ArrowBackIcon />
            </Text>
            <Text>Back</Text>
          </Flex>
        </Box>
        <Box>
          {token ? (
            <TokenDescription token={token} iconSize="xs" textSize="6xl" />
          ) : undefined}
        </Box>
      </Flex>

      <Grid
        w={'full'}
        h="500px"
        width={'1200px'}
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(7, 1fr)"
        gap={4}
      >
        {positionMeta.length === 0 ? (
          <BorrowDeposit
            stratMeta={stratMeta}
            liquidationRewardPer10k={liquidationRewardPer10k}
          />
        ) : undefined}

        <CollateralAPY position={position} stratMetaData={stratMetaData} />
        <StrategyTokenData position={position} stratMetaData={stratMetaData} />
        <TokenInformation />
      </Grid>
      <TokenData
        tokenData={
          Object.keys(stratMeta).length > 0
            ? stratMeta[Object.keys(stratMeta)[0]]
            : undefined
        }
        liquidationFee={liquidationRewardPer10k}
      />
      {props.children}
    </VStack>
  );
}
