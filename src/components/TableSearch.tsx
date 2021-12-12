import { SearchIcon } from '@chakra-ui/icons';
import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import * as React from 'react';

export function TableSearch({
  setSearchString,
}: {
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const stripped = event.target.value.trim();
    setSearchString(stripped.toLowerCase());
  };

  return (
    <Box p={'4'}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search Tokens"
          borderRadius={'25'}
          onChange={handleSearch}
        />
      </InputGroup>
    </Box>
  );
}
