import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';
import { EnsureWalletConnected } from '../EnsureWalletConnected';
import { ChangeStrategyTable } from './ChangeStrategyTable';

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

      <Modal isOpen={isOpen} size={'xl'} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Strategy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ChangeStrategyTable stratMeta={stratMeta} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
