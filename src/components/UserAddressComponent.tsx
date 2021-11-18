import * as React from 'react';
import { IconButton, IconButtonProps, Link, Text } from '@chakra-ui/react';
import {
  ChainId,
  getExplorerAddressLink,
  shortenAddress,
  useEthers,
} from '@usedapp/core';
import { useContext } from 'react';
import { UserAddressContext } from '../contexts/UserAddressContext';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';

type UserAddressComponentProps = Omit<IconButtonProps, 'aria-label'>;

export const UserAddressComponent: React.FC<UserAddressComponentProps> = (
  props
) => {
  const account = useContext(UserAddressContext);
  const { onClose, isOpen, onOpen } = useDisclosure();

  const { chainId } = useEthers();
  const _chainId = chainId === ChainId.Hardhat ? ChainId.Avalanche : chainId;
  const explorerLink = account
    ? getExplorerAddressLink(account, _chainId!)
    : '';

  return (
    <>
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        marginRight="2"
        aria-label={`Wallet Address`}
        onClick={onOpen}
        {...props}
      >
        <Text size="md">{account ? shortenAddress(account) : ''}</Text>
      </IconButton>
      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        leastDestructiveRef={undefined}
      >
        <div>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>Account</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  placeholder="Enter password"
                  defaultValue={account ? shortenAddress(account) : ''}
                  disabled={true}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm">
                    Change
                  </Button>
                </InputRightElement>
              </InputGroup>
              <br />
              <Link color="teal.500" href={explorerLink} isExternal>
                View on explorer <ExternalLinkIcon mx="2px" />{' '}
              </Link>{' '}
              &nbsp;&nbsp;&nbsp;
              <Link
                color="teal.500"
                onClick={() => navigator.clipboard.writeText(account ?? '')}
              >
                Copy Address <CopyIcon mx="2px" />
              </Link>
            </AlertDialogBody>
          </AlertDialogContent>
        </div>
      </AlertDialog>
    </>
  );
};
