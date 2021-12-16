import React from 'react';
import { HStack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <HStack spacing="8px" onClick={() => navigate(-1)} cursor={'pointer'}>
      <ArrowBackIcon w="20px" h="20px" color="brand.whiteAlpha50" />
      <Text variant="bodySmall">BACK</Text>
    </HStack>
  );
}
