import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import * as React from 'react';

export const RiskFeedbackComponent = (
  params: React.PropsWithChildren<unknown>
) => {
  return (
    <Box p={4}>
      <Menu>
        <MenuButton size="xs" as={Button}>
          %
        </MenuButton>
        <MenuList>
          <Flex justifyContent={'space-evenly'}>{params.children}</Flex>
        </MenuList>
      </Menu>
    </Box>
  );
};
