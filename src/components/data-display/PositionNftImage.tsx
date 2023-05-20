import { Button, Image } from '@chakra-ui/react';
import * as React from 'react';
import { useClaimNFTContract } from '../../chain-interaction/transactions';
import { TransactionErrorDialog } from '../notifications/TransactionErrorDialog';

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
  const [imageError, setImageError] = React.useState(false);

  const { sendClaim, claimState } = useClaimNFTContract();

  function generateNFT(trancheId: number) {
    console.log('trancheId', trancheId);
    sendClaim();
  }

  return (
    <>
      <TransactionErrorDialog state={claimState} title="Claim NFT" />
      <Image
        width={width || ['100%', '100%', '100%', '100%']}
        height={height}
        display={imageError ? 'none' : 'inline'}
        p={padding || '4'}
        borderRadius={'25px'}
        src={`https://static.moremoney.finance/${trancheId.toString()}.png`}
        // src={
        //   'https://cdn.stablediffusionapi.com/generations/fcc85d4b-fd90-4866-ae94-5bebb2467539-0.png'
        // }
        // src={
        //   imageError
        //     ? 'https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'
        //     : `https://static.dreamerspaceguild.com/images/${trancheId.toString()}.png`
        // }
        onError={() => setImageError(true)}
      />
      {imageError ? (
        <Button onClick={() => generateNFT(trancheId)}>Generate NFT</Button>
      ) : null}
    </>
  );
}
