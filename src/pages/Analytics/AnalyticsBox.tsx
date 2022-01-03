import * as React from 'react';
import { Box, Text } from '@chakra-ui/react';

export function AnalyticsBox({
  title,
  subtitle,
  value,
}: {
  title: string;
  subtitle: string;
  value: string;
}) {
  return (
    <Box textAlign={'center'} lineHeight={'2'}>
      <Text fontSize={'xl'}>{title}</Text>
      <Text fontSize={'md'} color={'gray.400'}>
        {subtitle}
      </Text>
      <Text fontSize={'sm'}>
        <b>{value}</b>
      </Text>
    </Box>
  );
}
