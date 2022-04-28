import { Button } from '@chakra-ui/react';
import { Token } from '@usedapp/core';
import * as React from 'react';
import { useUpdateOraclePrice } from '../../../../../chain-interaction/views/contracts';
import { TransactionErrorDialog } from '../../../../../components/notifications/TransactionErrorDialog';

export default function UpdatePriceOracle({ token }: { token: Token }) {
  const { sendUpdateOraclePrice, updateOraclePriceState } =
    useUpdateOraclePrice();

  return (
    <>
      <TransactionErrorDialog
        state={updateOraclePriceState}
        title={'Update Oracle Price'}
      />
      <Button
        onClick={() => {
          sendUpdateOraclePrice(token.address);
        }}
      >
        Update Price Oracle
      </Button>
    </>
  );
}
