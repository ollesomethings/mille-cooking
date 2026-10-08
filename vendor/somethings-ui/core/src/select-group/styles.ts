import { cva } from 'class-variance-authority';

export const selectGroupStyles = cva(['flex gap-[8px]'], {
  variants: {
    variant: {
      stacked: 'flex-col w-full',
      inline: 'flex-row flex-wrap',
      detailed: 'flex-col w-full',
    },
  },
  defaultVariants: {
    variant: 'stacked',
  },
});

export const selectItemStyles = cva(
  ['rounded-[24px] border border-buttonBorder-tertiary'],
  {
    variants: {
      variant: {
        stacked: [],
        inline: [],
        detailed: [],
      },
      selected: {
        true: ['bg-brand-sky', 'border-brand-sky'],
        false: [
          'bg-surfaces-z0',
          'border-buttonBorder-tertiary',
          'text-buttonText-primary',
        ],
      },
      disabled: {
        true: ['opacity-50'],
        false: ['opacity-100'],
      },
      height: {
        tall: ['px-[24px] py-[16px]'],
        short: ['px-[20px] py-[12px]'],
      },
      hasIcon: {
        true: ['pl-4'],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'stacked',
      selected: false,
      disabled: false,
      height: 'tall',
    },
    compoundVariants: [
      {
        variant: 'detailed',
        height: 'tall',
        selected: true,
        className: ['bg-brand-sky/10', 'border-brand-sky'],
      },
    ],
  },
);

export const selectGroupLabelStyles = cva(['text-base flex-shrink font-twk'], {
  variants: {
    variant: {
      stacked: [],
      inline: [],
      detailed: ['font-avantt'],
    },
    selected: {
      true: ['text-brand-trueBlack'],
      false: ['text-brand-trueBlack'],
    },
    textAlign: {
      left: ['text-left'],
      center: ['text-center'],
      right: ['text-right'],
    },
  },
  defaultVariants: {
    variant: 'stacked',
    selected: false,
    textAlign: 'left',
  },
});
