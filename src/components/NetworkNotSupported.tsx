import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';

export default function NetworkNotSupported() {
  const { onClose } = useDisclosure();
  const { deactivate } = useEthers();

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={true}
        isCentered
        leastDestructiveRef={undefined}
      >
        <div>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>Network Not Supported</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <p>Please connect to the appropriate Avalanche network.</p>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="red" ml={3} onClick={deactivate}>
                Disconnect
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>
      </AlertDialog>
    </>
  );
}
