import { Avatar, Button, Flex, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import * as React from 'react';
import robotPfp from '../../assets/img/robot-token-page.svg';
import { useCurrentEpoch } from '../../chain-interaction/contracts';
import { useClaimNFTContract } from '../../chain-interaction/transactions';
import { ExternalMetadataContext } from '../../contexts/ExternalMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { TransactionErrorDialog } from '../notifications/TransactionErrorDialog';

const ClaimNFT = () => {
  const account = React.useContext(UserAddressContext);
  const { sendClaim, claimState } = useClaimNFTContract();
  const currentEpoch = useCurrentEpoch(BigNumber.from(0));
  const { nftSnapshot } = React.useContext(ExternalMetadataContext);

  function generateNFT() {
    if (nftSnapshot && account) {
      const signature =
        nftSnapshot.signatures[currentEpoch][getAddress(account)];

      sendClaim(
        {
          minter: account,
          epoch: currentEpoch,
        },
        signature
      );
    }
  }
  return (
    <Flex>
      <TransactionErrorDialog state={claimState} title="Claim NFT" />
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
        <Button onClick={() => generateNFT()} variant="primary">
          Claim
        </Button>
      </Flex>
    </Flex>
  );
};

export default ClaimNFT;
