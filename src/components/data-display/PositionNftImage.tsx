import { Button, Image } from '@chakra-ui/react';
import * as React from 'react';

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
    fetch(`http://localhost:8080?trancheId=${trancheId}`)
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
        onError={() => setImageError(true)}
      />
      {imageError ? (
        <Button onClick={() => generateNFT(trancheId)}>Generate NFT</Button>
      ) : null}
    </>
  );
}
