/**
 * Web stub for expo-haptics. Metro aliases `expo-haptics` here on web —
 * see metro.config.js. Where the browser supports it (Android Chrome),
 * calls map to real navigator.vibrate patterns; elsewhere (iOS Safari,
 * desktop) they log to console so faked interactions stay visible.
 */

export enum ImpactFeedbackStyle {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
  Soft = 'soft',
  Rigid = 'rigid',
}

export enum NotificationFeedbackType {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export enum AndroidHaptics {
  Confirm = 'confirm',
  Reject = 'reject',
}

const IMPACT_MS: Record<ImpactFeedbackStyle, number> = {
  [ImpactFeedbackStyle.Light]: 10,
  [ImpactFeedbackStyle.Medium]: 20,
  [ImpactFeedbackStyle.Heavy]: 40,
  [ImpactFeedbackStyle.Soft]: 8,
  [ImpactFeedbackStyle.Rigid]: 16,
};

const NOTIFICATION_PATTERN: Record<NotificationFeedbackType, number[]> = {
  [NotificationFeedbackType.Success]: [12, 60, 24],
  [NotificationFeedbackType.Warning]: [24, 80, 24],
  [NotificationFeedbackType.Error]: [32, 70, 32, 70, 32],
};

function vibrate(pattern: number | number[], kind: string, detail: string) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate?.(pattern)) return;
  } catch {
    /* fall through to log */
  }
  console.debug(`[haptics stub] ${kind}: ${detail}`);
}

export async function impactAsync(style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium) {
  vibrate(IMPACT_MS[style], 'impact', style);
}

export async function notificationAsync(
  type: NotificationFeedbackType = NotificationFeedbackType.Success,
) {
  vibrate(NOTIFICATION_PATTERN[type], 'notification', type);
}

export async function selectionAsync() {
  vibrate(6, 'selection', 'tick');
}

export async function performAndroidHapticsAsync(type: AndroidHaptics) {
  vibrate(type === AndroidHaptics.Confirm ? [12, 40, 12] : [30, 50, 30], 'android', type);
}
