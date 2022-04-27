import { Button, VStack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useMigrateStrategy } from '../../../../chain-interaction/transactions';
import {
  TxStatus,
  useStable,
} from '../../../../chain-interaction/views/contracts';
import { ParsedPositionMetaRow } from '../../../../chain-interaction/views/positions';
import { ParsedStratMetaRow } from '../../../../chain-interaction/views/strategies';
import { TransactionErrorDialog } from '../../../../components/notifications/TransactionErrorDialog';
import { UserAddressContext } from '../../../../contexts/UserAddressContext';
import { StrategyDataTable } from './StrategyDataTable';

export function MigrateStrategy(
  params: ParsedStratMetaRow & ParsedPositionMetaRow
) {
  const { strategyAddress, strategyName, trancheId, trancheContract } = params;
  const account = useContext(UserAddressContext);

  const stable = useStable();
  const { sendMigrateStrategy, migrateStrategyState } =
    useMigrateStrategy(trancheContract);

  return (
    <VStack>
      <TransactionErrorDialog
        state={migrateStrategyState}
        title={'Migrate Strategy'}
      />
      <Button
        onClick={() => {
          // console.log(
          //   'sending migrate strategy',
          //   trancheId,
          //   strategyAddress,
          //   stable,
          //   account
          // );
          sendMigrateStrategy(trancheId, strategyAddress, stable, account!);
        }}
        isLoading={migrateStrategyState.status == TxStatus.SUCCESS}
      >
        Migrate to {strategyName} strategy
      </Button>
      <StrategyDataTable {...params} />
    </VStack>
  );
}
