import * as Haptics from 'expo-haptics';

/**
 * One-line haptics for every platform. On native this is real haptics; on
 * web the metro alias (src/web/expo-haptics-stub.ts) maps to
 * navigator.vibrate on browsers that support it and logs elsewhere — so
 * call sites never need a Platform gate.
 */
export const buzz = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}),
  tick: () => Haptics.selectionAsync().catch(() => {}),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
};
