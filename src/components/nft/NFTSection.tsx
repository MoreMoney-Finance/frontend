import { BigNumber } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import * as React from 'react';
import { useCurrentEpoch } from '../../chain-interaction/contracts';
import { ExternalMetadataContext } from '../../contexts/ExternalMetadataContext';
import { NFTContext } from '../../contexts/NFTContext';
import { UserAddressContext } from '../../contexts/UserAddressContext';
import ClaimNFT from './ClaimNFT';

type Props = {
  trancheId?: number;
};

const NFTSection: React.FC<Props> = ({}) => {
  const account = React.useContext(UserAddressContext);
  const { nftSnapshot } = React.useContext(ExternalMetadataContext);
  const { noNFTFound } = React.useContext(NFTContext);
  const currentEpoch = useCurrentEpoch(BigNumber.from(0));

  const isEligible =
    nftSnapshot &&
    account &&
    nftSnapshot.eligible[currentEpoch.toString()][getAddress(account)];

  return <>{isEligible && noNFTFound && <ClaimNFT />}</>;
};

export default NFTSection;
