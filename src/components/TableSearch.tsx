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
    <Box>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search Tokens"
          bg="transparent"
          color="brand.whiteAlpha50"
          borderRadius="full"
          border="1px solid"
          borderColor="brand.whiteAlpha20"
          fontSize="14px"
          lineHeight="21px"
          height="37px"
          onChange={handleSearch}
        />
      </InputGroup>
    </Box>
  );
}
