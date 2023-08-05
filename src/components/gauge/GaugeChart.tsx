import { Container } from '@chakra-ui/react';
import * as React from 'react';

export const GaugeChart = () => {
  return (
    <div>
      <Container variant="gauge_mask">
        <Container variant="gauge_semi_circle"></Container>
        <Container variant="gauge_semi_circle_mask"></Container>
      </Container>
    </div>
  );
};

export default GaugeChart;
