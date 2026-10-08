import clsx, { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { fontSize } from '../styles/fonts';

// Register custom design-system font sizes (e.g. `text-body-4`, `text-button-1`)
// so tailwind-merge classifies them as font-size and does not drop them when a
// text color class (e.g. `text-white`) is present in the same merge.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: Object.keys(fontSize) }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
