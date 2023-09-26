import { Avatar, Button, Flex, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import * as React from 'react';
import robotPfp from '../../assets/img/robot-token-page.svg';
import { useCurrentEpoch } from '../../chain-interaction/contracts';
import { useClaimNFTContract } from '../../chain-interaction/transactions';
import { ExternalMetadataContext } from '../../contexts/ExternalMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { TransactionErrorDialog } from '../notifications/TransactionErrorDialog';

type Props = {
  timeLeft: '' | 0 | Date | null | undefined;
  timeLeftDays: number | '' | null | undefined;
  eligible?: boolean;
};

const ClaimNFT: React.FC<Props> = ({ timeLeft, eligible, timeLeftDays }) => {
  console.log('timeLeft', timeLeft);
  console.log('eligible', eligible);

  const account = React.useContext(UserAddressContext);
  const { sendClaim, claimState } = useClaimNFTContract();
  const currentEpoch = useCurrentEpoch(BigNumber.from(0));
  const { nftSnapshot } = React.useContext(ExternalMetadataContext);

  function generateNFT() {
    if (nftSnapshot && account) {
      const signature = nftSnapshot.signatures[currentEpoch][account];

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
        {eligible && (
          <>
            <Text fontSize="16px" fontWeight="400">
              You received your official NFT.
            </Text>
            <Button onClick={() => generateNFT()} variant="primary">
              Claim
            </Button>
          </>
        )}
        {timeLeft && timeLeftDays && !eligible && (
          <>
            <Text fontSize="16px" fontWeight="400">
              You qualify for the official NFT.
              <br /> Boost progress by increasing collateral.
            </Text>
            {/* Progress bar with days left inside */}
            <Flex
              width="100%"
              mt={2}
              border="1px"
              height="30px"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="14px" fontWeight="400" textAlign="center">
                {timeLeftDays.toFixed(0)} days until delivery
              </Text>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default ClaimNFT;
