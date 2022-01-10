import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Tr,
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
  body: { title: string; value: string | undefined }[];
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
              <Table size="sm">
                <Tbody>
                  {body.map((item, index) => (
                    <Tr key={'confirm-modal-tr-' + index}>
                      <Td>{item.title}</Td>
                      <Td isNumeric>{item.value}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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
