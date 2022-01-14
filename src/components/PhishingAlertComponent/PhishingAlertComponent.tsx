import { Box, Text } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import { useContext } from 'react';
import { UserAddressContext } from '../../contexts/UserAddressContext';

export default function PhishingAlertComponent() {
  const { account } = useEthers();
  const userAccount = useContext(UserAddressContext);

  return (
    <>
      {account != userAccount ? (
        <Box bg="red" w="100%" p={3} color="white" textAlign={'center'}>
          <Text size={'4xl'} as="mark">
            <b>
              Phishing danger: do not make any transactions unless you know what
              you&apos;re doing!
            </b>
          </Text>
        </Box>
      ) : (
        ''
      )}
    </>
  );
}
