import {
  Button,
  Grid,
  Menu,
  MenuButton,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import * as React from 'react';

export const PercentageChoice = (
  params: React.PropsWithChildren<{ numButtons: number, label: string }>
) => {
  return (
    <Menu>
      <MenuButton size="xs" as={Button} width="auto" px="2">
        { params.label }
      </MenuButton>
      <Portal>
        <MenuList zIndex={'popover'}>
          <Grid templateColumns={`repeat(${params.numButtons}, 1fr)`} gap={1}>
            {params.children}
          </Grid>
        </MenuList>
      </Portal>
    </Menu>
  );
};