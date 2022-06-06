import { Avatar, Box, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StakeBox({
  children,
  title,
  img,
  link,
  totalStaked,
  yourStake,
  totalSupply,
  buttonLabel,
}: React.PropsWithChildren<{
  title: string;
  img: string;
  link: string;
  totalStaked: string;
  yourStake: string;
  totalSupply: string | null;
  buttonLabel?: string;
}>) {
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
        <Button onClick={() => navigate(link)}>
          {buttonLabel ?? `Earn ${title}`}
        </Button>
      </Flex>
      <Flex
        flexDirection={['column', 'column', 'row', 'row']}
        marginTop={'26px'}
        padding="16px"
      >
        <Box>
          <Flex flexDirection={'column'} justify="center" alignItems={'center'}>
            <Text fontSize={'md'} color={'gray.400'}>
              {'Total Staked'}
            </Text>
            <Text fontSize={'sm'}>{totalStaked}</Text>
          </Flex>
        </Box>
        <Spacer />
        <Box>
          <Flex flexDirection={'column'} justify="center" alignItems={'center'}>
            <Text fontSize={'md'} color={'gray.400'}>
              {'Your Stake'}
            </Text>
            <Text fontSize={'sm'}>{yourStake}</Text>
          </Flex>
        </Box>
        {totalSupply ? (
          <>
            <Spacer />
            <Box>
              <Flex
                flexDirection={'column'}
                justify="center"
                alignItems={'center'}
              >
                <Text fontSize={'md'} color={'gray.400'}>
                  {'Total Supply'}
                </Text>
                <Text fontSize={'sm'}>{totalSupply}</Text>
              </Flex>
            </Box>
          </>
        ) : null}
        {children}
      </Flex>
      {/* <Flex padding="16px" justify={'center'}> */}
      {/* <Box width={'100%'}> */}

      {/* </Box> */}
      {/* <Spacer /> */}
      {/* <Box width={'50%'}>
          <Flex flexDirection={'column'}>
            <Text fontSize={'md'} color={'gray.400'}>
              {'Deposit Fee'}
            </Text>
            <Text fontSize={'sm'}>1.00%</Text>
          </Flex>
        </Box> */}
      {/* </Flex> */}
    </Flex>
  );
}
