import { cva } from 'class-variance-authority';

const contentBlockContainerStyles = cva(['flex flex-col'], {
  variants: {
    alignment: {
      left: 'items-start text-left',
      center: 'items-center text-center',
      right: 'items-end text-right',
    },
  },
  defaultVariants: {
    alignment: 'left',
  },
});

const contentBlockHeaderStyles = cva('font-avantt mb-2 text-primary', {
  variants: {
    alignment: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    size: {
      xl: 'text-header-1',
      l: 'text-header-2',
      m: 'text-header-3',
      s: 'text-header-4',
      xs: 'text-header-5',
    },
  },
  defaultVariants: {
    alignment: 'left',
    size: 'm',
  },
});

const contentBlockBodyStyles = cva('text-text-placeholder font-twk', {
  variants: {
    alignment: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    size: {
      xl: 'text-body-1',
      l: 'text-body-1',
      m: 'text-body-1',
      s: 'text-body-2',
      xs: 'text-body-2',
    },
  },
  defaultVariants: {
    alignment: 'left',
    size: 'm',
  },
});

export {
  contentBlockContainerStyles,
  contentBlockHeaderStyles,
  contentBlockBodyStyles,
};
