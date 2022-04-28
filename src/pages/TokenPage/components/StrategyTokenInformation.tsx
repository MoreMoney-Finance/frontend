import {
  // Button,
  Container,
  Flex,
  GridItem,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react';
// import { CurrencyValue } from '@usedapp/core';
// import { BigNumber } from 'ethers';
import * as React from 'react';
import // useStable,
// useEstimatedHarvestable,
// YieldType,
'../../../chain-interaction/views/contracts';
// import {
//   useAMMHarvest,
//   useHarvestPartially,
// } from '../../../chain-interaction/transactions';
// import { TransactionErrorDialog } from '../../../components/notifications/TransactionErrorDialog';
import { LiquidationFeesContext } from '../../../contexts/LiquidationFeesContext';
import lines from '../../../assets/img/lines.svg';
import { ParsedPositionMetaRow } from '../../../chain-interaction/views/positions';
import { ParsedStratMetaRow } from '../../../chain-interaction/views/strategies';

export default function StrategyTokenInformation({
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const calcCRatio = () => {
    return `${Math.round((1 / (stratMeta.borrowablePercent / 100)) * 100)}%`;
  };

  // const { sendAMMHarvest, AMMHarvestState } = useAMMHarvest(
  //   stratMeta.strategyAddress
  // );

  const tokenFees = React.useContext(LiquidationFeesContext);

  // const { sendHarvestPartially, harvestPartiallyState } = useHarvestPartially(
  //   stratMeta.strategyAddress
  // );

  // const stable = useStable();
  // const estimatedHarvestable: BigNumber | undefined = useEstimatedHarvestable(
  //   stratMeta.strategyAddress,
  //   stratMeta.token.address
  // );
  // const harvestLabel = estimatedHarvestable
  //   ? ` $ ${new CurrencyValue(stable, estimatedHarvestable).format({
  //     fixedPrecisionDigits: 0,
  //     useFixedPrecision: true,
  //     suffix: '',
  //     prefix: '',
  //   })}`
  //   : '';
  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 2]}>
      <Container variant={'token'} position="relative">
        <Image
          src={lines}
          position="absolute"
          right="0"
          bottom="0"
          pointerEvents="none"
          zIndex={0}
        />
        {/* <TransactionErrorDialog state={AMMHarvestState} title={'AMM Harvest'} />
        <TransactionErrorDialog
          state={harvestPartiallyState}
          title={'Source harvest'}
        /> */}
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignContent={'center'}
          alignItems={'center'}
          h={'full'}
          padding={'30px 130px 40px 40px'}
        >
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
            <Text variant={'bodyLarge'}>{calcCRatio()}</Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Max Loan-To-Value
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>
              {Math.round(stratMeta.borrowablePercent)}%
            </Text>
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
          {/* 
          {stratMeta.yieldType !== YieldType.COMPOUNDING && false ? (
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
          ) : undefined} */}
        </Flex>
      </Container>
    </GridItem>
  );
}
