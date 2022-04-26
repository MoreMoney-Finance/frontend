import * as React from 'react';
import { IconButton, IconButtonProps, Text } from '@chakra-ui/react';
import { useStable } from '../../chain-interaction/views/contracts';
import { BigNumber } from 'ethers';
import { CurrencyValue } from '@usedapp/core';
import { WalletBalancesContext } from '../../contexts/WalletBalancesContext';

type UserBalanceComponentProps = Omit<IconButtonProps, 'aria-label'>;

export const UserBalanceComponent: React.FC<UserBalanceComponentProps> = (
  props
) => {
  const stable = useStable();
  const balanceCtx = React.useContext(WalletBalancesContext);
  const walletBalance =
    balanceCtx.get(stable.address) ||
    new CurrencyValue(stable, BigNumber.from('0'));

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
      <Text size="md">{walletBalance?.format({ significantDigits: 12 })}</Text>
    </IconButton>
  );
};
