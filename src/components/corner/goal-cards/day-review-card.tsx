import { resolveCadenceChips } from '@/data/cadence-resolution';
import { DayReviewState, Goal, needsAttentionToday } from '@/data/goals';
import { useGoalsStore } from '@/stores/goals-store';
import { mentor } from '@/data/mock';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { ChipRow, GoalCardShell, MarkTrack, MetaBadge } from './goal-card-shell';
import { PATTERN_VISUALS } from '../pattern-visuals';
import { SafetyBanner } from './safety-banner';

export function DayReviewCard({ goal }: { goal: Goal & { patternState: DayReviewState } }) {
  const logPatternProgress = useGoalsStore(s => s.logPatternProgress);
  const ps = goal.patternState;
  const [talkedNoted, setTalkedNoted] = useState(false);
  const dueToday = needsAttentionToday(goal);

  const chips = resolveCadenceChips({
    cadence: goal.cadence,
    patternCycleLabel: ps.needsReview
      ? `DAY ${ps.reviewDay} · REVIEW`
      : `CYCLE ${ps.cycle} · DAY ${ps.currentDay}`,
  });

  return (
    <View>
      {goal.safetyAdjacent ? <SafetyBanner /> : null}
      <GoalCardShell
        icon={<Image source={PATTERN_VISUALS.dayReview.icon} style={{ width: 30, height: 30 }} contentFit="contain" />}
        title={goal.text}
        trailing={
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <MarkTrack marks={ps.dots} total={ps.reviewDay} size="compact" />
            <MetaBadge
              text={ps.needsReview ? `DAY ${ps.reviewDay} · REVIEW` : `CYCLE ${ps.cycle} · DAY ${ps.currentDay}`}
              urgent={dueToday}
            />
          </View>
        }
      >
        <ChipRow chips={chips} />
        <MarkTrack marks={ps.dots} total={ps.reviewDay} size="full" />
        {ps.needsReview ? (
          <>
            <Text className="text-body-2 text-primary">
              More steady stretches than rough ones this month — and the rough ones got
              further apart.
            </Text>
            <View className="rounded-xl bg-surfaces-z3 px-4 py-3">
              <Text className="text-body-3 text-secondary">
                Time to look at this one together. Bring it to your next session with{' '}
                {mentor.name}.
              </Text>
            </View>
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                logPatternProgress(goal.id, { pattern: 'dayReview', action: 'talk' });
                setTalkedNoted(true);
              }}
              className="items-center justify-center rounded-full bg-brand-trueBlack py-3"
            >
              <Text className="text-body-2 text-white">
                {talkedNoted ? `Saved for ${mentor.name}` : `Talk it through with ${mentor.name}`}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                logPatternProgress(goal.id, { pattern: 'dayReview', action: 'keepGoing' });
              }}
              className="items-center justify-center rounded-full border border-surfaces-divider bg-white py-3"
            >
              <Text className="text-body-2 text-primary">Keep checking in</Text>
            </Pressable>
          </>
        ) : (
          <Text className="text-body-2 text-secondary">
            Still checking in — a good stretch doesn&apos;t mean this is resolved.
          </Text>
        )}
        <Text className="text-caption-1 text-tertiary">This one never &ldquo;completes.&rdquo;</Text>
      </GoalCardShell>
    </View>
  );
}
