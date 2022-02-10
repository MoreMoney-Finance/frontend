import { Alert, AlertIcon, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LiquidatablePositionsContext } from '../../contexts/LiquidatablePositionsContext';

export default function LiquidatablePositionsMessage() {
  const liquidatablePositions = useContext(LiquidatablePositionsContext);

  const shouldDisplay = liquidatablePositions.find(
    (position) => position.liquidateButton
  );

  return (
    <>
      {shouldDisplay ? (
        <Alert
          status="info"
          justifyContent={'center'}
          fontSize={'lg'}
          borderRadius={'full'}
        >
          <AlertIcon />
          There are position(s) close to liquidation,&nbsp;
          <Link
            to="/liquidatable-positions"
            style={{ textDecoration: 'underline !important' }}
          >
            <Text decoration={'underline'}>check it out </Text>
          </Link>
        </Alert>
      ) : (
        ''
      )}
    </>
  );
}
