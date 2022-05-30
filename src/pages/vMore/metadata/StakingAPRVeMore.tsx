import {
  Container,
  Flex,
  GridItem,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { formatEther } from '@ethersproject/units';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import lines from '../../../assets/img/lines.svg';
import {
  useAddresses,
  useTotalSupplyToken,
} from '../../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../../chain-interaction/tokens';
import {
  useGetStakedMoreVeMoreToken,
  useClaimableVeMoreToken,
} from '../../../chain-interaction/transactions';
import { UserAddressContext } from '../../../contexts/UserAddressContext';
import { formatNumber } from '../../../utils';

export function StakingAPRVeMoreToken(props: React.PropsWithChildren<unknown>) {
  const addresses = useAddresses();
  const totalSupplyStakedVeMore = formatEther(
    useTotalSupplyToken(addresses.VeMoreToken, 'totalSupply', [], 0)
  );
  const account = React.useContext(UserAddressContext);
  const { chainId } = useEthers();
  const veMoreTokenToken = getTokenFromAddress(
    chainId,
    useAddresses().VeMoreToken
  );
  const moreToken = getTokenFromAddress(chainId, useAddresses().MoreToken);

  const stakedMore = useGetStakedMoreVeMoreToken(account!);
  const claimableVeMoreToken = useClaimableVeMoreToken(account!);

  const stakedMoreBalance = new CurrencyValue(
    moreToken,
    BigNumber.from(stakedMore)
  );
  const claimableVeMoreTokenBalance = new CurrencyValue(
    veMoreTokenToken,
    BigNumber.from(claimableVeMoreToken)
  );

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
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Staked MORE
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>{stakedMoreBalance.format()}</Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Claimable
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>
              {' '}
              {claimableVeMoreTokenBalance.format()}
            </Text>
          </Flex>
          <Flex w={'full'} marginTop={'30px'}>
            <Text variant="h200" color={'whiteAlpha.400'}>
              Total veMore Supply
            </Text>
            <Spacer />
            <Text variant={'bodyLarge'}>
              {formatNumber(parseFloat(totalSupplyStakedVeMore))}
            </Text>
          </Flex>
        </Flex>
        {props?.children}
      </Container>
    </GridItem>
  );
}
