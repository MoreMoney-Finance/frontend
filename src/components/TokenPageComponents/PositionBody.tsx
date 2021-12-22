import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
} from '../../chain-interaction/contracts';
import { Grid } from '@chakra-ui/react';
import { PositionData } from './PositionData';
import EditPosition from './EditPosition';
import CollateralAPY from './CollateralAPY';
import StrategyNameAndSwitch from './StrategyNameAndSwitch';
import StrategyTokenInformation from './StrategyTokenInformation';
import { useEthers } from '@usedapp/core';
import { useMigrateStrategy } from '../../chain-interaction/transactions';
import { StatusTrackModal } from '../StatusTrackModal';

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
  const { account } = useEthers();
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

  console.log('strategy', chosenStrategy);

  const positionRowHeight = '120px ';
  return (
    <>
      <StatusTrackModal
        state={migrateStrategyState}
        title={'Migrate Strategy'}
      />
      <Grid
        w={'full'}
        templateRows={`${position ? positionRowHeight : ''}240px 310px`}
        templateColumns="520px 240px 240px"
        h={'760px'}
        gap={'20px'}
        marginTop={'30px'}
      >
        {position && (
          <PositionData
            position={position}
            stratMeta={stratMeta[chosenStrategy]}
          />
        )}
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
