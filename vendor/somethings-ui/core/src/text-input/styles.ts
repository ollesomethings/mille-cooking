import { cva } from 'class-variance-authority';

export const containerStyles = cva(['w-full'], {
  variants: {
    variant: {
      default: '',
      outlined: '',
      standard: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const inputStyles = cva(
  [
    'w-full px-3 py-[8px] text-base font-twk',
    'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        default:
          'border-b-[2px] border-buttonBorder-secondary pl-[8px] pr-[8px]',
        outlined: 'border rounded-md border-gray-300 focus:border-black',
        standard: 'border-b border-gray-300 focus:border-b-black',
      },
      error: {
        true: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const labelStyles = cva(['block text-sm text-gray-700 mb-1'], {
  variants: {
    error: {
      true: 'text-red-500',
    },
  },
});

export const errorStyles = cva(
  ['mt-[4px] text-[12px] text-states-error pl-[8px]'],
  {
    variants: {
      variant: {
        default: 'text-state-error',
        outlined: '',
        standard: '',
      },
    },
    defaultVariants: {},
  },
);

export const helperTextStyles = cva(['mt-1 text-sm text-gray-500'], {
  variants: {},
  defaultVariants: {},
});

export const iconContainerStyles = cva(
  ['absolute inset-y-0 flex items-center'],
  {
    variants: {
      position: {
        left: 'left-3',
        right: 'right-3',
      },
    },
  },
);
