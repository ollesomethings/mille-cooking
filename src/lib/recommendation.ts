import { CALM_TOOLS, SELFCARE_TOOLS, type SelfcareTool } from '@/data/selfcare-tools';

export interface Recommendation {
  tool: SelfcareTool;
  line: string;
}

/**
 * The Hub's "recommended" slot. Set-aware prototype rules — a real
 * recommendation system replaces this function; keep the signature.
 *
 * Between midnight and 6am local time:
 *  - default tool set → the breathing tool
 *  - mental-health (calm) set → the calm-cards deck, for variety
 *  - know-your-mentor set → nothing (icebreakers aren't a 3am nudge)
 * Any other hour → nothing, and the slot stays hidden.
 */
export function getRecommendation(
  opts: { now?: Date; calmSet?: boolean; mentorSet?: boolean } = {},
): Recommendation | null {
  const hour = (opts.now ?? new Date()).getHours();
  if (hour < 0 || hour >= 6 || opts.mentorSet) return null;

  if (opts.calmSet) {
    const tool = CALM_TOOLS.find(t => t.id === 'calm_deck');
    if (tool) return { tool, line: 'Too wired to sleep? Pull one card.' };
  }
  const tool = SELFCARE_TOOLS.find(t => t.id === 'ground');
  return tool ? { tool, line: "It's late. This one helps." } : null;
}
