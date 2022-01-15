import {
  Alert,
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
  ModalOverlay
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
      <Modal isOpen={isOpen} onClose={onClose} returnFocusOnClose={true}>
        <ModalOverlay />
        <ModalContent>
          <Box background="linear-gradient(to right, hsla(0, 100%, 64%, 0.06), hsla(193, 100%, 50%, 0.06))">
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
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={depositBorrow}>
                OK
              </Button>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
