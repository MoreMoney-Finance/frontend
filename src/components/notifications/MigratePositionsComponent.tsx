import { Alert, AlertIcon, Box, Text } from '@chakra-ui/react';
import * as React from 'react';

export default function MigratePositionsComponent() {
  return (
    <>
      <Box w="100%" color="white" textAlign={'center'}>
        <Alert
          status="info"
          height={'100px'}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          fontSize={'22px'}
        >
          <AlertIcon />
          <Text>Want to borrow more? After migrating: &nbsp;</Text>
          <Text textDecoration={'underline'}>
            <a
              href="https://app.moremoney.finance"
              style={{ textDecoration: 'underline' }}
            >
              check out our v2 UI
            </a>
          </Text>
        </Alert>
      </Box>
    </>
  );
}
