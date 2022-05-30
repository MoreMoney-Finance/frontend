import { Box, Container, Flex, Text } from '@chakra-ui/react';
import { formatEther } from '@ethersproject/units';
import * as React from 'react';
import {
  useAddresses,
  useBalanceOfToken,
  useTotalSupplyToken,
} from '../../chain-interaction/contracts';
import { useGetStakedMoreVeMoreToken } from '../../chain-interaction/transactions';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { formatNumber } from '../../utils';
import StakeBox from './components/StakeBox';

export default function StakePage({
  children,
}: React.PropsWithChildren<unknown>) {
  const account = React.useContext(UserAddressContext);
  const addresses = useAddresses();
  //xmore data
  const totalStakedXMore = formatEther(
    useBalanceOfToken(addresses.xMore, [addresses.xMore], 0)
  );
  const yourStakeXMore = formatEther(
    useBalanceOfToken(addresses.xMore, [account], 0)
  );
  const totalSupplyStakedXMore = formatEther(
    useTotalSupplyToken(addresses.xMore, 'totalSupply', [], 0)
  );

  //veMore data
  const totalStakedVeMore = formatEther(
    useBalanceOfToken(addresses.MoreToken, [addresses.VeMoreStaking], 0)
  );
  const yourStakeVeMore = formatEther(useGetStakedMoreVeMoreToken(account!));
  const totalSupplyStakedVeMore = formatEther(
    useTotalSupplyToken(addresses.VeMoreToken, 'totalSupply', [], 0)
  );

  return (
    <Flex flexDirection={'column'}>
      <Box textAlign="center" margin="50px 10px 50px 10px">
        <Text fontSize={['36', '48', '48']} lineHeight="56px">
          <b>Maximize yield by staking MORE</b>
        </Text>
      </Box>
      <Flex flexDirection={['column', 'column', 'row', 'row']}>
        <Box w="100%" h="auto" padding={'36px'}>
          <Container variant={'token'}>
            <StakeBox
              img="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/xMORE%20logo.png"
              title={'xMore'}
              link="/xmore"
              totalStaked={formatNumber(parseFloat(totalStakedXMore))}
              yourStake={formatNumber(parseFloat(yourStakeXMore))}
              totalSupply={formatNumber(parseFloat(totalSupplyStakedXMore))}
            />
          </Container>
        </Box>
        <Box w="100%" h="auto" padding={'36px'}>
          <Container variant={'token'}>
            <StakeBox
              img="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Moremoney_05.jpg"
              title="veMore"
              link="/vemore"
              totalStaked={formatNumber(parseFloat(totalStakedVeMore))}
              yourStake={formatNumber(parseFloat(yourStakeVeMore))}
              totalSupply={formatNumber(parseFloat(totalSupplyStakedVeMore))}
            />
          </Container>
        </Box>
      </Flex>
      {children}
    </Flex>
  );
}
