import { Button, Image } from '@chakra-ui/react';
import * as React from 'react';
import { useClaimNFTContract } from '../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../notifications/TransactionErrorDialog';
import {
  useHasAvailableNFT,
  useHasDuplicateNFTs,
  useHasMinimumDebt,
  useIsTimeLimitOver,
  useTokenIdByTrancheId,
} from '../../chain-interaction/contracts';

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
  const [image, setImage] = React.useState(null);

  const { sendClaim, claimState } = useClaimNFTContract();
  const isTimeLimitOver = useIsTimeLimitOver(false);
  const minimumDebt = useHasMinimumDebt(false);
  const hasAvailableNFT = useHasAvailableNFT(false);
  const hasDuplicateNFTs = useHasDuplicateNFTs(false);
  const tokenIdByTrancheId = useTokenIdByTrancheId(trancheId, 0);
  console.log('tokenIdByTrancheId', tokenIdByTrancheId.toString());

  function generateNFT(trancheId: number) {
    console.log('trancheId', trancheId);
    sendClaim();
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

  const claimDisabled =
    isTimeLimitOver || !minimumDebt || hasAvailableNFT || hasDuplicateNFTs;

  const claimDisabledMessage = isTimeLimitOver
    ? 'Time limit not over'
    : !minimumDebt
      ? 'Minimum debt not reached'
      : hasAvailableNFT
        ? 'No available NFTs'
        : hasDuplicateNFTs
          ? 'No duplicate NFTs'
          : '';

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

      {!claimDisabled ? (
        <Button onClick={() => generateNFT(trancheId)}>Generate NFT</Button>
      ) : claimDisabledMessage ? (
        <Button disabled={true}>{claimDisabledMessage}</Button>
      ) : null}
    </>
  );
}
