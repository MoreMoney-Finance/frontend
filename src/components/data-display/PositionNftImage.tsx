import { Button, Image } from '@chakra-ui/react';
import * as React from 'react';
import { NFT_ENDPOINT } from '../../utils';

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

  function generateNFT(trancheId: number) {
    fetch(`${NFT_ENDPOINT}?trancheId=${trancheId}`)
      .then((res) => res.json())
      .then(() => window.location.reload());
  }

  return (
    <>
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
