import { cva } from 'class-variance-authority';

export const fabContainerStyles = cva(['absolute', 'z-50'], {
  variants: {
    position: {
      'bottom-left': 'bottom-6 left-6',
      'bottom-right': 'bottom-6 right-6',
    },
  },
  defaultVariants: {
    position: 'bottom-right',
  },
});

export const fabOptionStyles = cva(['flex-row items-center', 'gap-3', 'py-2'], {
  variants: {
    position: {
      'bottom-left': 'flex-row-reverse',
      'bottom-right': 'flex-row',
    },
  },
  defaultVariants: {
    position: 'bottom-right',
  },
});

export const fabOptionLabelStyles = cva(
  ['text-header-5 text-base font-avantt', 'text-primary'],
  {
    variants: {
      position: {
        'bottom-left': 'text-left',
        'bottom-right': 'text-right',
      },
    },
    defaultVariants: {
      position: 'bottom-right',
    },
  },
);
