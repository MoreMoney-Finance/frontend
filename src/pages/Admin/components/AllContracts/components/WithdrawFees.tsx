import { Button } from '@chakra-ui/react';
import * as React from 'react';
import { useWithdrawFees } from '../../../../../chain-interaction/transactions';
import { ParsedStratMetaRow } from '../../../../../chain-interaction/views/strategies';
import { TransactionErrorDialog } from '../../../../../components/notifications/TransactionErrorDialog';

export default function WithdrawFees({
  stratMeta,
}: React.PropsWithChildren<{ stratMeta: ParsedStratMetaRow }>) {
  const { sendWithdrawFees, withdrawState } = useWithdrawFees(
    stratMeta.strategyAddress,
    stratMeta.token.address
  );

  const withdrawFees = () => {
    sendWithdrawFees!();
  };

  return (
    <>
      {sendWithdrawFees !== null ? (
        <>
          <TransactionErrorDialog
            state={withdrawState!}
            title={'Withdraw Fees'}
          />
          <Button onClick={withdrawFees}>Withdraw Fees</Button>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
