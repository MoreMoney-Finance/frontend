import * as React from 'react';
import { Box, Button, Container, Flex, Text, WrapItem } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import { Link } from 'react-router-dom';
import PositionNftImage from '../../components/data-display/PositionNftImage';
import { TokenDescription } from '../../components/tokens/TokenDescription';
import { TrancheData } from './CurrentlyOpenPositions';

export function TrancheCard({
  token,
  row,
}: {
  token: Token;
  row: TrancheData;
}) {
  return (
    <WrapItem width={['100%', '100%', '100%', '47%']}>
      <Container variant="token" marginTop={'20px'} padding="6px">
        <Flex flexDirection={['column', 'row']}>
          <Flex
            width={'48%'}
            flexDirection={'column'}
            justifyContent={'center'}
          >
            <PositionNftImage trancheId={row.trancheId} />
          </Flex>
          <Flex flexDirection={'column'} flex="1" width={'48%'}>
            <Flex
              flexDirection={'row'}
              justifyContent={'space-between'}
              p={'4'}
            >
              <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
                Position Health
              </Box>
              <Box>
                <Text
                  color={
                    row.positionHealthColor == 'accent'
                      ? 'accent_color'
                      : row.positionHealthColor
                  }
                >
                  {row.positionHealth}
                </Text>
              </Box>
            </Flex>

            <Flex
              flexDirection={'row'}
              justifyContent={'space-between'}
              p={'4'}
            >
              <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
                Asset
              </Box>
              <Box>
                <TokenDescription token={token} />
              </Box>
            </Flex>
            <Flex
              flexDirection={'row'}
              justifyContent={'space-between'}
              p={'4'}
            >
              <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
                Strategy
              </Box>
              <Box>
                <Text>{row.APY}</Text>
              </Box>
            </Flex>

            <Flex
              flexDirection={'row'}
              justifyContent={'space-between'}
              p={'4'}
            >
              <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
                Cur. ColRatio
              </Box>
              <Box>
                <Text>{row.collateralValue}</Text>
              </Box>
            </Flex>

            <Flex
              flexDirection={'row'}
              justifyContent={'space-between'}
              p={'4'}
            >
              <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
                Liq. price
              </Box>
              <Box>
                <Text>{row.liquidationPrice}</Text>
              </Box>
            </Flex>

            <Flex
              flexDirection={'row'}
              justifyContent={'space-between'}
              p={'4'}
            >
              <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
                Collateral
              </Box>
              <Box>
                <Text>{row.collateral}</Text>
              </Box>
            </Flex>

            <Flex
              flexDirection={'row'}
              justifyContent={'space-between'}
              p={'4'}
            >
              <Box fontFamily={'Rubik'} color={'whiteAlpha.400'}>
                Debt
              </Box>
              <Box>
                <Text>{row.debt}</Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Button as={Link} to={`/token/${token.address}`} w={'full'}>
          View
        </Button>
      </Container>
    </WrapItem>
  );
}
