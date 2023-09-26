import { BigNumber } from 'ethers';
import * as React from 'react';
import {
  TokenStratPositionMetadata,
  useCurrentEpoch,
  useIsolatedPositionMetadata,
} from '../../chain-interaction/contracts';
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
  const tiers = [
    {
      name: 'tier1',
      minDebt: 100,
      epoch: 1,
      threshold: 100 * 7 * 24 * 60 * 60 * 1000,
    },
    {
      name: 'tier2',
      minDebt: 200,
      epoch: 2,
      threshold: 200 * 14 * 24 * 60 * 60 * 1000,
    },
  ];

  const isEligible =
    nftSnapshot &&
    account &&
    nftSnapshot.eligible[currentEpoch.toString()][account];

  const accumulated =
    nftSnapshot &&
    account &&
    nftSnapshot.positions[currentEpoch.toString()][account];
  const currentTier = tiers.find(
    (tier) => tier.epoch === parseFloat(currentEpoch)
  );

  const allPositionMeta: TokenStratPositionMetadata =
    useIsolatedPositionMetadata(account!);
  const debtInDollars =
    Object.values(allPositionMeta).reduce(
      (acc, curr) =>
        acc +
        curr.reduce(
          (acc2, curr2) => acc2 + parseFloat(curr2.debt.toString()),
          0
        ),
      0
    ) / 1e18;

  const timeLeftMilliseconds =
    accumulated &&
    currentTier &&
    currentTier.threshold - parseFloat(accumulated.toString()) / debtInDollars;
  const timeLeftDays =
    timeLeftMilliseconds && timeLeftMilliseconds / 1000 / 60 / 60 / 24;

  // get the current date & time (as milliseconds since Epoch)
  const currentTimeAsMs = Date.now();
  const adjustedTimeAsMs =
    timeLeftMilliseconds &&
    currentTimeAsMs + parseInt(timeLeftMilliseconds.toString());
  // create a new Date object, using the adjusted time
  const adjustedDateObj = adjustedTimeAsMs && new Date(adjustedTimeAsMs);
  console.log('adjustedDateObj', adjustedDateObj, {
    timeLeftMilliseconds,
    threshold: currentTier?.threshold,
    accumulated,
    debtInDollars,
  });

  return (
    <>
      {noNFTFound && (
        <ClaimNFT
          eligible={isEligible && noNFTFound}
          timeLeft={adjustedDateObj}
          timeLeftDays={timeLeftDays}
        />
      )}
    </>
  );
};

export default NFTSection;
