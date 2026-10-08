/** @type {import('tailwindcss').Config} */
const {
  themeV2,
  typographyPlugin,
  typographySafelist,
} = require('@somethings-ui/core');

const { fontFamily, ...rest } = themeV2.extend;

module.exports = {
  // Web: NativeWind throws "Cannot manually set color scheme" when darkMode is 'media'
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@somethings-ui/core/src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@somethings-ui/native/src/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: typographySafelist,
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      ...rest,
      fontFamily: {
        sans: ['TWKLausanne-400'],
        heading: ['Avantt-Bold'],
        body: ['TWKLausanne-400'],
        avantt: ['Avantt-Bold'],
        'avantt-bold': ['Avantt-Bold'],
        'avantt-italic': ['Avantt-BoldItalic'],
        twk: ['TWKLausanne-400'],
        'twk-italic': ['TWKLausanne-400Italic'],
        geist: ['GeistMono-Medium'],
        signature: ['CedarvilleCursive-Regular'],
        caveat: ['Caveat_600SemiBold'],
        ...fontFamily,
      },
      fontSize: {
        ...rest.fontSize,
        sm: '14px',
        base: '16px',
        '2xl': '24px',
        '3xl': '28px',
      },
      textColor: {
        ...rest.textColor,
        buttonText: rest.colors.buttonText,
      },
    },
  },
  plugins: [typographyPlugin],
};
