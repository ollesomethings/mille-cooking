import { create } from 'zustand';

/**
 * State for the offline-hours self-care flow. In-memory only — the vent
 * text never leaves the device (and in this prototype, never leaves this
 * store).
 */
interface SelfcareState {
  ventText: string;
  setVentText: (t: string) => void;
  ventPromptId: string | null;
  setVentPromptId: (id: string | null) => void;
  /** Teen chose "Share with {mentor} for when they're back" */
  ventShared: boolean;
  setVentShared: (b: boolean) => void;
  reminderSet: boolean;
  setReminderSet: (b: boolean) => void;
  /** "Show me I'm not alone" intro shows once per session */
  notAloneIntroSeen: boolean;
  setNotAloneIntroSeen: (b: boolean) => void;
  /** Offline chat's "your space" pointer card was dismissed this session */
  spacePointerDismissed: boolean;
  setSpacePointerDismissed: (b: boolean) => void;
  reset: () => void;
}

export const useSelfcareStore = create<SelfcareState>(set => ({
  ventText: '',
  setVentText: ventText => set({ ventText }),
  ventPromptId: null,
  setVentPromptId: ventPromptId => set({ ventPromptId }),
  ventShared: false,
  setVentShared: ventShared => set({ ventShared }),
  reminderSet: false,
  setReminderSet: reminderSet => set({ reminderSet }),
  notAloneIntroSeen: false,
  setNotAloneIntroSeen: notAloneIntroSeen => set({ notAloneIntroSeen }),
  spacePointerDismissed: false,
  setSpacePointerDismissed: spacePointerDismissed => set({ spacePointerDismissed }),
  reset: () =>
    set({
      ventText: '',
      ventPromptId: null,
      ventShared: false,
      reminderSet: false,
      notAloneIntroSeen: false,
      spacePointerDismissed: false,
    }),
}));

declare global {
  interface Window {
    /** Headless-verification hook, dev builds only */
    __selfcare?: typeof useSelfcareStore;
  }
}
if (typeof window !== 'undefined' && __DEV__) {
  window.__selfcare = useSelfcareStore;
}
