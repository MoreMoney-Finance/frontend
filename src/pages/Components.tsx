import { Button } from '@chakra-ui/react';
import * as React from 'react';
import GaugeChart from '../components/gauge/GaugeChart';
import { showToast } from '../components/notifications/Toasts';

export const ComponentsPage = () => {
  return (
    <div>
      <h1>Components</h1>
      <br />
      <GaugeChart />
      <br />
      <Button
        onClick={() => {
          showToast('success', '0x1234');
        }}
      >
        Success Toast
      </Button>
      <br />
      <Button
        onClick={() => {
          showToast('info', '0x1234');
        }}
      >
        Info Toast
      </Button>
      <br />
      <Button
        onClick={() => {
          showToast('error', '0x1234');
        }}
      >
        Error Toast
      </Button>
    </div>
  );
};

export default ComponentsPage;
