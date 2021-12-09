import { extendTheme } from '@chakra-ui/react';
import '@fontsource/poppins';
import '@fontsource/rubik';

const Link = {
  variants: {
    footer: {
      fontSize: '14px',
      lineHeight: '21px',
      color: 'brand.whiteAlpha50',
    },
  },
};

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
        fontSize: '14px',
        lineHeight: '21px',
        fontWeight: 'normal',
        color: 'brand.whiteAlpha50',
        padding: '8px 22px',
        _selected: {
          color: 'white',
          bg: 'brand.active',
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
  variants: {
    dashboard: {
      table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 16px',
      },
      thead: {
        tr: {
          td: {
            fontFamily: 'Rubik',
            fontSize: '12px',
            lineHeight: '14px',
            color: 'brand.whiteAlpha40',
            textTransform: 'uppercase',
            paddingTop: '20px',
            paddingBottom: '8px',
            borderTop: '1px solid',
            bg: 'brand.whiteAlpha.20',
          },
        },
        _first: {
          transform: 'translateY(16px)',
        },
      },
      tbody: {
        /** Because the table uses tr as a link */
        a: {
          position: 'relative',
          _after: {
            content: '""',
            position: 'absolute',
            borderRadius: '10px',
            boxSizing: 'border-box',
            border: '1px solid transparent',
            backgroundClip: 'padding-box, border-box',
            backgroundOrigin: 'padding-box, border-box',
            backgroundImage:
              'linear-gradient(#22242B, #22242B), linear-gradient(to right, hsla(0, 100%, 64%, 0.3) 0%, hsla(193, 100%, 50%, 0.3) 100%)',
            top: '0',
            left: '0',
            bottom: '0',
            right: '0',
            zIndex: '-2',
          },
          td: {
            fontSize: '18px',
            lineHeight: '27px',
            padding: '16px 30px',
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
    },
  },
};

export const theme = extendTheme({
  fonts: {
    heading: 'Rubik',
    body: 'Poppins',
  },
  config: { initialColorMode: 'dark' },
  colors: {
    brand: {
      bg: 'hsla(227, 12%, 15%, 1)',
      active: 'hsla(227, 22%, 26%, 0.59)',
      whiteAlpha20: 'hsla(0, 0%, 100%, 0.2)',
      whiteAlpha40: 'hsla(0, 0%, 100%, 0.4)',
      whiteAlpha50: 'hsla(0, 0%, 100%, 0.5)',
      whiteAlpha60: 'hsla(0, 0%, 100%, 0.6)',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'brand.bg',
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
    Link,
  },
});
