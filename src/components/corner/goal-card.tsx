import {
  BinaryStreakState,
  DayReviewState,
  Goal,
  MoodCheckState,
  NumericTargetState,
} from '@/data/goals';
import { BinaryStreakCard } from './goal-cards/binary-streak-card';
import { DayReviewCard } from './goal-cards/day-review-card';
import { MoodCheckCard } from './goal-cards/mood-check-card';
import { NumericTargetCard } from './goal-cards/numeric-target-card';

/**
 * Dispatches a claimed goal to the card variant matching its (backend-
 * stubbed) trackingPattern. Which of the 4 patterns a goal gets is never
 * decided here — this just renders whichever one it's already been given.
 */
export function GoalCard({ goal }: { goal: Goal }) {
  if (!goal.trackingPattern || !goal.patternState) return null;

  switch (goal.trackingPattern) {
    case 'moodCheck':
      return <MoodCheckCard goal={goal as Goal & { patternState: MoodCheckState }} />;
    case 'numericTarget':
      return <NumericTargetCard goal={goal as Goal & { patternState: NumericTargetState }} />;
    case 'binaryStreak':
      return <BinaryStreakCard goal={goal as Goal & { patternState: BinaryStreakState }} />;
    case 'dayReview':
      return <DayReviewCard goal={goal as Goal & { patternState: DayReviewState }} />;
  }
}
