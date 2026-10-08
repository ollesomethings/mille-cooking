import { create } from 'zustand';
import {
  Cadence,
  DayMark,
  Goal,
  TrackingPattern,
  classifyGoal,
  initialGoals,
  makeGoalId,
  makeInitialPatternState,
} from '@/data/goals';

// Interactive logging never writes a 'rough' (red) mark — that's reserved
// for illustrative seed history. A logged-but-not-great entry is 'neutral'
// (grey), matching the app's non-punitive tone: "not today" is a fact, not
// a failure.
function markFor(good: boolean): DayMark {
  return good ? 'good' : 'neutral';
}

export type PatternLogPayload =
  | { pattern: 'moodCheck'; mark: 'good' | 'rough' }
  | { pattern: 'numericTarget'; value: number }
  | { pattern: 'binaryStreak'; mark: 'good' | 'rough' }
  | { pattern: 'dayReview'; action: 'talk' | 'keepGoing' };

interface CommitGoalInput {
  /** Present when claiming an existing recommended candidate; absent for a
   * from-scratch "write your own" goal. */
  id?: string;
  text: string;
  personalized: boolean;
  cadence: Cadence;
  /**
   * The Deck flow classifies a goal's pattern as soon as it's claimed (not
   * at this final commit step) so its icon/accent stay consistent across
   * Personalize → Confirmation → the list. Falls back to classifying here
   * if a caller doesn't have one yet.
   */
  trackingPattern?: TrackingPattern;
}

interface GoalsState {
  goals: Goal[];
  /** Last time the teen said "I don't know yet" — kept so it's easy to revisit, never a dead end. */
  idkAt: string | null;

  skipGoal: (id: string) => void;
  /** The single commit point for a goal becoming real — called from
   * Confirmation ("Lock it in"), after Deck -> Personalize -> Cadence.
   * Claiming a card in the Deck itself is just local flow state until here. */
  commitGoal: (input: CommitGoalInput) => void;
  markIdk: () => void;
  logPatternProgress: (goalId: string, payload: PatternLogPayload) => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: initialGoals,
  idkAt: null,

  skipGoal: id => {
    // Skipping is a legitimate, unpenalized choice — the goal just stays
    // parked in "recommended", nothing is deleted or flagged.
    set(s => ({
      goals: s.goals.map(g => (g.id === id ? { ...g } : g)),
    }));
  },

  commitGoal: ({ id, text, personalized, cadence, trackingPattern: patternOverride }) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const trackingPattern = patternOverride ?? classifyGoal();
    const patternState = makeInitialPatternState(trackingPattern);
    const now = new Date().toISOString();

    if (id) {
      set(s => ({
        goals: s.goals.map(g =>
          g.id === id
            ? {
                ...g,
                text: trimmed,
                personalized,
                cadence,
                trackingPattern,
                patternState,
                status: 'claimed',
                claimedAt: now,
              }
            : g,
        ),
      }));
      return;
    }

    const goal: Goal = {
      id: makeGoalId(),
      text: trimmed,
      origin: 'custom',
      status: 'claimed',
      personalized: true,
      category: 'self-esteem',
      cadence,
      trackingPattern,
      patternState,
      createdAt: now,
      claimedAt: now,
    };
    set(s => ({ goals: [...s.goals, goal] }));
  },

  markIdk: () => set({ idkAt: new Date().toISOString() }),

  logPatternProgress: (goalId, payload) => {
    set(s => ({
      goals: s.goals.map(g => {
        if (g.id !== goalId || !g.patternState) return g;
        const ps = g.patternState;

        if (payload.pattern === 'moodCheck' && ps.pattern === 'moodCheck') {
          if (ps.loggedToday) return g;
          const track: DayMark[] = [...ps.track, markFor(payload.mark === 'good')];
          return {
            ...g,
            patternState: {
              ...ps,
              track,
              dayIndex: ps.dayIndex + 1,
              loggedToday: true,
            },
          };
        }

        if (payload.pattern === 'numericTarget' && ps.pattern === 'numericTarget') {
          if (ps.loggedTonight) return g;
          const reached = payload.value >= ps.target;
          const track: DayMark[] = [...ps.track, markFor(reached)];
          return {
            ...g,
            status: reached ? 'completed' : g.status,
            completedAt: reached ? new Date().toISOString() : g.completedAt,
            patternState: {
              ...ps,
              value: payload.value,
              track,
              loggedTonight: true,
              graduated: reached,
            },
          };
        }

        if (payload.pattern === 'binaryStreak' && ps.pattern === 'binaryStreak') {
          if (ps.loggedToday) return g;
          const weekTrack: DayMark[] = [...ps.weekTrack, markFor(payload.mark === 'good')].slice(-7);
          return {
            ...g,
            patternState: {
              ...ps,
              streak: payload.mark === 'good' ? ps.streak + 1 : ps.streak,
              weekTrack,
              loggedToday: true,
            },
          };
        }

        if (payload.pattern === 'dayReview' && ps.pattern === 'dayReview') {
          // "Talk it through with mentor" hands off outside this app — no
          // goal-state change here, just acknowledged by the caller's own toast.
          if (payload.action === 'talk') return g;
          return {
            ...g,
            patternState: {
              ...ps,
              cycle: ps.cycle + 1,
              currentDay: 1,
              needsReview: false,
            },
          };
        }

        return g;
      }),
    }));
  },
}));

export function useGoal(id: string | undefined) {
  return useGoalsStore(s => s.goals.find(g => g.id === id));
}
