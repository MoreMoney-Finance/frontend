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
        <ModalOverlay
          background="rgba(75, 75, 75, 0.40)"
          backdropFilter="blur(15px);"
        />
        <ModalContent borderRadius="8px" background="transparent">
          <Box
            background="rgba(0, 0, 0, 0.44);"
            boxShadow="11px 10px 122px -36px #98DAFF;"
            backdropFilter="blur(25px);"
            borderRadius="8px"
          >
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
                <Button
                  w="full"
                  variant="primary"
                  onClick={() => {
                    depositBorrow();
                  }}
                >
                  OK
                </Button>
              </Flex>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
