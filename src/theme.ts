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

const Text = {
  variants: {
    gradient: {
      background: 'linear-gradient(to right, #7bb07b, #3c7998)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
};

const Tabs = {
  variants: {
    'soft-rounded': {
      tab: {
        borderRadius: 'full',
        fontWeight: 'semibold',
        color: 'gray.600',
        _selected: {
          color: 'gray.100',
          bg: 'gray.600',
        },
      },
    },
  },
};

const Input = {
  variants: {
    rounded: {
      borderRadius: '5',
    },
  },
};

export const theme = extendTheme({
  config: { initialColorMode: 'dark' },
  components: {
    Button,
    Text,
    Tabs,
    Input,
  },
});
