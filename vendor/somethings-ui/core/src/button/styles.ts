import { cva } from 'class-variance-authority';

const buttonContainerStyles = cva(
  ['flex flex-row gap-2 items-center justify-center self-center'],
  {
    variants: {
      variant: {
        primary: [
          'bg-buttonBackground-primary active:bg-buttonBackground-primary/85',
        ],
        secondary: [
          'bg-buttonBackground-secondary border border-buttonBorder-secondary',
        ],
        tertiary: [
          'bg-buttonBackground-tertiary border border-buttonBorder-tertiary',
        ],
        quaternary: ['bg-transparent border-none'],
        destructive: [
          'bg-buttonBackground-destructive border border-buttonBorder-tertiary',
        ],
        elevated: [
          'bg-buttonBackground-elevated active:bg-buttonBackground-elevated/85',
        ],

        // DEPRECATED
        brand: [
          'bg-blue-600',
          'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        ],
        'ghost-black': [
          'bg-transparent',
          'hover:bg-gray-100 focus:ring-2 focus:ring-gray-200',
        ],
        'ghost-gray': [
          'bg-transparent',
          'hover:bg-gray-100 focus:ring-2 focus:ring-gray-200',
        ],
      },
      size: {
        sm: 'h-[44px] px-[24px]', // hugged
        md: 'px-4 py-3', // 12px
        lg: 'h-[53px] px-[24px]', // hugged
      },
      fullWidth: {
        true: 'w-full',
        false: 'self-center',
      },
      withIcon: {
        leading: 'inline-flex items-center',
        trailing: 'inline-flex items-center',
        both: 'inline-flex items-center',
        none: '',
      },
      shape: {
        rounded: 'rounded-md',
        square: 'rounded-none',
        pill: 'rounded-full',
      },
      disabled: {
        true: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
      withIcon: 'none',
      shape: 'pill',
      fullWidth: true,
    },
    compoundVariants: [
      {
        variant: ['ghost-black', 'ghost-gray'],
        className: '',
      },
      {
        withIcon: ['leading', 'trailing', 'both'],
        className: 'justify-center',
      },
      {
        variant: ['primary'],
        disabled: true,
        className: 'bg-states-inactive',
      },
      {
        variant: ['elevated'],
        disabled: true,
        className: 'bg-states-inactive',
      },
    ],
  },
);

const buttonTextStyles = cva('font-avantt', {
  variants: {
    variant: {
      primary: 'text-buttonText-primary',
      secondary: 'text-buttonText-secondary',
      tertiary: 'text-buttonText-tertiary',
      quaternary: 'text-buttonText-quaternary',
      destructive: 'text-buttonText-destructive',
      elevated: 'text-buttonText-elevated',

      // DEPRECATED
      brand: 'text-white',
      'ghost-black': 'text-gray-900',
      'ghost-gray': 'text-gray-600',
    },
    size: {
      sm: 'text-button-2',
      md: 'text-button-1',
      lg: 'text-button-1',
    },
    disabled: {
      true: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'lg',
  },
  compoundVariants: [
    {
      variant: ['secondary', 'tertiary', 'quaternary', 'destructive'],
      disabled: true,
      className: 'text-states-inactive',
    },
    {
      variant: ['elevated'],
      disabled: true,
      className: 'text-buttonText-elevated',
    },
  ],
});

const buttonIconStyles = cva('shrink-0 items-center flex justify-center', {
  variants: {
    variant: {
      primary: 'text-icon-primary',
      secondary: 'text-icon-secondary',
      tertiary: 'text-icon-tertiary',
      quaternary: '',
      destructive: '',
      elevated: '',

      // DEPRECATED
      brand: 'text-white',
      'ghost-black': 'text-gray-900',
      'ghost-gray': 'text-gray-600',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export { buttonContainerStyles, buttonTextStyles, buttonIconStyles };
