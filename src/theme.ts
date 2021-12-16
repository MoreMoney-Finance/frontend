import { extendTheme } from '@chakra-ui/react';
import '@fontsource/poppins';
import '@fontsource/rubik';

const Container = {
  variants: {
    token: {
      position: 'relative',
      maxWidth: '100%',
      height: '100%',
      background: 'brand.gradientBg',
      padding: '0',
      borderRadius: '10px',
      _before: {
        content: '""',
        position: 'absolute',
        top: '-2px',
        bottom: '-2px',
        left: '-2px',
        right: '-2px',
        background:
          'linear-gradient(to right, hsla(0, 100%, 64%, 0.06), hsla(193, 100%, 50%, 0.06))',
        borderRadius: '10px',
        zIndex: '-2',
      },
      _after: {
        content: '""',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        bg: 'brand.bg',
        borderRadius: '10px',
        zIndex: 'var(--chakra-zIndices-hide)',
      },
    },
  },
};

const Link = {
  baseStyle: {
    fontSize: '14px',
    lineHeight: '24px',
    color: 'brand.whiteAlpha60',
  },
  variants: {
    footer: {
      lineHeight: '21px',
      color: 'brand.whiteAlpha50',
    },
    header: {
      fontWeight: '600',
      _hover: {
        background: 'brand.accent',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
    },
    headerActive: {
      fontWeight: '600',
      background: 'brand.accent',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
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
    primary: {
      bg: 'brand.accent',
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
    h300: {
      fontFamily: 'Rubik',
      fontSize: '18px',
      lineHeight: '27px',
      fontWeight: 400,
      color: 'brand.whiteAlpha40',
    },
    h400: {
      fontFamily: 'Rubik',
      fontSize: '14px',
      lineHeight: '17px',
      fontWeight: 400,
      color: 'brand.whiteAlpha70',
    },
    bodyExtraSmall: {
      fontFamily: 'Poppins',
      fontSize: '12px',
      lineHeight: '18px',
      fontWeight: 400,
      color: 'white',
    },
    bodySmall: {
      fontFamily: 'Poppins',
      fontSize: '14px',
      lineHeight: '21px',
      fontWeight: 400,
      color: 'white',
    },
    bodyMedium: {
      fontFamily: 'Poppins',
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
      color: 'white',
    },
    bodyLarge: {
      fontFamily: 'Poppins',
      fontSize: '18px',
      lineHeight: '27px',
      fontWeight: 500,
      color: 'white',
    },
    bodyExtraLarge: {
      fontFamily: 'Poppins',
      fontSize: '48px',
      lineHeight: '72px',
      fontWeight: 600,
      color: 'white',
    },
  },
};

const Tabs = {
  variants: {
    primary: {
      tablist: {
        borderBottom: '1px solid',
        borderColor: 'brand.whiteAlpha20',
      },
      tab: {
        fontFamily: 'Poppins',
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: 400,
        color: 'white',
        _selected: {
          position: 'relative',
          fontWeight: 600,
          _after: {
            content: '""',
            position: 'absolute',
            bottom: '-1px',
            width: '100%',
            height: '2px',
            bg: 'brand.accent',
          },
        },
      },
    },
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
      borderRadius: '20px',
      bg: 'transparent',
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
              'linear-gradient(hsla(227, 12%, 15%, 1), hsla(227, 12%, 15%, 1)), linear-gradient(to right, hsla(0, 100%, 64%, 0.3) 0%, hsla(193, 100%, 50%, 0.3) 100%)',
            top: '0',
            left: '0',
            bottom: '0',
            right: '0',
            zIndex: 'var(--chakra-zIndices-hide)',
          },
          td: {
            fontSize: '18px',
            lineHeight: '27px',
            padding: '16px 30px',
            bg: 'brand.whiteAlpha030',
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
  config: { initialColorMode: 'dark' },
  fonts: {
    heading: 'Rubik',
    body: 'Poppins',
  },
  colors: {
    brand: {
      bg: 'hsla(227, 12%, 15%, 1)',
      active: 'hsla(227, 22%, 26%, 0.59)',
      accent:
        'linear-gradient(to bottom, hsla(166, 100%, 46%, 1), hsla(165, 86%, 34%, 1))',
      gradientBg:
        'linear-gradient(to bottom, hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0.03))',
      whiteAlpha030: 'hsla(0, 0%, 100%, 0.03)',
      whiteAlpha20: 'hsla(0, 0%, 100%, 0.2)',
      whiteAlpha30: 'hsla(0, 0%, 100%, 0.3)',
      whiteAlpha40: 'hsla(0, 0%, 100%, 0.4)',
      whiteAlpha50: 'hsla(0, 0%, 100%, 0.5)',
      whiteAlpha60: 'hsla(0, 0%, 100%, 0.6)',
      whiteAlpha70: 'hsla(0, 0%, 100%, 0.7)',
    },
  },
  zIndices: {
    header: 100,
  },
  styles: {
    global: {
      body: {
        bg: 'brand.bg',
        color: 'white',
      },
      a: {
        textDecoration: 'none !important',
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
    Container,
  },
});
