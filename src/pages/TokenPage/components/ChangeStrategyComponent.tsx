import {
  Button,
  Container,
  Flex,
  GridItem,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
// import { CurrencyValue } from '@usedapp/core';
// import { BigNumber } from 'ethers';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useInterestRate,
  YieldType,
} from '../../../chain-interaction/contracts';
import { LiquidationFeesContext } from '../../../contexts/LiquidationFeesContext';
import { stratFilter } from './change-strategy/StrategyNameAndSwitch';

export default function ChangeStrategyComponent({
  position,
  stratMeta,
  chosenStrategy,
  chooseStrategy,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  chooseStrategy: (strategyToChoose: string) => void;
  stratMeta: Record<string, ParsedStratMetaRow>;
  chosenStrategy: string;
}>) {
  const [viewStrategies, setViewStrategies] = React.useState(false);
  const tokenFees = React.useContext(LiquidationFeesContext);
  const interestRate = useInterestRate(BigNumber.from(0)).toNumber() / 100;
  const customAPY =
    chosenStrategy && stratMeta[chosenStrategy].underlyingAPY !== undefined
      ? stratMeta[chosenStrategy].underlyingAPY! + stratMeta[chosenStrategy].APY
      : stratMeta[chosenStrategy].APY;

  const data = Object.keys(stratMeta).map((key) => {
    const meta = stratMeta[key];
    return {
      strategyAddress: meta.strategyAddress,
      strategyName: meta.underlyingStrategyName ?? meta.strategyName,
      apy: meta.APY.toFixed(2) + '%',
      totalBorrowed: meta.totalDebt.format({ significantDigits: 2 }),
    };
  });

  const stratLabel =
    stratMeta[chosenStrategy].yieldType === YieldType.REPAYING
      ? 'Self-repaying loan'
      : stratMeta[chosenStrategy].underlyingStrategyName ??
        'Compound collateral';

  const options = Object.values(stratMeta).filter((strat) =>
    stratFilter(strat, position)
  );

  const isThereBetterAPY = options.some(
    (strat) => strat.APY > stratMeta[chosenStrategy].APY
  );

  const multipleOptions = options.length > 1;

  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
      <Container variant={'token'} position="relative" height="450px">
        {viewStrategies ? (
          <Flex
            flexDirection={'column'}
            h={'full'}
            padding="35px"
            gridGap="8px"
          >
            <Text
              fontSize="24px"
              color="white"
              fontWeight="600"
              textAlign="center"
            >
              Select Strategy
            </Text>
            <Flex
              w="full"
              justifyContent="space-between"
              alignContent="space-between"
              paddingX="15px"
              marginTop="20px"
            >
              <Text fontSize="16px" color="white" textAlign="center">
                Strategy Name
              </Text>
              <Text fontSize="16px" color="white" textAlign="center">
                Collateral APY
              </Text>
            </Flex>

            {data.map((row) => {
              return (
                <Container
                  key={`strategy-${row.strategyAddress}`}
                  cursor="pointer"
                  variant="token"
                  padding="35px"
                  _hover={{ opacity: '0.4' }}
                  onClick={() => {
                    setViewStrategies(false);
                    if (row.strategyAddress !== chosenStrategy) {
                      chooseStrategy(row.strategyAddress);
                    }
                  }}
                >
                  <Flex
                    alignContent="center"
                    alignItems="center"
                    w="full"
                    h="full"
                  >
                    <Flex
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text fontSize="16px" color="white">
                        {row.strategyName}
                      </Text>
                      <Text fontSize="24px" color="white">
                        {row.apy}
                      </Text>
                    </Flex>
                  </Flex>
                </Container>
              );
            })}
          </Flex>
        ) : (
          <Flex
            flexDirection={'column'}
            h={'full'}
            padding="28px"
            alignItems="baseline"
          >
            <Flex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              h={'100%'}
              w={'100%'}
            >
              <Flex direction="column" alignItems="center" p="12px">
                <Text color={'white'}>Strategy</Text>
                <Text fontSize="24px">{stratLabel}</Text>
              </Flex>

              {multipleOptions && (
                <Button
                  variant={isThereBetterAPY ? 'pink' : 'primary'}
                  width={'90%'}
                  onClick={() => {
                    setViewStrategies(true);
                  }}
                  borderRadius="12px"
                >
                  <Text variant="bodySmall">
                    {isThereBetterAPY
                      ? 'Change strategy for better APY'
                      : 'Change'}
                  </Text>
                </Button>
              )}
            </Flex>

            <Flex w={'full'} alignItems="baseline" marginTop="10px">
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
          </Flex>
        )}
      </Container>
    </GridItem>
  );
}
