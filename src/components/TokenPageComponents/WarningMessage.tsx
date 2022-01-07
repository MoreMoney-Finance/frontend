import {
  Alert,
  AlertIcon,
  Container,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import * as React from 'react';

export default function WarningMessage(
  props: React.PropsWithChildren<{ isOpen: boolean; message: string }>
) {
  const { message, isOpen } = props;
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
          <Container variant={'token'}>
            <PopoverArrow />
            <PopoverBody>
              <Alert bg={'transparent'}>
                <AlertIcon />
                {message}
              </Alert>
            </PopoverBody>
          </Container>
        </PopoverContent>
      </Popover>
    </>
  );
}
