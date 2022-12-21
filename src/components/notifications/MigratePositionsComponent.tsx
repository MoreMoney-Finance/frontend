import * as React from 'react';
import { Alert, AlertIcon, Box, Text } from '@chakra-ui/react';

export default function MigratePositionsComponent() {
  return (
    <>
      <Box w="100%" color="white" textAlign={'center'}>
        <Alert
          status="info"
          justifyContent={'center'}
          fontSize={'lg'}
          borderRadius={'full'}
        >
          <AlertIcon />
          Where are my positions? &nbsp;
          <Text textDecoration={'underline'}>
            <a
              href="https://v2.moremoney.finance/"
              style={{ textDecoration: 'underline' }}
            >
              Go to V2 UI
            </a>
          </Text>
        </Alert>
      </Box>
    </>
  );
}
