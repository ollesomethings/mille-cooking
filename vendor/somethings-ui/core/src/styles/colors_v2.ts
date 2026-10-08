// NEW DESIGN SYSTEM V2

export const colorsV2 = {
  text: {
    primary: '#1F1E1D',
    secondary: '#58534C',
    tertiary: '#999388',
    placeholder: '#B8B2A9',
  },
  buttonText: {
    primary: '#FFFFFF',
    secondary: '#1F1E1D',
    tertiary: '#1F1E1D',
    quaternary: '#1F1E1D',
    destructive: '#CC3300',
    elevated: '#FFFFFF',
    // Legacy variants
    brand: '#FFFFFF',
    'ghost-black': '#1F1E1D',
    'ghost-gray': '#4B5563',
  },
  buttonBorder: {
    secondary: '#1F1E1D',
    tertiary: '#DFDAD3',
    destructive: '#DFDAD3',
  },
  buttonBackground: {
    primary: '#000000',
    secondary: '#FFFFFF',
    tertiary: '#FFFFFF',
    destructive: '#FFFFFF',
    elevated: '#FF5001',
  },
  icon: {
    primary: '#1F1E1D',
    secondary: '#58534C',
    tertiary: '#999388',
  },
  states: {
    hyperlinked: '#5E65FC',
    active: '#FF5001',
    inactive: '#B8B2A9',
    focused: '#5E65FC',
    success: '#7CC55A',
    successHighlight: '#F0FAE8',
    warning: '#FFED0F',
    error: '#F43939',
    errorHighlight: '#F8E6E6',
    online: '#4D7C0F',
  },
  input: {
    border: '#1F1E1D',
  },
  surfaces: {
    z0: '#FFFFFF',
    z1: '#FFFFFF',
    z2: '#FDFCF9',
    z3: '#F7F5F1',
    z4: '#ECE8E1',
    z5: '#DFDAD3',
    divider: '#F2F0EC',
    overlay: 'rgba(0, 0, 0, 0.25)',
    chatSendButton: '#5E65FC',
    chatTeen: '#5E65FC',
    chatMentor: '#F7F5F1',
    chatOutgoing: '#485AF8',
  },
  brand: {
    trueBlack: '#000000',
    trueWhite: '#FFFFFF',
    ecru: '#EAE6DC',
    ivory: '#F8F5EE',
    silver: '#F0F0F0',
    tangelo: '#FF5001',
    sunshine: '#FFE81F',
    forest: '#5FA74B',
    sky: '#71E0FF',
    lime: '#C2DF4F',
    apricot: '#FF9812',
    blush: '#FFA8B2',
    fuchsia: '#FF83FE',
    violet: '#B164FF',
    periwinkle: '#7178FF',
    darkMaroon: '#582020',
    darkViolet: '#201F46',
    coronationBlue: '#212058',
    periwinkleDark: '#2F2D82',
  },
} as const;

export type ColorNameV2 = keyof typeof colorsV2;
export type ColorTokensV2 = keyof typeof colorsV2;
export type TextColorTokensV2 = keyof typeof colorsV2.text;
