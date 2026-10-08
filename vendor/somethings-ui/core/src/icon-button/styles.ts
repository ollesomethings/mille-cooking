import { cva } from 'class-variance-authority';

export const iconButtonStyles = cva(
  [
    'flex items-center justify-center',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-buttonBackground-elevated text-buttonText-elevated',
          'active:bg-buttonBackground-elevated/85',
          'focus:ring-buttonBackground-elevated',
        ],
        secondary: [
          'bg-buttonBackground-secondary text-buttonText-secondary',
          'border border-[#F2F2F2]',
          'shadow-[0_0_16px_0_rgba(0,0,0,0.08)]',
          'hover:bg-surfaces-z0',
          'focus:ring-black',
        ],
        tertiary: [
          'bg-transparent text-icon-primary',
          'hover:bg-gray-100',
          'focus:ring-black',
        ],
        glass: [
          'bg-white/20 text-white',
          'hover:bg-white/30',
          'focus:ring-white/50',
        ],
        'ghost-black': ['text-black', 'hover:bg-gray-100', 'focus:ring-black'],
        'ghost-gray': [
          'text-gray-500',
          'hover:bg-gray-100',
          'focus:ring-gray-500',
        ],
        destructive: [
          'bg-red-600 text-white',
          'hover:bg-red-700',
          'focus:ring-red-500',
        ],
        'header-ghost': ['text-icon-primary', 'active:opacity-70'],
        'header-glass': [
          'bg-white/20 backdrop-blur-sm text-white',
          'active:bg-white/30',
        ],
        'header-elevated': [
          'bg-buttonBackground-secondary text-icon-primary',
          'border border-surfaces-divider',
          'shadow-[0_0_16px_0_rgba(0,0,0,0.08)]',
        ],
      },
      size: {
        sm: 'h-8 w-8 p-1.5',
        md: 'h-10 w-10 p-2',
        lg: 'h-12 w-12 p-2.5',
        xl: 'h-14 w-14 p-3',
        '2xl': 'h-16 w-16 p-4',
      },
      shape: {
        circle: 'rounded-full',
        'round-rectangle': 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'circle',
    },
  },
);
