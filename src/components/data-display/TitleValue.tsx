import React from 'react';
import { VStack, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  value: any;
};

export function TitleValue({ title, value }: Props) {
  return (
    <VStack
      spacing={['10px', '0px', '20px']}
      align="center"
      margin={['16px', '16px', '0px']}
    >
      <Text variant="h400" color={'whiteAlpha.700'}>
        {title}
      </Text>
      <Text variant="bodySmall">{value}</Text>
    </VStack>
  );
}
