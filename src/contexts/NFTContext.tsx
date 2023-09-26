import { Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import * as React from 'react';
import { useAddresses } from '../chain-interaction/contracts';
import NFTContract from '../contracts/artifacts/contracts/NFTContract.sol/NFTContract.json';
import robotPfp from '../assets/img/robot-pfp.svg';
import { provider } from '../utils';
import { UserAddressContext } from './UserAddressContext';

export const NFTContext = React.createContext({} as any);

type NFTMetadata = {
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
};

export default function NFTCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const account = React.useContext(UserAddressContext);
  const baseURL =
    'https://raw.githubusercontent.com/MoreMoney-Finance/contracts/feat/nft-representation/nfts/metadata/';
  const [nftTokenIds, setNFTTokenIds] = React.useState<number[]>([]);
  const [accountImage, setAccountImage] = React.useState(robotPfp);
  const [noNFTFound, setNoNFTFound] = React.useState(true);

  const addresses = useAddresses();

  const MMNFTContract = new ethers.Contract(
    addresses.NFTContract,
    new Interface(NFTContract.abi),
    provider
  );

  const fetchMetadata = async (tokenId: number) => {
    const metadata = await fetch(`${baseURL}${tokenId}`);
    const metadataJSON = await metadata.json();
    return metadataJSON as NFTMetadata;
  };

  const fetchNFTTokenIds = async () => {
    const tokenIds: number[] = [];
    for (let i = 1; i < 1000; i++) {
      try {
        const owner = await MMNFTContract.ownerOf(i);
        if (owner === account) {
          tokenIds.push(i);
        }
      } catch (ex) {
        break;
      }
    }

    setNFTTokenIds(tokenIds);

    if (tokenIds.length > 0) {
      setNoNFTFound(false);
      const metadata = await fetchMetadata(tokenIds[0]);
      setAccountImage(metadata.image);
    }
  };

  React.useEffect(() => {
    if (account) {
      fetchNFTTokenIds();
    }
  }, [account]);

  return (
    <NFTContext.Provider
      value={{
        nftTokenIds,
        accountImage,
        noNFTFound,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
}
