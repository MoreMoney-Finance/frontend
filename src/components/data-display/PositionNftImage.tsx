import { Button, Image } from '@chakra-ui/react';
import * as React from 'react';
import {
  useCurrentEpoch,
  useTokenIdByTrancheId,
} from '../../chain-interaction/contracts';
import { useClaimNFTContract } from '../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../notifications/TransactionErrorDialog';
import { ExternalMetadataContext } from '../../contexts/ExternalMetadataContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import { BigNumber } from 'ethers';

export default function PositionNftImage({
  width,
  height,
  padding,
  trancheId,
}: {
  width?: any;
  height?: any;
  padding?: number;
  trancheId: number;
}) {
  const account = React.useContext(UserAddressContext);
  const [image, setImage] = React.useState(null);
  const { nftSnapshot } = React.useContext(ExternalMetadataContext);
  const currentEpoch = useCurrentEpoch(BigNumber.from(0));
  const { sendClaim, claimState } = useClaimNFTContract();
  const tokenIdByTrancheId = useTokenIdByTrancheId(trancheId, 0);

  function generateNFT(trancheId: number) {
    console.log('trancheId', trancheId, {
      minter: account,
      epoch: currentEpoch,
    });
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

  function parseNFTMetadata(tokenId: number) {
    fetch(
      `https://raw.githubusercontent.com/MoreMoney-Finance/contracts/feature/smol-pp/nfts/metadata/${tokenId.toString()}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        setImage(data.image);
      });
  }

  React.useEffect(() => {
    if (tokenIdByTrancheId === 0) return;
    parseNFTMetadata(tokenIdByTrancheId.toString());
  }, [tokenIdByTrancheId]);

  const isEligible =
    nftSnapshot && account && nftSnapshot.eligible[currentEpoch][account];
  const claimDisabledMessage = !isEligible ? 'You are not eligible ' : null;

  return (
    <>
      <TransactionErrorDialog state={claimState} title="Claim NFT" />
      {image && (
        <Image
          width={width || ['100%', '100%', '100%', '100%']}
          height={height}
          // display={imageError ? 'none' : 'inline'}
          p={padding || '4'}
          borderRadius={'25px'}
          src={image}
        />
      )}

      {isEligible ? (
        <Button onClick={() => generateNFT(trancheId)}>Generate NFT</Button>
      ) : claimDisabledMessage ? (
        <Button disabled={true}>{claimDisabledMessage}</Button>
      ) : null}
    </>
  );
}
