import { Grid } from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import * as React from 'react';
import { useContext } from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
} from '../../../chain-interaction/views/contracts';
import { useMigrateStrategy } from '../../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import StrategyNameAndSwitch from './change-strategy/StrategyNameAndSwitch';
import EditPosition from './edit/EditPosition';
import CollateralAPY from './metadata/CollateralAPY';
import { PositionData } from './PositionData';
import StrategyTokenInformation from './StrategyTokenInformation';

export function PositionBody({
  position: inputPos,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: Record<string, ParsedStratMetaRow>;
}>) {
  const position =
    inputPos &&
    inputPos.collateralValue.value.gt(parseEther('0.01')) &&
    inputPos.strategy in stratMeta
      ? inputPos
      : undefined;

  const [chosenStrategy, setChosenStrategy] = React.useState<string>(
    position?.strategy ?? Object.keys(stratMeta)[0]
  );
  const account = useContext(UserAddressContext);
  const stable = useStable();
  const { sendMigrateStrategy, migrateStrategyState } = useMigrateStrategy(
    position?.trancheContract
  );

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

      {position && position.collateralValue.value.gt(parseEther('0.01')) && (
        <PositionData
          position={position}
          stratMeta={stratMeta[chosenStrategy]}
        />
      )}
      <Grid
        templateColumns={[
          'repeat(1, 1fr)',
          'repeat(5, 1fr)',
          '520px 240px 240px',
        ]}
        templateRows={[
          'repeat(2, 1fr)',
          'repeat(2, 1fr)',
          'auto 340px 240px 310px',
        ]}
        w={'full'}
        gap={'20px'}
        marginTop={'30px'}
      >
        <EditPosition
          position={position}
          stratMeta={stratMeta[chosenStrategy]}
        />

        <CollateralAPY stratMetaData={stratMeta[chosenStrategy]} />
        <StrategyNameAndSwitch
          position={position}
          chooseStrategy={chooseStrategy}
          stratMeta={stratMeta}
          chosenStrategy={chosenStrategy}
        />
        <StrategyTokenInformation stratMeta={stratMeta[chosenStrategy]} />
      </Grid>
    </>
  );
}
