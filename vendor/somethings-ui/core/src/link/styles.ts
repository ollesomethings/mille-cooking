import { cva } from 'class-variance-authority';

export const linkStyles = cva(
  [
    'inline-flex items-center gap-2',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-sm',
  ],
  {
    variants: {
      variant: {
        primary: [
          'text-black',
          'hover:opacity-70',
          'focus:ring-black',
          'disabled:text-gray-300',
        ],
        brand: [
          'text-blue-600',
          'hover:text-blue-700',
          'focus:ring-blue-600',
          'disabled:text-gray-300',
        ],
      },
      disabled: {
        true: 'pointer-events-none text-gray-300',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      disabled: false,
    },
  },
);
