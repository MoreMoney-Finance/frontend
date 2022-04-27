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
import { ParsedStratMetaRow } from '../../../../chain-interaction/views/strategies';
import { ChangeStrategyTable } from './ChangeStrategyTable';

export default function ChangeStrategyModal({
  chooseStrategy,
  stratMeta,
  currentStrategy,
}: {
  chooseStrategy: (strategyToChoose: string) => void;
  stratMeta: Record<string, ParsedStratMetaRow>;
  currentStrategy: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        borderRadius={'full'}
        width={'auto'}
        marginTop="20px"
        onClick={onOpen}
      >
        <Text variant="bodySmall">Change</Text>
      </Button>

      <Modal isOpen={isOpen} size={'xl'} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Strategy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ChangeStrategyTable
              onClose={onClose}
              stratMeta={stratMeta}
              chooseStrategy={chooseStrategy}
              currentStrategy={currentStrategy}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
