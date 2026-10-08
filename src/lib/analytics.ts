/**
 * Prototype analytics: every event logs to the console (no backend).
 * Every event carries the hour bucket + the 0–6am flag per the
 * offline-hours flow spec.
 */
export function track(event: string, props: Record<string, unknown> = {}) {
  const hour = new Date().getHours();
  console.log('[analytics]', event, {
    ...props,
    hour,
    late_night_0_6: hour < 6,
  });
}
