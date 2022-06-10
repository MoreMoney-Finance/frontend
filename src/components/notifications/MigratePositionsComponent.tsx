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
