import { TrackingPattern } from '@/data/goals';
import { Moodies, Scribbles } from '@/lib/scribbles';

/**
 * The one place a tracking pattern's identity (icon, scribble accent, warm
 * tint) is defined. Every screen that shows a goal — the Corner list, the
 * Personalize/Confirmation steps of Accept & Set — pulls from here, so the
 * same goal reads as the same goal everywhere it appears.
 */
export const PATTERN_VISUALS: Record<
  TrackingPattern,
  { icon: { uri: string }; scribble: { uri: string }; accent: string; tint: string }
> = {
  moodCheck: {
    icon: Moodies.awkward,
    scribble: Scribbles.pinkOval,
    accent: '#E85C82',
    tint: 'rgba(232,92,130,0.08)',
  },
  numericTarget: {
    icon: Moodies.tired,
    scribble: Scribbles.periwinkleCloud,
    accent: '#4D55FD',
    tint: 'rgba(77,85,253,0.08)',
  },
  binaryStreak: {
    icon: Moodies.pleased,
    scribble: Scribbles.greenSwoosh,
    accent: '#5FA74B',
    tint: 'rgba(95,167,75,0.08)',
  },
  dayReview: {
    icon: Moodies.confused,
    scribble: Scribbles.yellowSpiral,
    accent: '#A6841F',
    tint: 'rgba(166,132,31,0.08)',
  },
};
