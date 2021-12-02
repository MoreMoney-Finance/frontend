import { SearchIcon } from '@chakra-ui/icons';
import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import * as React from 'react';

export function TableSearch() {
  return (
    <Box p={'4'}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input type="tel" placeholder="Search Token" borderRadius={'25px'} />
      </InputGroup>
    </Box>
  );
}
