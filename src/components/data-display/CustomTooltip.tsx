import * as React from 'react';
import { Tooltip, Container } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

export default function CustomTooltip({ label }: { label: React.ReactNode }) {
  const [isLabelOpen, setIsLabelOpen] = React.useState(false);

  return (
    <Container position="absolute" top="-2px" right="-32px">
      <Tooltip
        hasArrow
        label={label}
        isOpen={isLabelOpen}
        bg="gray.300"
        color="black"
        placement="right-end"
      >
        <InfoIcon
          onMouseEnter={() => setIsLabelOpen(true)}
          onMouseLeave={() => setIsLabelOpen(false)}
          onClick={() => setIsLabelOpen(true)}
        />
      </Tooltip>
    </Container>
  );
}
