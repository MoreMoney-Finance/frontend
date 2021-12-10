import { Box, Grid, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ParsedStratMetaRow } from '../chain-interaction/contracts';
import { useUpdatePriceOracle } from '../chain-interaction/transactions';
import { StatusTrackModal } from './StatusTrackModal';

export function TokenData({
  tokenData,
  liquidationFee,
}: {
  tokenData: ParsedStratMetaRow | null | undefined;
  liquidationFee: BigNumber;
}) {
  const location = useLocation();
  const details = location.search.includes('details=true');

  const { sendUpdatePriceOracle, updatePriceOracleState } =
    useUpdatePriceOracle(tokenData?.token);

  console.log(details, liquidationFee, sendUpdatePriceOracle);

  return tokenData ? (
    <>
      <StatusTrackModal state={updatePriceOracleState} title="Price Oracle" />
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
              {' '}
              COLLATERAL (USD){' '}
            </Text>
            <Text fontSize="md"> $1,000,000 </Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              POSITION APY
            </Text>
            <Text fontSize="md"> 20%</Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              DEBT
            </Text>
            <Text fontSize="md"> {tokenData.debtCeiling.format()}</Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              CRATIO
            </Text>
            <Text fontSize="md">
              {' '}
              {((1 / (tokenData.borrowablePercent / 100)) * 100).toFixed(2)} %
            </Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              LIQUIDATION PRICE
            </Text>
            <Text fontSize="md"> $200</Text>
          </Box>
          <Box textAlign={'start'}>
            <Text fontSize="lg" color={'gray'}>
              Strategy
            </Text>
            <Text fontSize="lg" textDecoration={'underline'}>
              {' '}
              <a href="#">self repaying loan</a>
            </Text>
          </Box>
        </Grid>
      </Box>
      {/* <Table variant="simple" width="auto">
        <Tbody>
          <Tr>
            <Th>Debt Ceiling</Th>
            <Td>{tokenData.debtCeiling.format()}</Td>
          </Tr>
          <Tr>
            <Th>Total Debt</Th>
            <Td>{tokenData.totalDebt.format()}</Td>
          </Tr>
          <Tr>
            <Th>Minting Fee</Th>
            <Td>{tokenData.mintingFeePercent.toString()} %</Td>
          </Tr>
          <Tr>
            <Th>Liquidation Fee</Th>
            <Td>{(liquidationFee.toNumber() / 100).toFixed(2)}%</Td>
          </Tr>
          <Tr>
            <Th>Minimum colateralization ratio</Th>
            <Td>
              {((1 / (tokenData.borrowablePercent / 100)) * 100).toFixed(2)} %
            </Td>
          </Tr>
          <Tr>
            <Th>USD Price</Th>
            <Td>
              {tokenData.usdPrice.toString()}{' '}
              <Button onClick={sendUpdatePriceOracle} size="sm">
                Update
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table> */}
    </>
  ) : (
    <> </>
  );
}
