import {
  Box,
  Container,
  Flex,
  GridItem,
  Spacer,
  Text,
  Image,
} from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../chain-interaction/contracts';
import lines from '../../assets/img/lines.svg';

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

  const countCRation = () => {
    return `${((1 / (stratMeta.borrowablePercent / 100)) * 100).toFixed(2)}%`;
  };

  return (
    <GridItem colSpan={2} rowSpan={1}>
      <Container variant={'token'} position="relative">
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignContent={'center'}
          alignItems={'center'}
          padding={'30px 130px 40px 40px'}
        >
          <Box w={'full'}>
            <Flex w={'full'}>
              <Text variant="h200" color={'whiteAlpha.400'}>
                Borrow Fee
              </Text>
              <Spacer />
              <Text variant={'bodyLarge'}>
                {stratMeta.mintingFeePercent.toFixed(2)}%
              </Text>
            </Flex>
            <Flex w={'full'} marginTop={'30px'}>
              <Text variant="h200" color={'whiteAlpha.400'}>
                Minimum cRatio
              </Text>
              <Spacer />
              <Text variant={'bodyLarge'}>{countCRation()}</Text>
            </Flex>
            <Flex w={'full'} marginTop={'30px'}>
              <Text variant="h200" color={'whiteAlpha.400'}>
                Liquidation Fee
              </Text>
              <Spacer />
              <Text variant={'bodyLarge'}>10%</Text>
            </Flex>
            <Flex w={'full'} marginTop={'30px'}>
              <Text variant="h200" color={'whiteAlpha.400'}>
                Stability fee
              </Text>
              <Spacer />
              <Text variant={'bodyLarge'}>
                {stratMeta.stabilityFeePercent.toFixed(2)}%
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Image
          src={lines}
          position="absolute"
          right="0"
          bottom="0"
          pointerEvents="none"
        />
      </Container>
    </GridItem>
  );
}
