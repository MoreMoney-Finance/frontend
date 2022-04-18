import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { ParsedStakingMetadata } from '../../chain-interaction/contracts';

export function FarmCard({
  token,
  row,
}: {
  token: Token;
  row: ParsedStakingMetadata;
}) {
  return (
    <>
      <Container variant="token" marginTop={'20px'}>
        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
            Asset
          </Box>
          <Box>
            <Text>{}</Text>
          </Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
            Stake
          </Box>
          <Box>
            <Text>{}</Text>
          </Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
            TVL
          </Box>
          <Box>
            <Text>{}</Text>
          </Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
            Reward
          </Box>
          <Box>
            <Text>{}</Text>
          </Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
            APR
          </Box>
          <Box>
            <Text>{}</Text>
          </Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
            Acquire
          </Box>
          <Box>
            <Text>{}</Text>
          </Box>
        </Flex>

        <Button as={Link} to={`/token/${token.address}`} w={'full'}>
          View
        </Button>
      </Container>
    </>
  );
}
