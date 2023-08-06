import { Container, Flex, GridItem, Spacer, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
// import { CurrencyValue } from '@usedapp/core';
// import { BigNumber } from 'ethers';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useInterestRate,
} from '../../../chain-interaction/contracts';
import { LiquidationFeesContext } from '../../../contexts/LiquidationFeesContext';
import StrategyNameAndSwitch from './change-strategy/StrategyNameAndSwitch';

export default function StrategyTokenInformation({
  stratMeta,
  chosenStrategy,
  chooseStrategy,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  chooseStrategy: (strategyToChoose: string) => void;
  stratMeta: Record<string, ParsedStratMetaRow>;
  chosenStrategy: string;
}>) {
  // const calcCRatio = () => {
  //   return `${Math.round(
  //     (1 / (stratMeta[chosenStrategy].borrowablePercent / 100)) * 100
  //   )}%`;
  // };

  // const { sendAMMHarvest, AMMHarvestState } = useAMMHarvest(
  //   stratMeta.strategyAddress
  // );

  const tokenFees = React.useContext(LiquidationFeesContext);
  const interestRate = useInterestRate(BigNumber.from(0)).toNumber() / 100;
  console.log('interestRate', interestRate.toString());
  const customAPY =
    chosenStrategy && stratMeta[chosenStrategy].underlyingAPY !== undefined
      ? stratMeta[chosenStrategy].underlyingAPY! + stratMeta[chosenStrategy].APY
      : stratMeta[chosenStrategy].APY;
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
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
      <Container variant={'token'} position="relative">
        {/* <TransactionErrorDialog state={AMMHarvestState} title={'AMM Harvest'} />
        <TransactionErrorDialog
          state={harvestPartiallyState}
          title={'Source harvest'}
        /> */}
        <StrategyNameAndSwitch
          stratMeta={stratMeta}
          chooseStrategy={chooseStrategy}
          chosenStrategy={chosenStrategy}
        />
        {/* <Flex direction="column" alignItems="center" p="12px">
          <Text color={'white'}>Strategy</Text>
          <Text fontSize="24px">{stratMeta[chosenStrategy].strategyName}</Text>
          <Button variant="primary" colorScheme="whiteAlpha" mt="12px" w="full">
            Change
          </Button>
        </Flex> */}
        <Flex
          flexDirection={'column'}
          h={'full'}
          padding="28px"
          alignItems="baseline"
        >
          <Flex w={'full'} alignItems="baseline">
            <Text variant="h200">Collateral APY</Text>
            <Spacer />
            <Text fontSize="40px">{customAPY.toFixed(2) ?? ''}%</Text>
          </Flex>
          <Flex w={'full'} marginTop={'10px'} alignItems="baseline">
            <Text variant="h200">Interest Rate</Text>
            <Spacer />
            <Text fontSize="40px">{interestRate.toString() ?? ''}%</Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'} alignItems="baseline">
            <Text variant="h200">Liquidation Fee</Text>
            <Spacer />
            <Text fontSize="24px">
              {tokenFees.get(stratMeta[chosenStrategy].token.address) + '%'}
            </Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'} alignItems="baseline">
            <Text variant="h200">Borrow Fee</Text>
            <Spacer />
            <Text fontSize="24px">
              {stratMeta[chosenStrategy].mintingFeePercent.toFixed(2)}%
            </Text>
          </Flex>
          {/* <Flex w={'full'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Interest Rate
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>{interestRate.toString() ?? ''}%</Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
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
              {`${5 * Math.round(stratMeta.borrowablePercent / 5)}%`}
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
