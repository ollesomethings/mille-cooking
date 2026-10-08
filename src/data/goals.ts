export type GoalStatus = 'recommended' | 'claimed' | 'completed';
export type GoalOrigin = 'system' | 'custom';
export type Cadence = 'daily' | 'weekly' | 'whenever';

/**
 * The 4 tracked-goal card patterns. Which pattern a goal gets is a backend/
 * clinical classification decision — stubbed here via `classifyGoal`, never
 * computed from real signal. Nothing about *which* pattern a goal maps to is
 * meaningful product logic; it exists so the UI has something to render.
 */
export type TrackingPattern = 'moodCheck' | 'numericTarget' | 'binaryStreak' | 'dayReview';

/**
 * The 13-category clinical taxonomy lives on the backend for billing/documentation
 * only — this field is a stub to show the shape exists, and must never be rendered
 * anywhere in the teen-facing UI.
 */
export type ClinicalCategory =
  | 'emotional-regulation'
  | 'communication'
  | 'social-connection'
  | 'coping-skills'
  | 'self-esteem';

/**
 * A single day/night/entry's mark in a goal's track: green = went well,
 * grey-filled = logged neutral (no judgment — "not today" is not a failure),
 * red = rough, and null = hasn't happened yet (renders as an empty dash).
 * Interactive logging never produces 'rough' — that's reserved for
 * illustrative seed history, kept consistent with the app's non-punitive
 * tone ("this one never closes", "not today leaves no mark against you").
 */
export type DayMark = 'good' | 'neutral' | 'rough' | null;

export interface MoodCheckState {
  pattern: 'moodCheck';
  totalDays: number;
  dayIndex: number;
  track: DayMark[];
  loggedToday: boolean;
}

export interface NumericTargetState {
  pattern: 'numericTarget';
  value: number;
  target: number;
  unit: string;
  totalNights: number;
  track: DayMark[];
  loggedTonight: boolean;
  graduated: boolean;
}

export interface BinaryStreakState {
  pattern: 'binaryStreak';
  streak: number;
  weekTrack: DayMark[];
  loggedToday: boolean;
}

export interface DayReviewState {
  pattern: 'dayReview';
  reviewDay: number;
  currentDay: number;
  dots: DayMark[];
  cycle: number;
  needsReview: boolean;
}

export type PatternState =
  | MoodCheckState
  | NumericTargetState
  | BinaryStreakState
  | DayReviewState;

export interface Goal {
  id: string;
  /** The teen's own current wording — what's actually shown everywhere. */
  text: string;
  /** The original system-suggested wording, kept so "personalized" can be shown honestly. */
  suggestedText?: string;
  origin: GoalOrigin;
  status: GoalStatus;
  personalized: boolean;
  category: ClinicalCategory; // internal only — never shown to the teen
  /** Teen's stated check-in preference — set once, in the Cadence step. */
  cadence?: Cadence;
  /** Backend-stubbed classification. Assigned the moment a goal is claimed. */
  trackingPattern?: TrackingPattern;
  patternState?: PatternState;
  /**
   * Backend-stubbed safety flag. When true, the goal's card ALWAYS renders a
   * crisis-resources link + mentor-visibility indicator, regardless of
   * trackingPattern, and that banner is never part of the collapsible body —
   * it can't be hidden away like the rest of the card.
   */
  safetyAdjacent?: boolean;
  createdAt: string;
  claimedAt?: string;
  completedAt?: string;
}

let nextGoalId = 100;
export function makeGoalId() {
  return `goal-${nextGoalId++}`;
}

// Mock "intake" date — the demo teen started ~21 calendar days ago, comfortably
// inside the day-14–30 window the whole feature is gated on.
const DAYS_SINCE_INTAKE = 21;
const intakeDate = new Date();
intakeDate.setDate(intakeDate.getDate() - DAYS_SINCE_INTAKE);
export const teenIntakeDate = intakeDate.toISOString();

export function daysSinceIntake(fromIso: string = teenIntakeDate): number {
  const started = new Date(fromIso).getTime();
  const now = Date.now();
  return Math.floor((now - started) / (1000 * 60 * 60 * 24));
}

// --- stubbed backend classifier ---------------------------------------
// Assigns a tracking pattern the moment a goal is claimed. This is explicitly
// NOT real classification logic — just a deterministic cycle standing in for
// an upstream input this build doesn't own.
const PATTERN_CYCLE: TrackingPattern[] = [
  'moodCheck',
  'numericTarget',
  'binaryStreak',
  'dayReview',
];
let classifyCursor = 0;
export function classifyGoal(): TrackingPattern {
  const pattern = PATTERN_CYCLE[classifyCursor % PATTERN_CYCLE.length];
  classifyCursor += 1;
  return pattern;
}

export function makeInitialPatternState(pattern: TrackingPattern): PatternState {
  switch (pattern) {
    case 'moodCheck':
      return { pattern, totalDays: 30, dayIndex: 1, track: [], loggedToday: false };
    case 'numericTarget':
      return {
        pattern,
        value: 7,
        target: 8,
        unit: 'hrs',
        totalNights: 14,
        track: [],
        loggedTonight: false,
        graduated: false,
      };
    case 'binaryStreak':
      return { pattern, streak: 0, weekTrack: [], loggedToday: false };
    case 'dayReview':
      return {
        pattern,
        reviewDay: 30,
        currentDay: 1,
        dots: [],
        cycle: 1,
        needsReview: false,
      };
  }
}

/**
 * The one rule for "Needs You" vs "On Track": a day-30 review due today, OR
 * a daily-cadence goal with today's check-in still outstanding. Nothing
 * else — not the tracking pattern on its own, not alphabetical, not time
 * of day. Recomputed fresh every render from current goal state, so a goal
 * moves groups the moment it's logged (or the moment a new day makes it due
 * again) rather than needing any separate bookkeeping.
 */
export function needsAttentionToday(goal: Goal): boolean {
  const ps = goal.patternState;
  if (!ps) return false;
  if (ps.pattern === 'dayReview') return ps.needsReview;
  if (goal.cadence !== 'daily') return false;
  if (ps.pattern === 'moodCheck') return !ps.loggedToday;
  if (ps.pattern === 'numericTarget') return !ps.loggedTonight;
  if (ps.pattern === 'binaryStreak') return !ps.loggedToday;
  return false;
}

// Suggestions the system drafted from (mocked) intake survey answers + chat history.
// Warm, first-person, casual — never clinical-sounding, even though each privately
// maps to a category for documentation.
export const initialGoals: Goal[] = [
  {
    id: makeGoalId(),
    text: 'get better at saying something when a friend upsets me, instead of just sitting with it',
    suggestedText:
      'get better at saying something when a friend upsets me, instead of just sitting with it',
    origin: 'system',
    status: 'recommended',
    personalized: false,
    category: 'communication',
    createdAt: new Date().toISOString(),
  },
  {
    id: makeGoalId(),
    text: 'find one thing that actually helps me calm down when I’m stressed',
    suggestedText:
      'find one thing that actually helps me calm down when I’m stressed',
    origin: 'system',
    status: 'recommended',
    personalized: false,
    category: 'coping-skills',
    createdAt: new Date().toISOString(),
  },
  {
    id: makeGoalId(),
    text: 'feel a little less alone by reaching out to someone, even on the harder days',
    suggestedText:
      'feel a little less alone by reaching out to someone, even on the harder days',
    origin: 'system',
    status: 'recommended',
    personalized: false,
    category: 'social-connection',
    createdAt: new Date().toISOString(),
  },
  // --- already-claimed examples, one per tracking pattern -----------
  {
    id: makeGoalId(),
    text: 'feel less anxious in social situations',
    origin: 'system',
    status: 'claimed',
    personalized: false,
    category: 'emotional-regulation',
    cadence: 'weekly',
    trackingPattern: 'moodCheck',
    patternState: {
      pattern: 'moodCheck',
      totalDays: 30,
      dayIndex: 14,
      track: ['good', 'neutral', 'good', 'good', 'rough', 'neutral', 'good', 'good', 'neutral', 'good', 'good', 'rough', 'good', 'good'],
      loggedToday: false,
    },
    createdAt: new Date().toISOString(),
    claimedAt: new Date().toISOString(),
  },
  {
    id: makeGoalId(),
    text: 'get on top of my sleep schedule',
    origin: 'system',
    status: 'claimed',
    personalized: false,
    category: 'coping-skills',
    cadence: 'daily',
    trackingPattern: 'numericTarget',
    patternState: {
      pattern: 'numericTarget',
      value: 6.5,
      target: 8,
      unit: 'hrs',
      totalNights: 14,
      track: ['good', 'neutral', 'good', 'good', 'neutral', 'rough', 'good', 'good', 'neutral'],
      loggedTonight: false,
      graduated: false,
    },
    createdAt: new Date().toISOString(),
    claimedAt: new Date().toISOString(),
  },
  {
    id: makeGoalId(),
    text: 'journal every night',
    origin: 'custom',
    status: 'claimed',
    personalized: true,
    category: 'self-esteem',
    cadence: 'daily',
    trackingPattern: 'binaryStreak',
    patternState: {
      pattern: 'binaryStreak',
      streak: 14,
      weekTrack: ['good', 'good', 'neutral', 'good', 'good', 'good', 'neutral'],
      loggedToday: false,
    },
    createdAt: new Date().toISOString(),
    claimedAt: new Date().toISOString(),
  },
  {
    id: makeGoalId(),
    text: 'cut back on vaping',
    origin: 'system',
    status: 'claimed',
    personalized: false,
    category: 'coping-skills',
    cadence: 'whenever',
    trackingPattern: 'dayReview',
    patternState: {
      pattern: 'dayReview',
      reviewDay: 30,
      currentDay: 30,
      dots: ['good', 'neutral', 'good', 'good', 'good', 'rough', 'good', 'good', 'neutral', 'good', 'good', 'good', 'good', 'neutral', 'rough', 'good', 'good', 'good', 'good', 'neutral', 'good', 'good', 'good', 'good', 'good', 'rough', 'neutral', 'good', 'good', 'good'],
      cycle: 1,
      needsReview: true,
    },
    createdAt: new Date().toISOString(),
    claimedAt: new Date().toISOString(),
  },
  {
    id: makeGoalId(),
    text: 'reach out to someone before things get too heavy',
    origin: 'system',
    status: 'claimed',
    personalized: false,
    category: 'emotional-regulation',
    cadence: 'whenever',
    trackingPattern: 'moodCheck',
    patternState: {
      pattern: 'moodCheck',
      totalDays: 30,
      dayIndex: 9,
      track: ['neutral', 'good', 'good', 'rough', 'good', 'neutral', 'good', 'good'],
      loggedToday: false,
    },
    createdAt: new Date().toISOString(),
    claimedAt: new Date().toISOString(),
  },
];
