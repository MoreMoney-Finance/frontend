import { extendTheme } from '@chakra-ui/react';

const Button = {
  baseStyle: {
    border: '1px solid transparent',
  },
  _hover: {
    borderColor: 'blue.700',
    color: 'blue.400',
  },
  _active: {
    backgroundColor: 'blue.800',
    borderColor: 'blue.700',
  },
  variants: {
    action: {
      bg: 'blue.800',
      color: 'blue.300',
      fontSize: 'lg',
      fontWeight: 'medium',
      borderRadius: 'lg',
    },
  },
};

export const theme = extendTheme({
  config: { initialColorMode: 'dark' },
  components: {
    Button,
  },
});
