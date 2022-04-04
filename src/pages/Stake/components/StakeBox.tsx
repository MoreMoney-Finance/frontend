import { Avatar, Box, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StakeBox({
  children,
  title,
  img,
}: React.PropsWithChildren<{ title: string; img: string }>) {
  const navigate = useNavigate();
  return (
    <Flex flexDirection={'column'} padding={'36px'}>
      <Flex justify={'center'} alignContent="center" alignItems={'center'}>
        <Box>
          <Flex alignItems={'center'}>
            <Avatar borderColor="gray.300" showBorder={true} src={img} />
            <Text>&nbsp;&nbsp;{title}</Text>
          </Flex>
        </Box>
        <Spacer />
        <Button onClick={() => navigate('/xmore')}>Earn {title}</Button>
      </Flex>
      <Flex marginTop={'26px'} padding="16px">
        <Box width={'100%'}>
          <Flex flexDirection={'column'}>
            <Text fontSize={'md'} color={'gray.400'}>
              {'Total Staked (USD)'}
            </Text>
            <Text fontSize={'sm'}>$109,876,779</Text>
          </Flex>
        </Box>
        <Spacer />
        <Box width={'50%'}>
          <Flex flexDirection={'column'}>
            <Text fontSize={'md'} color={'gray.400'}>
              {'Your Stake (USD)'}
            </Text>
            <Text fontSize={'sm'}>$109</Text>
          </Flex>
        </Box>
      </Flex>
      <Flex padding="16px">
        <Box width={'100%'}>
          <Flex flexDirection={'column'}>
            <Text fontSize={'md'} color={'gray.400'}>
              {'APR (7D)'}
            </Text>
            <Text fontSize={'sm'}>26%</Text>
          </Flex>
        </Box>
        {/* <Spacer /> */}
        <Box width={'50%'}>
          <Flex flexDirection={'column'}>
            <Text fontSize={'md'} color={'gray.400'}>
              {'Deposit Fee'}
            </Text>
            <Text fontSize={'sm'}>1.00%</Text>
          </Flex>
        </Box>
      </Flex>
      {children}
    </Flex>
  );
}
