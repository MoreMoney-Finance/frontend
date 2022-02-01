import {
  Container,
  Flex,
  GridItem,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react';
import {
  CurrencyValue,
  Token,
  useEthers,
  useTokenBalance,
} from '@usedapp/core';
import { BigNumber } from '@usedapp/core/node_modules/ethers';
import * as React from 'react';
import {
  useAddresses,
  xMoreTotalSupply,
} from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import xMoreData from '../../../constants/xmore-data.json';
import { parseFloatCurrencyValue } from '../../../utils';
import lines from '../../../assets/img/lines.svg';

export function StakingAPR(props: React.PropsWithChildren<unknown>) {
  const { chainId } = useEthers();
  const totalSupply = xMoreTotalSupply('totalSupply', [], BigNumber.from(0));
  const { xMore, MoreToken } = useAddresses();
  const moreBalance = useTokenBalance(MoreToken, xMore) ?? BigNumber.from(0);

  const supply = new CurrencyValue(
    new Token('xMORE', 'xMORE', chainId!, xMore),
    totalSupply
  );

  const balance = new CurrencyValue(
    getTokenFromAddress(chainId, MoreToken),
    moreBalance
  );

  const currentRatio = supply.isZero()
    ? 1
    : parseFloatCurrencyValue(balance) / parseFloatCurrencyValue(supply);

  const cachedRatio =
    xMoreData.totalSupply === 0
      ? 1
      : xMoreData.moreBalance / xMoreData.totalSupply;

  let finalAPR = 0;

  if (currentRatio !== cachedRatio) {
    const diff = currentRatio - cachedRatio;
    const currentAPR =
      ((100 * diff) / currentRatio) *
      ((365 * 24 * 60 * 60 * 1000) / (Date.now() - xMoreData.timestamp));
    finalAPR = (xMoreData.cachedAPR + currentAPR) / 2;
  } else {
    finalAPR = xMoreData.cachedAPR;
  }

  return (
    <GridItem rowSpan={[12, 12, 1]} colSpan={[12, 12, 1]}>
      <Container variant={'token'} padding={'30px'}>
        <Image
          src={lines}
          position="absolute"
          right="0"
          bottom="0"
          pointerEvents="none"
          zIndex={0}
        />
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignContent={'center'}
          alignItems={'center'}
          h={'full'}
          padding={'30px 80px 40px 40px'}
        >
          <Flex w={'full'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Approximate APR
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>{finalAPR}%</Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Total Supply
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>{supply.format()}</Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              MORE / xMORE
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>{currentRatio}</Text>
          </Flex>
        </Flex>
        {props?.children}
      </Container>
    </GridItem>
  );
}
