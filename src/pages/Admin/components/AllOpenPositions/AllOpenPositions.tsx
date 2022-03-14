import { parseEther } from '@ethersproject/units';
import * as React from 'react';
import { useUpdatedPositions } from '../../../../chain-interaction/contracts';
import { PositionsTable } from './components/PositionsTable';

export default function AllOpenPositions(
  props: React.PropsWithChildren<unknown>
) {
  const updatedPositions = useUpdatedPositions(1646182247947).filter(
    (position) => {
      return position?.collateralValue.value.gt(parseEther('0.01'));
    }
  );
  return (
    <>
      <div>
        <PositionsTable positions={updatedPositions} />
        {props.children}
      </div>
    </>
  );
}
