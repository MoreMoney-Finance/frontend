import {
  Button,
  HStack,
  Avatar,
  Flex,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { useContext } from 'react';
import robotPfp from '../../assets/img/robot-pfp.svg';
import { useAddresses, useStable } from '../../chain-interaction/contracts';
import { getTokenFromAddress } from '../../chain-interaction/tokens';
import { MakeMostOfMoneyContext } from '../../contexts/MakeMostOfMoneyContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { WalletBalancesContext } from '../../contexts/WalletBalancesContext';
import { useConnectWallet } from '../../utils';

type Props = {
  handleOpenModal: any;
};

export function UserAddressComponent({ handleOpenModal }: Props) {
  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)');
  const { chainId } = useEthers();
  const { onConnect } = useConnectWallet();
  const { MostOfMoneyPopover } = React.useContext(MakeMostOfMoneyContext);
  const account = useContext(UserAddressContext);
  const stable = useStable();
  const balanceCtx = React.useContext(WalletBalancesContext);
  const moreToken = getTokenFromAddress(chainId, useAddresses().MoreToken);

  const walletBalance =
    balanceCtx.get(stable.address) ||
    new CurrencyValue(stable, BigNumber.from('0'));

  const moreBalance =
    balanceCtx.get(moreToken.address) ||
    new CurrencyValue(moreToken, BigNumber.from('0'));

  function handleConnectWallet() {
    onConnect();
  }

  return (
    <HStack
      // bg={'brand.gradientBg'}
      borderRadius={'10px'}
    >
      <MostOfMoneyPopover>
        <HStack alignContent={'center'}>
          {walletBalance &&
          moreBalance &&
          !moreBalance.isZero() &&
          !walletBalance.isZero() &&
          isLargerThan1280 ? (
              <Text fontSize={['12px', '14px', '14px']} textAlign="center">
                {walletBalance?.format({ significantDigits: 2 })} /{' '}
                {moreBalance?.format({ significantDigits: 2 })}
              </Text>
            ) : (
            // <Image src={colorDot} />
              <></>
            )}
        </HStack>
      </MostOfMoneyPopover>
      <Button
        variant={'primary'}
        padding={'4px 20px'}
        h={'35px'}
        onClick={account ? handleOpenModal : handleConnectWallet}
      >
        {account ? (
          <Flex justifyItems="center" alignItems="center">
            <Avatar src={robotPfp} width="25px" height="27px" />
            <Text
              fontSize={['12px', '14px', '16px']}
              lineHeight={'24px'}
              color={'brand.bg'}
              fontWeight={'400'}
              ml={'8px'}
            >
              {account &&
                `${account.slice(0, 6)}...${account.slice(
                  account.length - 4,
                  account.length
                )}`}
            </Text>
          </Flex>
        ) : (
          <Text color="black" fontWeight="400">
            Connect wallet
          </Text>
        )}
      </Button>
    </HStack>
  );
}
