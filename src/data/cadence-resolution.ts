import { Cadence, TrackingPattern } from '@/data/goals';

/**
 * The teen picks their own check-in cadence (daily / weekly / whenever) at
 * Cadence time. Some tracking patterns also run on their own inherent cycle
 * (a 30-day mood window, a 14-night sleep target, a day-30 review) that has
 * nothing to do with what the teen chose. These two things can disagree —
 * that's a real, still-unresolved product question, not a bug to paper over.
 *
 * Current resolution: show both, transparently, as separate chips. Never
 * silently let one override or hide the other. Kept isolated here — a single
 * swappable function — so product can change the resolution strategy later
 * without touching any card-rendering code.
 */

const CADENCE_LABELS: Record<Cadence, string> = {
  daily: 'DAILY',
  weekly: 'WEEKLY',
  whenever: 'NO SCHEDULE',
};

export interface CadenceChipContext {
  cadence?: Cadence;
  trackingPattern?: TrackingPattern;
  /**
   * The pattern's own cycle label, already formatted by the caller (e.g.
   * "DAY 14 OF 30", "9 OF 14 NIGHTS", "DAY 30 · REVIEW"). This resolver
   * doesn't need to know each pattern's internal shape — just whether there
   * is a cycle label to show alongside the teen's cadence.
   */
  patternCycleLabel?: string;
}

export function resolveCadenceChips(ctx: CadenceChipContext): string[] {
  const chips: string[] = [];
  if (ctx.cadence) chips.push(CADENCE_LABELS[ctx.cadence]);
  if (ctx.patternCycleLabel) chips.push(ctx.patternCycleLabel);
  return chips;
}

export function cadenceChipForConfirmation(cadence: Cadence): string {
  const copy: Record<Cadence, string> = {
    daily: 'DAILY CHECK-INS · YOUR CALL',
    weekly: 'WEEKLY CHECK-INS · YOUR CALL',
    whenever: 'NO SCHEDULE · YOUR CALL',
  };
  return copy[cadence];
}
