import { mentor } from '@/data/mock';

/**
 * Offline-hours (self-care flow) fixtures. The mentor's return time is
 * honest, static demo data; the holding message is the mentor's own
 * automated away-message — labeled as automated in the UI, never a
 * simulated live reply.
 */
export const MENTOR_BACK_AT = '5pm ET';

/**
 * Live countdown to the mentor's return (next 5pm America/New_York),
 * formatted like "9h 24m". Honest about the wait instead of only naming a
 * time zone the teen has to convert.
 */
export function mentorReturnCountdown(now: Date = new Date()): string {
  const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const target = new Date(etNow);
  target.setHours(17, 0, 0, 0);
  if (etNow >= target) target.setDate(target.getDate() + 1);
  const ms = target.getTime() - etNow.getTime();
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${Math.max(m, 1)}m`;
}

export function holdingMessage() {
  return `hey, it's ${mentor.name} — i'm offline right now, but this space is always open. leave me anything and i'll read it first thing when i'm back 💛`;
}

/**
 * Crisis resources, from mono/link-v2
 * src/screens/chat/components/mentor-offline/ (reach-out-options.tsx).
 * These are real numbers; rows deep-link via tel:/sms: like the real app.
 */
export const CRISIS_RESOURCES = [
  {
    section: '911',
    label: 'I need medical attention',
    kind: 'phone' as const,
    number: '911',
  },
  {
    section: '988',
    label: 'I need mental health support',
    kind: 'phone' as const,
    number: '988',
  },
  {
    section: 'Crisis Text Line',
    label: 'I want to text someone',
    kind: 'text' as const,
    number: '741741',
  },
  {
    section: 'Warm Line',
    label: 'I want to talk on the phone',
    kind: 'phone' as const,
    number: '+18557337762',
  },
];
