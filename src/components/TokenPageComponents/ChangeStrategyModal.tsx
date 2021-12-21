import * as React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
} from '@chakra-ui/react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';
import { EnsureWalletConnected } from '../EnsureWalletConnected';

export default function ChangeStrategyModal({
  stratMeta,
}: {
  stratMeta: Record<string, ParsedStratMetaRow>;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <EnsureWalletConnected>
        <Button
          borderRadius={'full'}
          width={'auto'}
          marginTop="20px"
          onClick={onOpen}
        >
          <Text variant="bodySmall">Change</Text>
        </Button>
      </EnsureWalletConnected>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{Object.keys(stratMeta).join(',')}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
