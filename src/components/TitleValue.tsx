import React from 'react';
import { VStack, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  value: string;
};

export function TitleValue({ title, value }: Props) {
  return (
    <VStack spacing="20px" align="center">
      <Text variant="h400">{title}</Text>
      <Text variant="bodySmall">{value}</Text>
    </VStack>
  );
}
