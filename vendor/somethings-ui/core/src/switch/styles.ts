import { cva } from 'class-variance-authority';

const switchContainerStyles = cva(
  ['relative inline-flex items-center rounded-full focus:outline-none'],
  {
    variants: {
      checked: {
        true: 'bg-brand-sky',
        false: 'bg-states-inactive',
      },
      disabled: {
        true: 'bg-states-inactive cursor-not-allowed opacity-60',
        false: '',
      },
      size: {
        sm: 'h-5 w-14 p-[3px]',
        default: 'h-7 w-[63px] p-[3.5px]',
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
      size: 'sm',
    },
    compoundVariants: [
      {
        disabled: true,
        checked: true,
        className: 'bg-states-inactive',
      },
    ],
  },
);

const switchThumbStyles = cva(['absolute rounded-full bg-white'], {
  variants: {
    checked: {
      true: '',
      false: 'translate-x-0',
    },
    size: {
      sm: 'h-3.5 w-7 left-[3px] top-[3px]',
      default: 'h-5 w-8 left-[3.5px] top-1',
    },
  },
  compoundVariants: [
    {
      checked: true,
      size: 'sm',
      className: 'translate-x-[20px]',
    },
    {
      checked: true,
      size: 'default',
      className: 'translate-x-[26px]',
    },
  ],
  defaultVariants: {
    checked: false,
    size: 'sm',
  },
});

const switchLabelStyles = cva(['text-sm text-gray-900'], {
  variants: {
    disabled: {
      true: 'text-states-inactive',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

const switchWrapperStyles = cva(['flex items-center flex-row gap-2 py-2']);

export {
  switchContainerStyles,
  switchThumbStyles,
  switchLabelStyles,
  switchWrapperStyles,
};
