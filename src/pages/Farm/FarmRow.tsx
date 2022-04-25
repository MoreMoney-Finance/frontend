import {
  AccordionButton,
  AccordionItem,
  Box,
  Flex,
  Grid,
  Text,
} from '@chakra-ui/react';
import * as React from 'react';

export default function FarmRow({
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
  const accordionStyling = {
    content: '""',
    borderRadius: '10px',
    marginTop: '10px',
    border: '1px solid transparent',
    backgroundClip: 'padding-box, border-box',
    backgroundOrigin: 'padding-box, border-box',
    backgroundImage:
      'linear-gradient(hsla(227, 12%, 15%, 1), hsla(227, 12%, 15%, 1)), linear-gradient(to right, hsla(0, 100%, 64%, 0.3) 0%, hsla(193, 100%, 50%, 0.3) 100%)',
    zIndex: 'var(--chakra-zIndices-hide)',
    fontSize: '18px',
    lineHeight: '27px',
    padding: '16px 30px',
  };

  return (
    <AccordionItem
      width={'full'}
      style={{ boxSizing: 'border-box', ...accordionStyling }}
    >
      <AccordionButton width={'full'}>
        <Grid
          templateColumns="repeat(6, 1fr)"
          gap={2}
          w={'full'}
          alignContent={'center'}
          verticalAlign={'center'}
        >
          <Flex w={'full'} justifyContent={'center'}>
            <Box w={'fit-content'}>{asset}</Box>
          </Flex>
          <Box>
            <Text>{stake}</Text>
          </Box>
          <Box>
            <Text>{tvl}</Text>
          </Box>
          <Flex w={'full'} justifyContent={'center'}>
            {reward}
          </Flex>
          <Box>{apr}</Box>
          <Box>{acquire}</Box>
        </Grid>
      </AccordionButton>
      {content}
    </AccordionItem>
  );
}
