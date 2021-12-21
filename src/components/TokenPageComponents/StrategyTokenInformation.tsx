import {
  Box,
  Container,
  Flex,
  GridItem,
  Spacer,
  Text,
  Image,
  Button,
} from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useEstimatedHarvestable,
  useStable,
  YieldType,
} from '../../chain-interaction/contracts';
import lines from '../../assets/img/lines.svg';
import { BigNumber } from 'ethers';
import { CurrencyValue } from '@usedapp/core';
import {
  useAMMHarvest,
  useHarvestPartially,
} from '../../chain-interaction/transactions';
import { StatusTrackModal } from '../StatusTrackModal';
import { LiquidationFeesContext } from '../../contexts/LiquidationFeesContext';

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

  const { sendAMMHarvest, AMMHarvestState } = useAMMHarvest(
    stratMeta.strategyAddress
  );

  const tokenFees = React.useContext(LiquidationFeesContext);

  const { sendHarvestPartially, harvestPartiallyState } = useHarvestPartially(
    stratMeta.strategyAddress
  );

  const stable = useStable();
  const estimatedHarvestable: BigNumber | undefined = useEstimatedHarvestable(
    stratMeta.strategyAddress,
    stratMeta.token.address
  );
  const harvestLabel = estimatedHarvestable
    ? ` $ ${new CurrencyValue(stable, estimatedHarvestable).format({
      fixedPrecisionDigits: 0,
      useFixedPrecision: true,
      suffix: '',
      prefix: '',
    })}`
    : '';
  return (
    <GridItem colSpan={2} rowSpan={1}>
      <Container variant={'token'} position="relative">
        <Image
          src={lines}
          position="absolute"
          right="0"
          bottom="0"
          pointerEvents="none"
          zIndex={0}
        />
        <StatusTrackModal state={AMMHarvestState} title={'AMM Harvest'} />
        <StatusTrackModal
          state={harvestPartiallyState}
          title={'Source harvest'}
        />
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
              <Text variant={'bodyLarge'}>
                {tokenFees.get(stratMeta.token.address) + '%'}
              </Text>
            </Flex>
            {/* <Flex w={'full'} marginTop={'30px'}>
              <Text variant="h200" color={'whiteAlpha.400'}>
                Stability fee
              </Text>
              <Spacer />
              <Text variant={'bodyLarge'}>
                {stratMeta.stabilityFeePercent.toFixed(2)}%
              </Text>
            </Flex> */}
            <Flex w={'full'} marginTop={'30px'}>
              <Text variant="h200" color={'whiteAlpha.400'}>
                Harvestable
              </Text>
              <Spacer />
              <Button
                borderRadius={'full'}
                width={'auto'}
                marginTop="-5px"
                marginRight="-20px"
                onClick={() => {
                  if (stratMeta.yieldType === YieldType.REPAYING) {
                    sendAMMHarvest(stratMeta.token.address);
                  } else if (stratMeta.yieldType === YieldType.COMPOUNDING) {
                    sendHarvestPartially(stratMeta.token.address);
                  }
                }}
              >
                <Text variant="bodySmall">{`Harvest${harvestLabel}`}</Text>
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </GridItem>
  );
}
