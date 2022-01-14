import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { TransactionStatus } from '@usedapp/core';
import * as React from 'react';
import { useEffect } from 'react';

export function StatusTrackModal({
  title,
  state,
}: {
  title: string;
  state: TransactionStatus;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (['Fail', 'Exception'].includes(state.status)) {
      onOpen();
    }
  }, [state]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title} - Transaction Failed</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{state.errorMessage}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
