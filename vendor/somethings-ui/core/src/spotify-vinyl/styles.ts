import { cva } from 'class-variance-authority';

/** Outer vinyl disc wrapper — sets overall size */
export const vinylDiscStyles = cva(
  [
    'relative',
    'rounded-full',
    'flex',
    'items-center',
    'justify-center',
    'cursor-pointer',
    'select-none',
    'shrink-0',
    // dark vinyl colour
    'bg-[#1a1a1a]',
    'overflow-hidden',
  ],
  {
    variants: {
      size: {
        sm: [
          'w-24',
          'h-24',
          '[mask-image:radial-gradient(circle_at_center,transparent_4px,black_4px)]',
        ],
        md: [
          'w-40',
          'h-40',
          '[mask-image:radial-gradient(circle_at_center,transparent_6px,black_6px)]',
        ],
        lg: [
          'w-56',
          'h-56',
          '[mask-image:radial-gradient(circle_at_center,transparent_8px,black_8px)]',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/** Grooved ring — slightly lighter concentric ring drawn via box-shadow trick */
export const vinylGrooveStyles = cva(
  [
    'absolute',
    'inset-0',
    'rounded-full',
    'pointer-events-none',
    'ring-[3px]',
    'ring-[#333333]',
  ],
  {
    variants: {
      size: {
        sm: ['ring-[2px]'],
        md: ['ring-[3px]'],
        lg: ['ring-[4px]'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/** Album art — fills entire disc face */
export const vinylLabelStyles = cva(
  [
    'absolute',
    'inset-0',
    'rounded-full',
    'overflow-hidden',
    'object-cover',
    'pointer-events-none',
  ],
  {
    variants: {
      size: {
        sm: ['w-full', 'h-full'],
        md: ['w-full', 'h-full'],
        lg: ['w-full', 'h-full'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/** Center spindle hole overlay */
export const vinylHoleStyles = cva(
  [
    'absolute',
    'rounded-full',
    'bg-white',
    'border',
    'border-black/30',
    'z-10',
    'pointer-events-none',
  ],
  {
    variants: {
      size: {
        sm: ['w-2', 'h-2'],
        md: ['w-3', 'h-3'],
        lg: ['w-4', 'h-4'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/** Track title text below the disc */
export const vinylTitleStyles = cva(
  ['text-center', 'truncate', 'max-w-full', 'text-[#1a1a1a]'],
  {
    variants: {
      size: {
        sm: ['text-xs', 'mt-2'],
        md: ['text-sm', 'mt-3'],
        lg: ['text-base', 'mt-4'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/** Container wrapping disc + title */
export const vinylContainerStyles = cva(['flex', 'flex-col', 'items-center'], {
  variants: {
    size: {
      sm: [],
      md: [],
      lg: [],
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
