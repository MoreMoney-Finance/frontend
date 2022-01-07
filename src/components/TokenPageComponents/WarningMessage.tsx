import {
  Alert,
  AlertIcon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import * as React from 'react';

export default function WarningMessage(
  props: React.PropsWithChildren<{ isOpen: boolean }>
) {
  const { isOpen } = props;
  return (
    <>
      <Popover
        autoFocus={false}
        returnFocusOnClose={true}
        placement="right"
        isOpen={isOpen}
      >
        <PopoverTrigger>{props.children}</PopoverTrigger>
        <PopoverContent marginTop={'90px'}>
          <PopoverArrow />
          <PopoverBody>
            <Alert status="warning">
              <AlertIcon />
              Borrow amount too high
            </Alert>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
