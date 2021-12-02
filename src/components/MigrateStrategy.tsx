import { Button, VStack } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
  useStable,
} from '../chain-interaction/contracts';
import { useMigrateStrategy } from '../chain-interaction/transactions';
import { StrategyDataTable } from './StrategyDataTable';

export function MigrateStrategy(
  params: ParsedStratMetaRow & ParsedPositionMetaRow
) {
  const { strategyAddress, strategyName, trancheId } = params;
  const { account } = useEthers();

  const stable = useStable();
  const { sendMigrateStrategy, migrateStrategyState } = useMigrateStrategy();

  return (
    <VStack>
      <Button
        onClick={() => {
          console.log(
            'sending migrate strategy',
            trancheId,
            strategyAddress,
            stable,
            account
          );
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
