import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ParsedStratMetaRow,
} from '../chain-interaction/contracts';
import { getTokenFromAddress } from '../chain-interaction/tokens';
import { TokenPageBody } from '../components/TokenPageComponents/TokenPageBody';
import { TokenDescription } from '../components/TokenDescription';
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

  const navigate = useNavigate();

  return Object.values(stratMeta).length > 0 ? (<VStack spacing="8" margin="8">
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
    {
      account &&
      (<TokenPageBody tokenAddress={tokenAddress} stratMeta={stratMeta} account={account} />)
    }
    {props.children}
  </VStack>
  ) : (<> </>);
}
