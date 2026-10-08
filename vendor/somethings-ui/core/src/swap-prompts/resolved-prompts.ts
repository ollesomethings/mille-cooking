import {
  SWAP_PROMPTS_DATA,
  RANDOM_SWAP_PROMPTS_DATA,
  SwapPromptBase,
  ScribbleKey,
} from './prompts';
import { Scribbles } from '../assets';
import { ImageSource } from './types';

export interface SwapPrompt extends Omit<
  SwapPromptBase,
  'scribbleKey' | 'highlightKey'
> {
  scribble: ImageSource;
  highlight: ImageSource;
}

const scribbleMap: Record<ScribbleKey, ImageSource> = {
  blueScribble: Scribbles.blueScribble,
  blueSwoosh: Scribbles.blueSwoosh,
  blueSwooshSmall: Scribbles.blueSwooshSmall,
  blushHighlight: Scribbles.blushHighlight,
  fuchsiaHighlight: Scribbles.fuchsiaHighlight,
  greenSwoosh: Scribbles.greenSwoosh,
  limeHighlight: Scribbles.limeHighlight,
  limeSwoosh: Scribbles.limeSwoosh,
  orangeCloud: Scribbles.orangeCloud,
  orangeStarburst: Scribbles.orangeStarburst,
  periwinkleHighlight: Scribbles.periwinkleHighlight,
  pinkLoops: Scribbles.pinkLoops,
  pinkOval: Scribbles.pinkOval,
  pinkStarburst: Scribbles.pinkStarburst,
  purpleSwoosh: Scribbles.purpleSwoosh,
  skyHighlight: Scribbles.skyHighlight,
  sunshineHighlight: Scribbles.sunshineHighlight,
  violetHighlight: Scribbles.violetHighlight,
  yellowLoops: Scribbles.yellowLoops,
  yellowOval: Scribbles.yellowOval,
  yellowSpiral: Scribbles.yellowSpiral,
  yellowSwoosh: Scribbles.yellowSwoosh,
};

export const SWAP_PROMPTS: SwapPrompt[] = SWAP_PROMPTS_DATA.map(p => {
  const { scribbleKey, highlightKey, ...rest } = p;
  return {
    ...rest,
    scribble: scribbleMap[scribbleKey],
    highlight: scribbleMap[highlightKey],
  };
});

export const RANDOM_SWAP_PROMPTS: SwapPrompt[] = RANDOM_SWAP_PROMPTS_DATA.map(
  p => {
    const { scribbleKey, highlightKey, ...rest } = p;
    return {
      ...rest,
      scribble: scribbleMap[scribbleKey],
      highlight: scribbleMap[highlightKey],
    };
  },
);

export const DEFAULT_CUSTOM_PROMPT: SwapPrompt = {
  id: 'custom',
  title: '',
  subtitle: '',
  backgroundColor: '#B164FF',
  category: 'Photo Swap',
  scribble: Scribbles.yellowSwoosh,
  highlight: Scribbles.sunshineHighlight,
};

export function getRandomPrompt(exclude?: SwapPrompt): SwapPrompt {
  const filtered = exclude
    ? RANDOM_SWAP_PROMPTS.filter(p => p.id !== exclude.id)
    : RANDOM_SWAP_PROMPTS;
  const pool = filtered.length > 0 ? filtered : RANDOM_SWAP_PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function resolveSwapPrompt(
  promptId: string | undefined,
  customTitle?: string,
): SwapPrompt {
  if (promptId) {
    const found =
      SWAP_PROMPTS.find(p => p.id === promptId) ||
      RANDOM_SWAP_PROMPTS.find(p => p.id === promptId);
    if (found) return found;
  }

  return {
    ...DEFAULT_CUSTOM_PROMPT,
    id: promptId || 'custom',
    title: customTitle ?? '',
  };
}

export type { SwapPromptBase, ScribbleKey };
