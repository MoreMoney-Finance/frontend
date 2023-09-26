import { Button, Container } from '@chakra-ui/react';
import { ChainId, useEthers } from '@usedapp/core';
import * as React from 'react';
import gaugeCritical from '../assets/gauge/critical.svg';
import gaugeSafe from '../assets/gauge/safe-full.svg';
import gaugeSafePart from '../assets/gauge/safe-part.svg';
import gaugeUnsafe from '../assets/gauge/unsafe.svg';
import { showToast } from '../components/notifications/Toasts';

export const ComponentsPage = () => {
  const { chainId } = useEthers();
  const _chainId = chainId === ChainId.Hardhat ? ChainId.Avalanche : chainId;
  return (
    <div>
      <h1>Components</h1>
      <br />
      <Container
        width="200px"
        height="100px"
        bg={`url(${gaugeSafe})`}
        backgroundSize="cover"
      />
      <Container
        width="200px"
        height="100px"
        bg={`url(${gaugeSafePart})`}
        backgroundSize="cover"
      />
      <Container
        width="200px"
        height="100px"
        bg={`url(${gaugeUnsafe})`}
        backgroundSize="cover"
      />
      <Container
        width="200px"
        height="100px"
        bg={`url(${gaugeCritical})`}
        backgroundSize="cover"
      />

      <br />
      <Button
        onClick={() => {
          showToast('success', '0x1234', _chainId!);
        }}
      >
        Success Toast
      </Button>
      <br />
      <Button
        onClick={() => {
          showToast('info', '0x1234', _chainId!);
        }}
      >
        Info Toast
      </Button>
      <br />
      <Button
        onClick={() => {
          showToast('error', '0x1234', _chainId!);
        }}
      >
        Error Toast
      </Button>
    </div>
  );
};

export default ComponentsPage;
