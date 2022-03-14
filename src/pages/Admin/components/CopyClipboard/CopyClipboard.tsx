import { Button, Flex, useClipboard } from '@chakra-ui/react';
import * as React from 'react';

export default function CopyClipboard({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <>
      <Flex mb={2}>
        <Button onClick={onCopy} ml={2}>
          {hasCopied ? 'Copied' : label ?? 'Copy'}
        </Button>
      </Flex>
    </>
  );
}
