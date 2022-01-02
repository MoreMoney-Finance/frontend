import * as React from 'react';
import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import { ExternalLinkIcon, CopyIcon } from '@chakra-ui/icons';
import {
  ChainId,
  getExplorerAddressLink,
  shortenAddress,
  useEthers,
} from '@usedapp/core';
import { useContext } from 'react';
import { UserAddressContext } from '../contexts/UserAddressContext';

type Props = {
  isOpen: any;
  onClose: any;
};

export default function AccountModal({ isOpen, onClose }: Props) {
  const { deactivate } = useEthers();
  const account = useContext(UserAddressContext);
  const { chainId } = useEthers();
  const _chainId = chainId === ChainId.Hardhat ? ChainId.Avalanche : chainId;
  const explorerLink = account
    ? getExplorerAddressLink(account, _chainId!)
    : '';

  function handleDeactivateAccount() {
    deactivate();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <Box background="linear-gradient(to right, hsla(0, 100%, 64%, 0.06), hsla(193, 100%, 50%, 0.06))">
          <ModalHeader color="white" px={4} fontSize="lg" fontWeight="medium">
            <Text>Account</Text>
          </ModalHeader>
          <ModalCloseButton
            color="white"
            fontSize="sm"
            _hover={{
              color: 'whiteAlpha.700',
            }}
          />
          <ModalBody pt={0} px={4}>
            <Box
              borderRadius="3xl"
              border="1px"
              borderColor="gray.600"
              px={5}
              pt={4}
              pb={2}
              mb={3}
            >
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                  Connected with MetaMask
                </Text>
                <Button
                  variant="primary"
                  size="sm"
                  color={'black'}
                  borderRadius="3xl"
                  fontSize="13px"
                  fontWeight="normal"
                  px={2}
                  height="26px"
                  _hover={{
                    borderColor: 'blue.300',
                    textDecoration: 'underline',
                  }}
                  onClick={handleDeactivateAccount}
                >
                  Change
                </Button>
              </Flex>
              <Flex alignItems="center" mt={2} mb={4} lineHeight={1}>
                <Text
                  color="white"
                  fontSize="xl"
                  fontWeight="semibold"
                  ml="2"
                  lineHeight="1.1"
                >
                  {account && `${shortenAddress(account)}`}
                </Text>
              </Flex>
              <Flex alignContent="center" m={3}>
                <Button
                  variant="link"
                  color="gray.400"
                  fontWeight="normal"
                  fontSize="sm"
                  onClick={() => navigator.clipboard.writeText(account ?? '')}
                  _hover={{
                    textDecoration: 'none',
                  }}
                >
                  <CopyIcon mr={1} />
                  Copy Address
                </Button>
                <Link
                  fontSize="sm"
                  display="flex"
                  alignItems="center"
                  href={`${explorerLink}`}
                  isExternal
                  color="gray.400"
                  ml={6}
                  _hover={{
                    color: 'whiteAlpha.800',
                    textDecoration: 'underline',
                  }}
                >
                  <ExternalLinkIcon mr={1} />
                  View on Explorer
                </Link>
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter justifyContent="end" p={6}>
            <Text
              color="white"
              textAlign="left"
              fontWeight="medium"
              fontSize="md"
            >
              Your transactions willl appear here...
            </Text>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
}
