import { cva } from 'class-variance-authority';

export const pingContainerStyles = cva(['bg-black rounded-sm px-4 py-2'], {
  variants: {
    position: {
      center: [],
      top: [],
      bottom: [],
    },
  },
  defaultVariants: {
    position: 'center',
  },
});

export const pingTextStyles = cva([
  'text-body-3',
  'font-twk',
  'text-white',
  'leading-[1.4]',
]);

export const pingOverlayStyles = cva(
  ['absolute inset-0 flex items-center justify-center pointer-events-none'],
  {
    variants: {
      position: {
        center: ['justify-center'],
        top: ['justify-start pt-20'],
        bottom: ['justify-end pb-20'],
      },
    },
    defaultVariants: {
      position: 'center',
    },
  },
);
