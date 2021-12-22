import { Button } from '@chakra-ui/react';
import * as React from 'react';

export default function ChangeStrategyButton({
  chooseStrategy,
  onClose,
}: {
  chooseStrategy: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <Button
        onClick={() => {
          chooseStrategy();
          onClose();
        }}
      >
        Change
      </Button>
    </>
  );
}
