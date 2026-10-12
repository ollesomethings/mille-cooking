import { track } from '@/lib/analytics';
import { create } from 'zustand';

/**
 * Cross-screen navigation into the Hub pane. The Hub is a page of the home
 * pager, not a router route, so surfaces outside the pager (tool exits) and
 * inside it (the offline pointer) ask for it here and HomePager scrolls over.
 *
 * hub_opened for these sources is tracked HERE at request time — a request
 * always lands on the hub, and the pane may already be fronted (tool exits
 * always are), in which case no activation transition would ever fire.
 * HubTab tracks the plain home_entry arrivals itself, skipping activations
 * a fresh request just caused (the `at` timestamp).
 */
export type HubSource =
  | 'home_entry'
  | 'offline_pointer'
  | 'tool_exit'
  | 'chat_hint'
  | 'coachmark';

interface NavState {
  /** Pending "go to the hub" request; id bumps so repeats re-trigger */
  hubRequest: { source: HubSource; id: number; at: number } | null;
  requestHub: (source: HubSource) => void;
  /** Pending "go to chat" request (playlist → "say it in chat" jumps) */
  chatRequest: { id: number } | null;
  requestChat: () => void;
}

export const useNavStore = create<NavState>(set => ({
  hubRequest: null,
  requestHub: source => {
    track('hub_opened', { source });
    set(s => ({
      hubRequest: { source, id: (s.hubRequest?.id ?? 0) + 1, at: Date.now() },
    }));
  },
  chatRequest: null,
  requestChat: () =>
    set(s => ({ chatRequest: { id: (s.chatRequest?.id ?? 0) + 1 } })),
}));
