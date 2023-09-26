import { Avatar, Button, Flex, HStack, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useContext } from 'react';
import { MakeMostOfMoneyContext } from '../../contexts/MakeMostOfMoneyContext';
import { NFTContext } from '../../contexts/NFTContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { useConnectWallet } from '../../utils';

type Props = {
  handleOpenModal: any;
};

export function UserAddressComponent({ handleOpenModal }: Props) {
  const { onConnect } = useConnectWallet();
  const { MostOfMoneyPopover } = React.useContext(MakeMostOfMoneyContext);
  const account = useContext(UserAddressContext);
  const { accountImage } = React.useContext(NFTContext);

  function handleConnectWallet() {
    onConnect();
  }

  return (
    <HStack
      // bg={'brand.gradientBg'}
      borderRadius={'10px'}
    >
      <MostOfMoneyPopover>
        <HStack alignContent={'center'}>&nbsp;</HStack>
      </MostOfMoneyPopover>
      <Button
        variant={'primary'}
        h={'35px'}
        onClick={account ? handleOpenModal : handleConnectWallet}
      >
        {account ? (
          <Flex justifyItems="center" alignItems="center">
            <Avatar src={accountImage} width="25px" height="27px" />
            &nbsp;
            <Text
              fontSize={['12px', '14px', '16px']}
              lineHeight={'24px'}
              color={'brand.bg'}
              fontWeight={'400'}
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
