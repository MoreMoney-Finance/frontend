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

export function PositionBody({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: Record<string, ParsedStratMetaRow>;
}>) {
  const chosenStrategy = position?.strategy ?? Object.keys(stratMeta)[0];

  const positionRowHeight = '120px ';
  return (
    <>
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
          stratMeta={stratMeta}
          chosenStrategy={chosenStrategy}
        />
        <StrategyTokenInformation stratMeta={stratMeta[chosenStrategy]} />
      </Grid>
    </>
  );
}
