import { Box, Flex, GridItem, Spacer, Text } from '@chakra-ui/react';
import * as React from 'react';

export default function TokenInformation() {
  const boxStyle = {
    border: '1px solid transparent',
    borderColor: 'gray.600',
    borderRadius: '3xl',
    borderStyle: 'solid',
    height: 'full',
  };

  return (
    <GridItem colSpan={4}>
      <Flex
        {...boxStyle}
        flexDirection={'column'}
        justifyContent={'center'}
        alignContent={'center'}
        alignItems={'center'}
        paddingLeft={'100px'}
        paddingRight={'100px'}
      >
        <Box w={'full'}>
          <Flex w={'full'}>
            <Text>Borrow Fee</Text>
            <Spacer />
            <Text>
              <b>0.5%</b>
            </Text>
          </Flex>
          <br />
          <Flex w={'full'}>
            <Text>Borrow Fee</Text>
            <Spacer />
            <Text>
              <b>150%</b>
            </Text>
          </Flex>
          <br />
          <Flex w={'full'}>
            <Text>Liquidation Fee</Text>
            <Spacer />
            <Text>
              <b>12%</b>
            </Text>
          </Flex>
          <br />
          <Flex w={'full'}>
            <Text>Interest</Text>
            <Spacer />
            <Text>
              <b>8%</b>
            </Text>
          </Flex>
        </Box>
      </Flex>
    </GridItem>
  );
}
