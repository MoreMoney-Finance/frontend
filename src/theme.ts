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
    color: 'whiteAlpha.600',
  },
  variants: {
    footer: {
      lineHeight: '21px',
      color: 'whiteAlpha.700',
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
      border: 'none',
      _hover: {
        _disabled: {
          bg: 'brand.accent',
        },
      },
    },
    secondary: {
      bg: 'whiteAlpha.100',
      border: 'none',
      _hover: {
        _disabled: {
          bg: 'whiteAlpha.100',
        },
      },
    },
    'submit-primary': {
      padding: '16px',
      h: '56px',
      borderRadius: '10px',
      bg: 'brand.accent',
      border: 'none',
      _hover: {
        _disabled: {
          bg: 'brand.accent',
        },
      },
      width: '100%',
    },
    submit: {
      padding: '16px',
      h: '56px',
      borderRadius: '10px',
      bg: 'whiteAlpha.200',
      width: '100%',
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
    h200: {
      fontFamily: 'Rubik',
      fontSize: '18px',
      lineHeight: '27px',
      fontWeight: 400,
    },
    h300: {
      fontFamily: 'Rubik',
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
    },
    h400: {
      fontFamily: 'Rubik',
      fontSize: '14px',
      lineHeight: '17px',
      fontWeight: 400,
    },
    bodyExtraSmall: {
      fontFamily: 'Poppins',
      fontSize: '12px',
      lineHeight: '18px',
      fontWeight: 400,
    },
    bodySmall: {
      fontFamily: 'Poppins',
      fontSize: '14px',
      lineHeight: '21px',
      fontWeight: 400,
    },
    bodyMedium: {
      fontFamily: 'Poppins',
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
    },
    bodyLarge: {
      fontFamily: 'Poppins',
      fontSize: '18px',
      lineHeight: '27px',
      fontWeight: 500,
    },
    bodyExtraLarge: {
      fontFamily: 'Poppins',
      fontSize: '48px',
      lineHeight: '72px',
      fontWeight: 600,
    },
  },
};

const Tabs = {
  variants: {
    primary: {
      tablist: {
        borderBottom: '1px solid',
        borderColor: 'whiteAlpha.200',
      },
      tabpanel: {
        padding: '30px 0 0',
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
        color: 'whiteAlpha.500',
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
    percentage: {
      field: {
        borderRadius: 'full',
        bg: 'whiteAlpha.100',
        textAlign: 'right',
        fontWeight: '500',
        border: '1px',
        borderColor: 'blue.500',
      },
    },
    percentage_inactive: {
      field: {
        borderRadius: 'full',
        bg: 'whiteAlpha.100',
        textAlign: 'right',
        fontWeight: '500',
        border: 'none',
        borderColor: '',
      },
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
            color: 'whiteAlpha.400',
            textTransform: 'uppercase',
            paddingTop: '20px',
            paddingBottom: '8px',
            borderTop: '1px solid',
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
            bg: 'whiteAlpha.30',
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
    white: 'hsl(0, 0%, 100%)',
    black: 'hsl(0,0%,0%)',
    accent_color: 'hsla(166, 100%, 46%, 1)',
    accent: {
      100: 'hsla(166, 100%, 46%, 1)',
      200: 'hsla(166, 100%, 46%, 0.9)',
      300: 'hsla(166, 100%, 46%, 0.8)',
      400: 'hsla(166, 100%, 46%, 0.7)',
      500: 'hsla(166, 100%, 46%, 0.6)',
      600: 'hsla(166, 100%, 46%, 0.5)',
      700: 'hsla(166, 100%, 46%, 0.4)',
      800: 'hsla(166, 100%, 46%, 0.3)',
      900: 'hsla(166, 100%, 46%, 0.2)',
    },
    brand: {
      bg: 'hsla(227, 12%, 15%, 1)',
      bgOpacity: 'hsla(0, 0%, 0%, 0.2)',
      active: 'hsla(227, 22%, 26%, 0.59)',
      accent:
        'linear-gradient(to bottom, hsla(166, 100%, 46%, 1), hsla(165, 86%, 34%, 1))',
      gradientBg:
        'linear-gradient(to bottom, hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0.03))',
    },
    whiteAlpha: {
      30: 'hsla(0, 0%, 100%, 0.03)',
      50: 'hsla(0, 0%, 100%, 0.05)',
      100: 'hsla(0, 0%, 100%, 0.1)',
      200: 'hsla(0, 0%, 100%, 0.2)',
      300: 'hsla(0, 0%, 100%, 0.3)',
      400: 'hsla(0, 0%, 100%, 0.4)',
      500: 'hsla(0, 0%, 100%, 0.5)',
      600: 'hsla(0, 0%, 100%, 0.6)',
      700: 'hsla(0, 0%, 100%, 0.7)',
      800: 'hsla(0, 0%, 100%, 0.8)',
      900: 'hsla(0, 0%, 100%, 0.9)',
    },
    gray: {
      50: 'hsla(204, 45%, 98%, 1)',
      100: 'hsla(210, 38%, 95%, 1)',
      200: 'hsla(214, 32%, 91%, 1)',
      300: 'hsla(211, 25%, 84%, 1)',
      400: 'hsla(214, 20%, 69%, 1)',
      500: 'hsla(216, 15%, 52%, 1)',
      600: 'hsla(218, 17%, 35%, 1)',
      700: 'hsla(218, 23%, 23%, 1)',
      800: 'hsla(220, 26%, 14%, 1)',
      900: 'hsla(230, 21%, 11%, 1)',
    },
    blue: {
      50: 'hsla(201, 100%, 96%, 1)',
      100: 'hsla(202, 81%, 86%, 1)',
      200: 'hsla(203, 82%, 76%, 1)',
      300: 'hsla(205, 79%, 66%, 1)',
      400: 'hsla(207, 73%, 57%, 1)',
      500: 'hsla(209, 62%, 50%, 1)',
      600: 'hsla(211, 61%, 43%, 1)',
      700: 'hsla(213, 49%, 34%, 1)',
      800: 'hsla(215, 41%, 28%, 1)',
      900: 'hsla(215, 56%, 23%, 1)',
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
