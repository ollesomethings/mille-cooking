export const fontFamily = {
  heading: ['Avantt Bold', 'Avantt-Bold', 'sans-serif'],
  body: ['TWK Lausanne', 'TWKLausanne-400', 'sans-serif'],
  signature: ['Cedarville Cursive', 'Cedarville-Cursive', 'cursive'],
} as const;

export const fontSize = {
  // DESIGN SYSTEM v2
  // Headings
  'header-1': [
    '36px',
    {
      lineHeight: '110%',
      fontWeight: '700',
      tracking: '-0.025em',
      fontFamily: 'Avantt',
    },
  ],
  'header-2': [
    '32px',
    {
      lineHeight: '105%',
      fontWeight: '700',
      tracking: '-0.025em',
      fontFamily: 'Avantt',
    },
  ],
  'header-3': [
    '24px',
    {
      lineHeight: '115%',
      fontWeight: '700',
      tracking: '-0.01em',
      fontFamily: 'Avantt',
    },
  ],
  'header-4': [
    '20px',
    {
      lineHeight: '115%',
      fontWeight: '700',
      tracking: '-0.01em',
      fontFamily: 'Avantt',
    },
  ],
  'header-5': [
    '16px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      tracking: '-0.01em',
      fontFamily: 'Avantt',
    },
  ],
  'header-6': [
    '14px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      tracking: '-0.01em',
      fontFamily: 'Avantt',
    },
  ],

  // Body
  'body-1': [
    '16px',
    {
      lineHeight: '140%',
      fontWeight: '400',
      tracking: '0em',
      fontFamily: 'TWK Lausanne',
    },
  ],
  'body-2': [
    '14px',
    {
      lineHeight: '140%',
      fontWeight: '400',
      tracking: '0em',
      fontFamily: 'TWK Lausanne',
    },
  ],
  'body-3': [
    '12px',
    {
      lineHeight: '140%',
      fontWeight: '400',
      tracking: '0em',
      fontFamily: 'TWK Lausanne',
    },
  ],
  'body-4': [
    '10px',
    {
      lineHeight: '140%',
      fontWeight: '400',
      tracking: '0em',
      fontFamily: 'TWK Lausanne',
    },
  ],

  // Captions

  'caption-large': [
    '20px',
    {
      lineHeight: '140%',
      fontWeight: '500',
      tracking: '-0.02em',
      fontFamily: 'Geist Mono',
    },
  ],
  'caption-1': [
    '16px',
    {
      lineHeight: '140%',
      fontWeight: '500',
      tracking: '-0.02em',
      fontFamily: 'Geist Mono',
    },
  ],
  'caption-2': [
    '14px',
    {
      lineHeight: '140%',
      fontWeight: '500',
      tracking: '-0.02em',
      fontFamily: 'Geist Mono',
    },
  ],
  'caption-3': [
    '12px',
    {
      lineHeight: '140%',
      fontWeight: '500',
      tracking: '-0.02em',
      fontFamily: 'Geist Mono',
    },
  ],

  // Buttons
  'button-1': [
    '16px',
    {
      lineHeight: '110%',
      fontWeight: '700',
      tracking: '-0.01em',
      fontFamily: 'Avantt',
    },
  ],
  'button-2': [
    '14px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      tracking: '-0.01em',
      fontFamily: 'Avantt',
    },
  ],

  // Signature
  signature: [
    '20px',
    {
      lineHeight: '130%',
      fontWeight: '400',
      tracking: '-0.01em',
      fontFamily: 'Cedarville Cursive',
    },
  ],

  // DEPRECATED
  'heading-xxl': [
    '64px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      letterSpacing: '-1.28px',
      fontFamily: 'Avantt Bold',
    },
  ],
  'heading-xl': [
    '54px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      letterSpacing: '-1.08px',
      fontFamily: 'Avantt Bold',
    },
  ],
  'heading-l': [
    '42px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      letterSpacing: '-0.84px',
      fontFamily: 'Avantt Bold',
    },
  ],
  'heading-m': [
    '36px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      letterSpacing: '-0.72px',
      fontFamily: 'Avantt Bold',
    },
  ],
  'heading-s': [
    '24px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      letterSpacing: '-0.48px',
      fontFamily: 'Avantt Bold',
    },
  ],
  'heading-xs': [
    '18px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      letterSpacing: '-0.36px',
      fontFamily: 'Avantt Bold',
    },
  ],
  'heading-mini': [
    '16px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      letterSpacing: '-0.36px',
      fontFamily: 'Avantt Bold',
    },
  ],
  'heading-micro': [
    '14px',
    {
      lineHeight: '120%',
      fontWeight: '700',
      letterSpacing: '-0.36px',
      fontFamily: 'Avantt Bold',
    },
  ],
  'heading-nano': [
    '9px',
    { lineHeight: '120%', fontWeight: '700', fontFamily: 'Avantt Bold' },
  ],

  // Body (TWK Lausanne)
  subheader: [
    '22px',
    { lineHeight: '120%', fontWeight: '400', fontFamily: 'TWK Lausanne' },
  ],
  'body-xl': [
    '20px',
    { lineHeight: '120%', fontWeight: '400', fontFamily: 'TWK Lausanne' },
  ],
  'body-l': [
    '18px',
    { lineHeight: '120%', fontWeight: '400', fontFamily: 'TWK Lausanne' },
  ],
  body: [
    '16px',
    { lineHeight: '140%', fontWeight: '400', fontFamily: 'TWK Lausanne' },
  ],
  'body-s': [
    '14px',
    { lineHeight: '140%', fontWeight: '400', fontFamily: 'TWK Lausanne' },
  ],
  'body-xs': [
    '12px',
    { lineHeight: '140%', fontWeight: '400', fontFamily: 'TWK Lausanne' },
  ],
  'body-xxs': [
    '10px',
    { lineHeight: '140%', fontWeight: '400', fontFamily: 'TWK Lausanne' },
  ],
} as const;

// For use in tailwind.config.js
export const typography = {
  fontFamily,
  fontSize,
} as const;

export type FontSize = keyof typeof fontSize;
export type FontFamily = keyof typeof fontFamily;
