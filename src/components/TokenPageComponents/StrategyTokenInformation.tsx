import { Box, Container, Flex, GridItem, Spacer, Text } from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';

export default function StrategyTokenInformation({
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  // const liquidationRewardPer10k: BigNumber = useIsolatedLendingLiquidationView(
  //   'liquidationRewardPer10k',
  //   [stratMeta.token.address],
  //   BigNumber.from(0)
  // );
  return (
    <GridItem colSpan={4} rowSpan={2}>
      <Container variant={'token'}>
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignContent={'center'}
          alignItems={'center'}
          paddingLeft={'100px'}
          paddingRight={'100px'}
        >
          <Box w={'full'}>
            <Flex w={'full'}>
              <Text>Borrow Fee</Text>
              <Spacer />
              <Text>
                <b>{stratMeta.mintingFeePercent.toFixed(2)} %</b>
              </Text>
            </Flex>
            <br />
            <Flex w={'full'}>
              <Text>Minimum cRatio</Text>
              <Spacer />
              <Text>
                <b>
                  {((1 / (stratMeta.borrowablePercent / 100)) * 100).toFixed(2)}{' '}
                  %
                </b>
              </Text>
            </Flex>
            <br />
            <Flex w={'full'}>
              <Text>Liquidation Fee</Text>
              <Spacer />
              <Text>
                <b>10 %</b>
              </Text>
            </Flex>
            <br />
            <Flex w={'full'}>
              <Text>Stability fee</Text>
              <Spacer />
              <Text>
                <b>{stratMeta.stabilityFeePercent.toFixed(2)} %</b>
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </GridItem>
  );
}
