import * as React from 'react';
import { IconButton, IconButtonProps, Text } from '@chakra-ui/react';
import { shortenAddress } from '@usedapp/core';
import { useContext } from 'react';
import { UserAddressContext } from '../contexts/UserAddressContext';

type UserAddressComponentProps = Omit<IconButtonProps, 'aria-label'>;

export const UserAddressComponent: React.FC<UserAddressComponentProps> = (
  props
) => {
  const account = useContext(UserAddressContext);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      marginRight="2"
      aria-label={`Wallet Address`}
      {...props}
    >
      <Text size="md">{account ? shortenAddress(account) : ''}</Text>
    </IconButton>
  );
};
