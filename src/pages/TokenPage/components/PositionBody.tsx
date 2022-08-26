import { Grid } from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../../chain-interaction/contracts';
import { stratFilter } from './change-strategy/StrategyNameAndSwitch';
import EditPosition from './edit/EditPosition';
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

  stratMeta = Object.fromEntries(
    Object.entries(stratMeta).filter(([, strat]) =>
      stratFilter(strat, position)
    )
  );

  const highestAPYStrategy: any = Object.values(
    Object.fromEntries(Object.entries(stratMeta))
  ).reduce((aggStrat, nextStrat) => {
    return {
      ...aggStrat,
      APY: aggStrat.APY > nextStrat.APY ? aggStrat.APY : nextStrat.APY,
      highestAPY:
        aggStrat.APY > nextStrat.APY
          ? aggStrat.strategyAddress
          : nextStrat.strategyAddress,
    };
  });

  const [chosenStrategy, setChosenStrategy] = React.useState<string>(
    position?.strategy ??
      highestAPYStrategy['highestAPY'] ??
      Object.keys(stratMeta)[0]
  );
  console.log('setChosenStrategy', setChosenStrategy);

  // const account = useContext(UserAddressContext);
  // const stable = useStable();
  // const { sendMigrateStrategy, migrateStrategyState } = useMigrateStrategy(
  //   position?.trancheContract,
  //   position?.token
  // );

  // function chooseStrategy(strategyToChoose: string) {
  //   if (position) {
  //     sendMigrateStrategy(
  //       position.trancheId,
  //       stratMeta[strategyToChoose].strategyAddress,
  //       stable,
  //       account!
  //     );
  //   } else {
  //     setChosenStrategy(strategyToChoose);
  //   }
  // }

  // console.log('strategy', chosenStrategy);

  return (
    <>
      {/* <TransactionErrorDialog
        state={migrateStrategyState}
        title={'Migrate Strategy'}
      /> */}
      <Grid
        templateColumns={[
          'repeat(1, 1fr)',
          'repeat(1, 1fr)',
          '520px 240px 240px',
        ]}
        templateRows={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'auto']}
        w={'full'}
        gap={'20px'}
        marginTop={'30px'}
      >
        {position && position.collateralValue.value.gt(parseEther('0.01')) && (
          <PositionData
            position={position}
            stratMeta={stratMeta[chosenStrategy]}
          />
        )}
      </Grid>

      <Grid
        templateColumns={[
          'repeat(1, 1fr)',
          'repeat(5, 1fr)',
          '520px 240px 240px',
        ]}
        templateRows={['repeat(2, 1fr)', 'repeat(2, 1fr)', '340px 240px 410px']}
        w={'full'}
        gap={'20px'}
        marginTop={'30px'}
      >
        <EditPosition
          position={position}
          stratMeta={stratMeta[chosenStrategy]}
        />

        {/* <CollateralAPY stratMeta={stratMeta} chosenStrategy={chosenStrategy} />
        <StrategyNameAndSwitch
          position={position}
          chooseStrategy={chooseStrategy}
          stratMeta={stratMeta}
          chosenStrategy={chosenStrategy}
        /> */}
        <StrategyTokenInformation stratMeta={stratMeta[chosenStrategy]} />
      </Grid>
    </>
  );
}
