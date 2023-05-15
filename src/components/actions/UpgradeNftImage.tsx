import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { NFT_ENDPOINT } from '../../utils';

type Props = {
  label: string;
  trancheId: number;
};

const UpgradeNftImage: React.FC<Props> = ({ label, trancheId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${NFT_ENDPOINT}/upgrade?trancheId=${trancheId}`
      );
      const data = await response.json();
      console.log('data', data);
      // handle the response data here
    } catch (error) {
      // handle the error here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} isLoading={isLoading}>
      {label}
    </Button>
  );
};

export default UpgradeNftImage;
