import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Box,
  Container,
  Flex,
  Text,
} from '@chakra-ui/react';
import React from 'react';

export function FarmCard({
  asset,
  stake,
  tvl,
  reward,
  apr,
  acquire,
  content,
}: {
  asset: any;
  stake: string;
  tvl: string;
  reward: any;
  apr: string;
  acquire: any;
  content?: any;
}) {
  return (
    <>
      <Container variant="token" marginTop={'20px'}>
        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Poppins'} color={'whiteAlpha.400'}>
            Asset
          </Box>
          <Box>
            <Text>{asset}</Text>
          </Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Poppins'} color={'whiteAlpha.400'}>
            Stake
          </Box>
          <Box>
            <Text>{stake}</Text>
          </Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Poppins'} color={'whiteAlpha.400'}>
            TVL
          </Box>
          <Box>
            <Text>{tvl}</Text>
          </Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Poppins'} color={'whiteAlpha.400'}>
            Reward
          </Box>
          <Box>{reward}</Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Poppins'} color={'whiteAlpha.400'}>
            APR
          </Box>
          <Box>
            <Text>{apr}</Text>
          </Box>
        </Flex>

        <Flex flexDirection={'row'} justifyContent={'space-between'} p={'4'}>
          <Box fontFamily={'Poppins'} color={'whiteAlpha.400'}>
            Acquire
          </Box>
          <Box>{acquire}</Box>
        </Flex>

        {content ? (
          <Accordion
            allowToggle
            allowMultiple
            width={'full'}
            variant={'farm'}
            defaultIndex={0}
          >
            <AccordionItem width={'full'}>
              <AccordionButton width={'full'}>
                <Box flex="1" textAlign="left">
                  Actions
                </Box>
                <AccordionIcon />
              </AccordionButton>
              {content}
            </AccordionItem>
          </Accordion>
        ) : (
          ''
        )}
      </Container>
    </>
  );
}
