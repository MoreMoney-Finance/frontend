import {
  Alert,
  Container,
  AlertIcon,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import * as React from 'react';

export const ConfirmPositionModal = ({
  title,
  isOpen,
  onClose,
  confirm,
  dangerous,
  body,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  body: { title: any; value: any }[];
  confirm: any;
  dangerous: boolean;
}) => {
  function depositBorrow() {
    confirm();
    onClose();
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        returnFocusOnClose={true}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="transparent">
          <Container variant="modal">
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Your position would be close to liquidation, if the collateral loses
            value. Are you sure you want to proceed? */}

              {body.map((item, index) => (
                <Flex
                  alignContent={'space-between'}
                  justifyContent={'space-between'}
                  key={'confirm-modal-tr-' + index}
                >
                  <Box p="2">{item.title}</Box>
                  <Box p="2">{item.value}</Box>
                </Flex>
              ))}

              <br />
              {dangerous ? (
                <Alert status="info">
                  <AlertIcon />
                  Your position would be close to liquidation, if the collateral
                  loses value. Are you sure you want to proceed?
                </Alert>
              ) : (
                ''
              )}
            </ModalBody>
            <ModalFooter>
              <Flex w="full">
                <Button w="full" mr={3} onClick={onClose} variant="pink">
                  Cancel
                </Button>
                <Button w="full" variant="primary" onClick={depositBorrow}>
                  OK
                </Button>
              </Flex>
            </ModalFooter>
          </Container>
        </ModalContent>
      </Modal>
    </>
  );
};
