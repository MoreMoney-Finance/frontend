import { Alert, AlertIcon } from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import * as React from 'react';
import {
  useGlobalDebtCeiling,
  useTotalSupply,
} from '../chain-interaction/contracts';

export default function GlobalDebtCeilingMessage() {
  const globalDebtCeiling = useGlobalDebtCeiling(
    'globalDebtCeiling',
    [],
    BigNumber.from(0)
  );
  const totalSupply = useTotalSupply('totalSupply', [], undefined);
  const hasMaxedOut =
    totalSupply && totalSupply.gt(globalDebtCeiling.sub(parseEther('1000')));

  return (
    <>
      {hasMaxedOut ? (
        <Alert
          status="info"
          justifyContent={'center'}
          fontSize={'lg'}
          borderRadius={'full'}
        >
          <AlertIcon />
          <b>Global debt ceiling has been maxed out, please come back later!</b>
        </Alert>
      ) : (
        ''
      )}
    </>
  );
}
