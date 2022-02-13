import {
  Container,
  Flex,
  GridItem,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react';
import * as React from 'react';
import lines from '../../../assets/img/lines.svg';
import { ExternalMetadataContext } from '../../../contexts/ExternalMetadataContext';
import { formatNumber } from '../../../utils';

export function StakingAPR(props: React.PropsWithChildren<unknown>) {
  const { xMoreData } = React.useContext(ExternalMetadataContext);

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
            <Text variant={'bodyLarge'}>
              {xMoreData?.cachedAPR.toFixed(2)}%
            </Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Total Supply
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>
              {formatNumber(xMoreData?.totalSupply)}
            </Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              MORE / xMORE
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>
              {formatNumber(xMoreData?.currentRatio)}
            </Text>
          </Flex>
        </Flex>
        {props?.children}
      </Container>
    </GridItem>
  );
}
