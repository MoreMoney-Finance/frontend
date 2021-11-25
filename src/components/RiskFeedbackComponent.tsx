import {
  Button,
  Grid,
  Menu,
  MenuButton,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import * as React from 'react';

export const RiskFeedbackComponent = (
  params: React.PropsWithChildren<unknown>
) => {
  return (
    <Menu>
      <MenuButton size="xs" as={Button}>
        %
      </MenuButton>
      <Portal>
        <MenuList zIndex={'popover'}>
          <Grid templateColumns="repeat(4, 1fr)" gap={1}>
            {params.children}
          </Grid>
        </MenuList>
      </Portal>
    </Menu>
  );
};
