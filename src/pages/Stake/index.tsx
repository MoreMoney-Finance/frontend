import { Box, Container, Flex, Text } from '@chakra-ui/react';
import * as React from 'react';
import StakeBox from './components/StakeBox';

export default function StakePage({
  children,
}: React.PropsWithChildren<unknown>) {
  return (
    <Flex flexDirection={'column'}>
      <Box textAlign="center" margin="50px 10px 50px 10px">
        <Text fontSize={['36', '48', '48']} lineHeight="56px">
          <b>Maximize yield by staking MORE</b>
        </Text>
      </Box>
      <Flex flexDirection={['column', 'column', 'row', 'row']}>
        <Box w="100%" h="auto" padding={'36px'}>
          <Container variant={'token'}>
            <StakeBox
              img="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/xMORE%20logo.png"
              title={'xMore'}
              link="/xmore"
            />
          </Container>
        </Box>
        <Box w="100%" h="auto" padding={'36px'}>
          <Container variant={'token'}>
            <StakeBox
              img="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Moremoney_05.jpg"
              title="vMore"
              link="/vmore"
            />
          </Container>
        </Box>
      </Flex>
      {children}
    </Flex>
  );
}
