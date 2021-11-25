import { Box, VStack } from '@chakra-ui/react';
import { Interface } from '@ethersproject/abi/lib/interface';
import { ContractCall, Token, useContractCalls } from '@usedapp/core';
import React from 'react';
import { useAddresses } from '../chain-interaction/contracts';
import { getTokenFromAddress } from '../chain-interaction/tokens';
import YieldConversionBidStrategy from '../contracts/artifacts/contracts/YieldConversionBidStrategy.sol/YieldConversionBidStrategy.json';
import { ConvertReward } from './ConvertReward';

export function ConvertAllRewards() {
  const addresses = useAddresses();

  const strategies = [
    addresses.TraderJoeMasterChefStrategy,
    addresses.PangolinStakingRewardsStrategy,
  ].filter((x) => x);

  function convert2ContractCall(strategyAddress: string) {
    return {
      abi: new Interface(YieldConversionBidStrategy.abi),
      address: strategyAddress,
      method: 'rewardToken',
      args: [],
    };
  }
  const calls: ContractCall[] = strategies.map(convert2ContractCall);
  const rewardTokenAddresses: string[][] =
    (useContractCalls(calls) as string[][]) ?? [];

  const convertArgs = rewardTokenAddresses
    .map((resultRow, i) => ({
      i,
      strategyAddress: strategies[i],
      rewardToken: resultRow
        ? getTokenFromAddress(resultRow[0])!
        : undefined,
    }))
    .filter((x) => x.rewardToken) as {
    i: number;
    strategyAddress: string;
    rewardToken: Token;
  }[];

  console.log('reward token addresses');
  console.log(rewardTokenAddresses);

  return (
    <Box>
      <VStack>
        {convertArgs.map((args) => (
          <ConvertReward key={args.i} {...args} />
        ))}
      </VStack>
    </Box>
  );
}
