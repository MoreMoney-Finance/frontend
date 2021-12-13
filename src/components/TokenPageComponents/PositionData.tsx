import { Box, Grid, Text } from '@chakra-ui/react';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';

export function PositionData({
  position,
  stratMeta,
}: {
  position: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}) {
  return (
    <>
      <Box
        borderWidth="1px"
        width={'full'}
        height={'150px'}
        borderRadius={'lg'}
      >
        <Grid
          templateColumns="repeat(6, 1fr)"
          gap={2}
          height={'full'}
          justifyContent={'center'}
          alignContent={'center'}
          alignItems={'center'}
          justifyItems={'center'}
        >
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              COLLATERAL
            </Text>
            <Text fontSize="md">
              {' '}
              {position.collateral?.format({
                significantDigits: Infinity,
              })}{' '}
            </Text>
          </Box>

          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              COLLATERAL (USD)
            </Text>
            <Text fontSize="md">
              {' '}
              ${' '}
              {position.collateralValue.format({
                prefix: '',
                suffix: '',
              })}{' '}
            </Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              DEBT
            </Text>
            <Text fontSize="md"> {position.debt.format()}</Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              CRATIO
            </Text>
            <Text fontSize="md">
              {position.debt.isZero()
                ? '∞'
                : (
                  position.collateralValue.value
                    .mul(10000)
                    .div(position.debt.value)
                    .toNumber() / 100
                ).toFixed(2)}{' '}
              %
            </Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              LIQUIDATION PRICE
            </Text>
            <Text fontSize="md">
              {' '}
              $ {position.liquidationPrice.toFixed(2)}{' '}
            </Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              Strategy
            </Text>
            <Text fontSize="lg" textDecoration={'underline'}>
              {' '}
              <a href="#">{stratMeta.strategyName}</a>
            </Text>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
