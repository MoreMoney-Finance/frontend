import { Button, Avatar, Text, Flex } from '@chakra-ui/react';
import * as React from 'react';
import robotPfp from '../../assets/img/robot-token-page.svg';

const ClaimNFT = (props: React.PropsWithChildren<unknown>) => {
  console.log(props);
  return (
    <Flex>
      <Avatar
        width="130px"
        height="130px"
        src={robotPfp}
        filter="blur(0.2rem)"
        position="relative"
      />
      <Flex flexDirection="column" ml="15px" gridGap="10px">
        <Text fontSize="32px" fontWeight="400">
          Congratulations!
        </Text>
        <Text fontSize="16px" fontWeight="400">
          You received your official NFT.
        </Text>
        <Button variant="primary">Claim</Button>
      </Flex>
    </Flex>
  );
};

export default ClaimNFT;
