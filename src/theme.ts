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

const Table = {
  baseStyle: {
    table: {
      borderCollapse: 'separate',
      borderSpacing: '0 16px',
    },
    tr: {
      position: 'relative',
      _before: {
        content: '""',
        position: 'absolute',
        borderRadius: '10px',
        backgroundImage:
          'linear-gradient(to right, hsla(0, 100%, 64%, 0.3) 0%, hsla(193, 100%, 50%, 0.3) 100%)',
        top: '-1px',
        left: '-1px',
        bottom: '-1px',
        right: '-1px',
        zIndex: -2,
      },
      _after: {
        content: '""',
        position: 'absolute',
        borderRadius: '10px',
        top: '0',
        left: '0',
        bottom: '0',
        right: '-0',
        background: '#22242B',
        zIndex: -1,
      },
      td: {
        background: 'whiteAlpha.50',
        _first: {
          borderLeftRadius: '10px',
        },
        _last: {
          borderRightRadius: '10px',
        },
      },
    },
  },
};

export const theme = extendTheme({
  config: { initialColorMode: 'dark' },
  styles: {
    global: {
      body: {
        bg: 'hsla(227, 12%, 15%, 1)',
        color: 'white',
      },
    },
  },
  components: {
    Button,
    Text,
    Tabs,
    Input,
    Table,
  },
});
