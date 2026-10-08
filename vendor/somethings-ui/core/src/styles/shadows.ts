export const boxShadow = {
  low: '0px 2px 8px 0px rgba(0, 0, 0, 0.05)',
  mid: '0px 4px 24px 0px rgba(0, 0, 0, 0.10)',
  high: '0px 8px 48px 0px rgba(0, 0, 0, 0.15)',
  small: '0px 0px 16px 0px rgba(0, 0, 0, 0.08)',
  medium: '0px 2px 24px 0px rgba(0, 0, 0, 0.08)',
} as const;

// For use in tailwind.config.js
export const shadows = {
  boxShadow,
} as const;

export type BoxShadow = keyof typeof boxShadow;
