import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';
import { Grid } from '@chakra-ui/react';
import { PositionData } from './PositionData';
import EditPosition from './EditPosition';
import CollateralAPY from './CollateralAPY';
import StrategyNameAndSwitch from './StrategyNameAndSwitch';
import StrategyTokenInformation from './StrategyTokenInformation';
import { TokenDataStatistics } from './TokenDataStatistics';

export function PositionBody({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: Record<string, ParsedStratMetaRow>;
}>) {
  const chosenStrategy = position?.strategy ?? Object.keys(stratMeta)[0];

  return (
    <>
      {position && (
        <PositionData
          position={position}
          stratMeta={stratMeta[chosenStrategy]}
        />
      )}
      <Grid
        w={'full'}
        templateRows="120px 240px 310px"
        templateColumns="520px 240px 240px"
        h={'760px'}
        gap={'20px'}
        marginTop={'30px'}
      >
        <TokenDataStatistics stratMeta={stratMeta[chosenStrategy]} />
        <EditPosition
          position={position}
          stratMeta={stratMeta[chosenStrategy]}
        />

        <CollateralAPY stratMetaData={stratMeta[chosenStrategy]} />
        <StrategyNameAndSwitch
          stratMeta={stratMeta}
          chosenStrategy={chosenStrategy}
        />
        <StrategyTokenInformation stratMeta={stratMeta[chosenStrategy]} />
      </Grid>
    </>
  );
}
