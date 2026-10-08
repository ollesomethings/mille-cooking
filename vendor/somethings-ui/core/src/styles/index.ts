import { colors } from './colors';
import { colorsV2 } from './colors_v2';
import { typography } from './fonts';
import { shadows } from './shadows';
import { radius } from './radius';
import { size } from './size';

export * from './colors';
export * from './colors_v2';
export * from './fonts';
export * from './shadows';
export * from './radius';
export * from './size';
export * from './plugins/typography';

export const theme = {
  extend: {
    colors,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    boxShadow: shadows.boxShadow,
    borderRadius: radius,
    spacing: size,
    textColor: colors.text,
  },
} as const;

export const themeV2 = {
  extend: {
    colors: colorsV2,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    boxShadow: shadows.boxShadow,
    borderRadius: radius,
    spacing: size,
    textColor: colorsV2.text,
  },
} as const;

// Usage in tailwind.config.js:
// import { theme } from "@your-org/core/styles";
// module.exports = {
//   theme,
// };
