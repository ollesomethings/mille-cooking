import { resolveCadenceChips } from '@/data/cadence-resolution';
import { Goal, MoodCheckState, needsAttentionToday } from '@/data/goals';
import { useGoalsStore } from '@/stores/goals-store';
import { Moodies } from '@/lib/scribbles';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { ChipRow, GoalCardShell, MarkTrack, MetaBadge } from './goal-card-shell';
import { PATTERN_VISUALS } from '../pattern-visuals';
import { SafetyBanner } from './safety-banner';

const MOOD_KEYS = ['sad', 'tired', 'confused', 'pleased', 'happy'] as const;

export function MoodCheckCard({ goal }: { goal: Goal & { patternState: MoodCheckState } }) {
  const logPatternProgress = useGoalsStore(s => s.logPatternProgress);
  const ps = goal.patternState;
  const [pick, setPick] = useState<number | null>(null);
  const dueToday = needsAttentionToday(goal);

  const chips = resolveCadenceChips({
    cadence: goal.cadence,
    patternCycleLabel: `DAY ${ps.dayIndex} OF ${ps.totalDays}`,
  });

  const canLog = pick !== null && !ps.loggedToday;

  return (
    <View>
      {goal.safetyAdjacent ? <SafetyBanner /> : null}
      <GoalCardShell
        icon={<Image source={PATTERN_VISUALS.moodCheck.icon} style={{ width: 30, height: 30 }} contentFit="contain" />}
        title={goal.text}
        trailing={
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <MarkTrack marks={ps.track} total={ps.totalDays} size="compact" />
            <MetaBadge text={`DAY ${ps.dayIndex}/${ps.totalDays}`} urgent={dueToday} />
          </View>
        }
      >
        <ChipRow chips={chips} />
        <MarkTrack marks={ps.track} total={ps.totalDays} size="full" />
        <View className="h-px bg-surfaces-divider" />
        <Text className="text-body-2 text-primary">How&apos;s it feeling today?</Text>
        <View className="flex-row justify-between">
          {MOOD_KEYS.map((key, i) => {
            const selected = pick === i;
            return (
              <Pressable
                key={key}
                onPress={() => setPick(i)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selected ? '#D4CBB5' : 'transparent',
                }}
              >
                <Image source={Moodies[key]} style={{ width: 34, height: 34 }} contentFit="contain" />
              </Pressable>
            );
          })}
        </View>
        <Pressable
          disabled={!canLog}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            logPatternProgress(goal.id, { pattern: 'moodCheck', mark: pick! >= 3 ? 'good' : 'rough' });
          }}
          className={`items-center justify-center rounded-full py-3 ${canLog ? 'bg-brand-trueBlack' : 'bg-surfaces-z3'}`}
        >
          <Text className={`text-body-2 ${canLog ? 'text-white' : 'text-tertiary'}`}>
            {ps.loggedToday ? 'Logged for today' : 'Log it'}
          </Text>
        </Pressable>
        <Text className="text-caption-1 text-tertiary">
          Same five every time — no target here, just noticing.
        </Text>
      </GoalCardShell>
    </View>
  );
}
