import React from 'react';
import { VStack, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  value: any;
  description: any;
};

export function TitleValue({ title, value, description = undefined }: Props) {
  return (
    <VStack
      spacing={['10px', '0px', '20px']}
      align="center"
      margin={['16px', '16px', '0px']}
    >
      <Text variant="h400" color={'white'} fontSize="16px">
        {title}
      </Text>
      <Text fontSize="40px">{value}</Text>
      {description}
    </VStack>
  );
}
