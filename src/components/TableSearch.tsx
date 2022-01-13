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
    <Box w={['full', 'full', 'auto']} marginTop={['20px', '20px', '0px']}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search Tokens"
          bg="transparent"
          color="whiteAlpha.500"
          borderRadius="full"
          border="1px solid"
          borderColor="whiteAlpha.200"
          fontSize="14px"
          lineHeight="21px"
          height="37px"
          onChange={handleSearch}
        />
      </InputGroup>
    </Box>
  );
}
