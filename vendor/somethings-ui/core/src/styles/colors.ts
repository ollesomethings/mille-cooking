// Blue color
const primary = {
  DEFAULT: '#0038FF',
  1000: '#000E5E',
  900: '#001C94',
  800: '#002BCF',
  700: '#0038FF', // 700 is brand color
  brand: '#0038FF',
  600: '#4D67FF',
  500: '#7387FF',
  400: '#97A5FF',
  300: '#BBC3FF',
  200: '#DEE0FF',
  100: '#F0EFFF',
  0: '#FDFBFF',
};

const secondary = {
  DEFAULT: '#42FF23',
  1000: '#012200',
  900: '#043900',
  800: '#085300',
  700: '#0D6E00',
  600: '#138A00',
  500: '#19A800',
  400: '#3CC425',
  300: '#5BE142',
  200: '#42FF23', // 200 is brand color
  brand: '#42FF23',
  100: '#CBFFB7',
  0: '#F7FFEE',
};

const info = {
  DEFAULT: '#FF65C1',
  1000: '#3C0028',
  900: '#620044',
  800: '#8A0061',
  700: '#AD1D7D',
  600: '#D844A1',
  500: '#FF65C1', // 500 is brand color
  brand: '#FF65C1',
  400: '#FF8BCC',
  300: '#FFAFD7',
  200: '#FFD8E9',
  100: '#FFECF2',
  0: '#FFFBFF',
};

const error = {
  DEFAULT: '#E71602',
  1000: '#400200',
  900: '#670400',
  800: '#910800',
  700: '#BE0E00',
  600: '#E71602', // 600 is brand color
  brand: '#E71602',
  500: '#FF553D',
  400: '#FF8A76',
  300: '#FFB4A7',
  200: '#FFDAD4',
  100: '#FFEDEA',
  0: '#FFFBFF',
};

const yellow = {
  DEFAULT: '#FFE91F', // brand color is default
  1000: '#201300',
  900: '#503A00',
  800: '#775601',
  700: '#9B7000',
  600: '#A97E11',
  500: '#CB9F01',
  400: '#DDBA00',
  300: '#FFE91F', // 300 is brand color
  brand: '#FFE91F',
  200: '#FFF2A4',
  100: '#FFFADE',
  0: '#FFFFFB',
};

const orange = {
  DEFAULT: '#FF6B00', // brand color is default
  1000: '#351000',
  900: '#561F00',
  800: '#7A3000',
  700: '#B04801',
  600: '#D75D06',
  500: '#FF6B00', // 500 is brand color
  brand: '#FF6B00',
  400: '#FF955F',
  300: '#FFB693',
  200: '#FFDBCC',
  100: '#FFEDE6',
  0: '#FFFBFF',
};

const grey = {
  DEFAULT: '#474747',
  1000: '#000000',
  900: '#1C1C1C',
  800: '#303030',
  700: '#474747',
  600: '#676767',
  500: '#858585',
  400: '#A6A6A6',
  300: '#C7C7C7',
  200: '#E3E3E3',
  100: '#F1F1F1',
  50: '#F7F7F7',
  0: '#FFFFFF',
};

const white = {
  DEFAULT: '#FFFFFF',
  0: '#FFFFFF',
};

export const colors = {
  // Primary (Blue)
  primary,
  blue: primary,
  // Secondary (Green)
  secondary,
  green: secondary,
  // Information (Pink)
  info,
  pink: info,
  // Error (Red)
  error,
  // destructive: error,
  red: error,
  // Yellow (Brand)
  yellow,
  // Orange (Brand)
  orange,
  // Greys
  grey,
  gray: grey,
  // White
  white,
  // Surface
  surface: {
    primary: grey[0],
    secondary: '#FAFAFA',
  },
  icons: {
    primary: grey[1000],
    secondary: grey[700],
    tertiary: grey[300],
  },
  border: {
    main: grey[100],
  },
  text: {
    primary: grey[1000],
    'primary-foreground': '#FFFFFF',
    secondary: grey[600],
    tertiary: grey[400],
    disabled: '#A6A6A6',
  },
  semantic: {
    primary: {
      25: primary[100],
      100: primary.DEFAULT,
    },
    secondary: {
      25: orange[100],
      100: orange[500],
    },
    tertiary: {
      25: secondary[100],
      100: secondary[600],
    },
    error: {
      25: error[0],
      100: error.DEFAULT,
    },
    offline: {
      25: info[100],
      100: info[600],
    },
  },
  background: {
    DEFAULT: 'hsl(0 0% 100%)',
    // foreground: "hsl(222.2 84% 4.9%)",
  },
  popover: {
    DEFAULT: 'hsl(0 0% 100%)',
    // foreground: "hsl(222.2 84% 4.9%)",
  },
  muted: {
    // DEFAULT: "hsl(217.2 32.6% 17.5%)",
    // foreground: "hsl(215 20.2% 65.1%)",
  },
  accent: {
    // DEFAULT: "hsl(217.2 32.6% 17.5%)",
    // foreground: "hsl(215 20.2% 65.1%)",
  },
} as const;

export type ColorName = keyof typeof colors;
export type ColorShade = keyof typeof colors.primary;
export type ColorTokens = keyof typeof colors;
export type TextColorTokens = keyof typeof colors.text;
