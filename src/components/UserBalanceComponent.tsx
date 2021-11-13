import * as React from 'react';
import { IconButton, IconButtonProps, Text } from '@chakra-ui/react';
import { useStable } from '../chain-interaction/contracts';
import { BigNumber } from 'ethers';
import { CurrencyValue } from '@usedapp/core';

type UserBalanceComponentProps = Omit<IconButtonProps, 'aria-label'>;

export const UserBalanceComponent: React.FC<UserBalanceComponentProps> = (
  props
) => {
  const stable = useStable();
  const walletBalance = new CurrencyValue(stable!, BigNumber.from('0'));

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      marginRight="2"
      aria-label={`Wallet Balance`}
      {...props}
    >
      <Text size="md">{walletBalance?.format()}</Text>
    </IconButton>
  );
};
