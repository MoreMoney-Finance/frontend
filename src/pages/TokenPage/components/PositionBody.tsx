import { Grid } from '@chakra-ui/react';
import * as React from 'react';
import { useContext } from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
} from '../../../chain-interaction/contracts';
import { useMigrateStrategy } from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import CollateralAPY from './metadata/CollateralAPY';
import EditPosition from './edit/EditPosition';
import { PositionData } from './PositionData';
import StrategyNameAndSwitch from './change-strategy/StrategyNameAndSwitch';
import StrategyTokenInformation from './StrategyTokenInformation';

export function PositionBody({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: Record<string, ParsedStratMetaRow>;
}>) {
  const [chosenStrategy, setChosenStrategy] = React.useState<string>(
    position?.strategy ?? Object.keys(stratMeta)[0]
  );
  const account = useContext(UserAddressContext);
  const stable = useStable();
  const { sendMigrateStrategy, migrateStrategyState } = useMigrateStrategy();

  function chooseStrategy(strategyToChoose: string) {
    if (position) {
      sendMigrateStrategy(
        position.trancheId,
        stratMeta[strategyToChoose].strategyAddress,
        stable,
        account!
      );
    } else {
      setChosenStrategy(strategyToChoose);
    }
  }

  // console.log('strategy', chosenStrategy);

  return (
    <>
      <TransactionErrorDialog
        state={migrateStrategyState}
        title={'Migrate Strategy'}
      />

      {position && (
        <PositionData
          position={position}
          stratMeta={stratMeta[chosenStrategy]}
        />
      )}
      <Grid
        templateColumns={['repeat(1, 1fr)', 'repeat(5, 1fr)', 'repeat(4, 1fr)']}
        templateRows="repeat(2, 1fr)"
        w={'full'}
        gap={'20px'}
        marginTop={'20px'}
      >
        <EditPosition
          position={position}
          stratMeta={stratMeta[chosenStrategy]}
        />

        <CollateralAPY stratMetaData={stratMeta[chosenStrategy]} />
        <StrategyNameAndSwitch
          chooseStrategy={chooseStrategy}
          stratMeta={stratMeta}
          chosenStrategy={chosenStrategy}
        />
        <StrategyTokenInformation stratMeta={stratMeta[chosenStrategy]} />
      </Grid>
    </>
  );
}
