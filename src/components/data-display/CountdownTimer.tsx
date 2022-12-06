import React, { useState, useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import UpgradeNftImage from '../actions/UpgradeNftImage';

type Props = {
  endDate: number;
  trancheId: number;
};

const CountdownTimer: React.FC<Props> = ({ endDate, trancheId }) => {
  const [timeLeft, setTimeLeft] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft(diff);
      } else {
        clearInterval(interval);
        setTimeLeft(0);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [endDate]);

  if (timeLeft == null) {
    return <UpgradeNftImage label="Upgrade NFT" trancheId={trancheId} />;
  }

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  console.log('timeleft', days, hours, minutes, seconds, timeLeft);

  return (
    <>
      <Text fontSize={'xs'} textAlign="center" colorScheme={'primary'}>
        Next upgrade
      </Text>
      <Flex alignItems="center" justifyContent={'center'}>
        {days > 0 ? (
          <Text fontSize={'xs'} mr={1}>
            {days} days {hours.toString().padStart(2, '0')}:
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </Text>
        ) : hours > 0 ? (
          <Text fontSize={'xs'} mr={1}>
            {hours}:{minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </Text>
        ) : minutes > 0 ? (
          <Text fontSize={'xs'} mr={1}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Text>
        ) : (
          <UpgradeNftImage label="Upgrade NFT" trancheId={trancheId} />
        )}
      </Flex>
    </>
  );
};

export default CountdownTimer;
