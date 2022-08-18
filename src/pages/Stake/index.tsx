import { Box, Container, Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import { formatEther } from '@ethersproject/units';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import {
  iMoneyTotalSupply,
  useAddresses,
  useBalanceOfToken,
  useIMoneyAPR,
  useStable,
  useTotalSupplyToken,
} from '../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../chain-interaction/tokens';
import { useGetStakedMoreVeMoreToken } from '../../chain-interaction/transactions';
import { TokenDescription } from '../../components/tokens/TokenDescription';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { WalletBalancesContext } from '../../contexts/WalletBalancesContext';
import { formatNumber } from '../../utils';
import StakeBox from './components/StakeBox';

export default function StakePage({
  children,
}: React.PropsWithChildren<unknown>) {
  const account = React.useContext(UserAddressContext);
  const { chainId } = useEthers();
  const addresses = useAddresses();
  //xmore data
  const totalStakedXMore = formatEther(
    useBalanceOfToken(addresses.MoreToken, [addresses.xMore], 0)
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

  //iMoney data
  const balanceCtx = React.useContext(WalletBalancesContext);
  const iMoneyAddress = useAddresses().StableLending2InterestForwarder;
  const stable = useStable();
  const iMoneyBalance =
    balanceCtx.get(iMoneyAddress) ??
    new CurrencyValue(stable, BigNumber.from('0'));
  const totalSupplyIMoney = formatEther(iMoneyTotalSupply(BigNumber.from('0')));

  const inputStyle = {
    marginTop: '12px',
    padding: '12px',
    bg: 'whiteAlpha.50',
    borderRadius: '10px',
    justifyContent: 'space-between',
  };

  const { baseRate, boostedRate, avgBoostedRate } = useIMoneyAPR(account!);

  return (
    <Flex flexDirection={'column'}>
      <Flex flexDirection={['column', 'column', 'row', 'row']} marginTop="50px">
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
        <Box w="100%" h="auto" padding={'36px'}>
          <Container variant={'token'}>
            <StakeBox
              img="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
              title={`iMoney`}
              link="/imoney"
              totalStaked={parseFloat(totalSupplyIMoney).toFixed(2)}
              yourStake={iMoneyBalance.format({ suffix: '' })}
              totalSupply={null}
              buttonLabel="Earn MONEY"
            >
              <>
                <Spacer />
                <Box>
                  <Flex
                    flexDirection={'column'}
                    justify="center"
                    alignItems={'center'}
                  >
                    <Text fontSize={'md'} color={'gray.400'}>
                      {'Base + Boosted APR'}
                    </Text>
                    <Text fontSize={'sm'}>
                      {boostedRate
                        ? `${baseRate.toFixed(2)}% + ${boostedRate.toFixed(
                          2
                        )}% `
                        : `${baseRate.toFixed(2)}% + ${avgBoostedRate.toFixed(
                          2
                        )}% avg`}
                    </Text>
                  </Flex>
                </Box>
              </>
            </StakeBox>
          </Container>
        </Box>
      </Flex>
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
          <Container variant={'token'} padding="16px">
            {/* descriptions of the tokens */}
            <HStack {...inputStyle}>
              <TokenDescription
                token={getTokenFromAddress(chainId, addresses.VeMoreToken)}
              />
              <Text fontSize={'14px'} color="gray.400">
                Boost your yield on iMoney staking and LP rewards
              </Text>
            </HStack>
            <HStack {...inputStyle}>
              <TokenDescription
                token={getTokenFromAddress(
                  chainId,
                  addresses.StableLending2InterestForwarder
                )}
              />
              <Text fontSize={'14px'} color="gray.400">
                Earn interest on your MONEY
              </Text>
            </HStack>
            <HStack {...inputStyle}>
              <TokenDescription
                token={getTokenFromAddress(chainId, addresses.xMore)}
              />
              <Text fontSize={'14px'} color="gray.400">
                Get compounding MORE rewards
              </Text>
            </HStack>
          </Container>
        </Box>
      </Flex>
      {children}
    </Flex>
  );
}
