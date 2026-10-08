import { resolveCadenceChips } from '@/data/cadence-resolution';
import { BinaryStreakState, Goal, needsAttentionToday } from '@/data/goals';
import { useGoalsStore } from '@/stores/goals-store';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, Text, View } from 'react-native';
import { ChipRow, GoalCardShell, MarkTrack, MetaBadge } from './goal-card-shell';
import { PATTERN_VISUALS } from '../pattern-visuals';
import { SafetyBanner } from './safety-banner';

export function BinaryStreakCard({ goal }: { goal: Goal & { patternState: BinaryStreakState } }) {
  const logPatternProgress = useGoalsStore(s => s.logPatternProgress);
  const ps = goal.patternState;
  const dueToday = needsAttentionToday(goal);

  const chips = resolveCadenceChips({ cadence: goal.cadence });

  return (
    <View>
      {goal.safetyAdjacent ? <SafetyBanner /> : null}
      <GoalCardShell
        icon={<Image source={PATTERN_VISUALS.binaryStreak.icon} style={{ width: 30, height: 30 }} contentFit="contain" />}
        title={goal.text}
        trailing={
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <MarkTrack marks={ps.weekTrack} total={7} size="compact" tone="muted" />
            <MetaBadge text={`${ps.streak} IN A ROW`} urgent={dueToday} />
          </View>
        }
      >
        <ChipRow chips={[...chips, `${ps.streak} IN A ROW`, 'NO FINISH LINE']} />
        <MarkTrack marks={ps.weekTrack} total={7} size="full" tone="muted" />
        <View className="h-px bg-surfaces-divider" />
        <Text className="text-body-2 text-primary">Did this happen today?</Text>
        <View className="flex-row" style={{ gap: 8 }}>
          <Pressable
            disabled={ps.loggedToday}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              logPatternProgress(goal.id, { pattern: 'binaryStreak', mark: 'good' });
            }}
            className={`flex-1 items-center justify-center rounded-full py-3 ${ps.loggedToday ? 'bg-surfaces-z3' : 'bg-brand-trueBlack'}`}
          >
            <Text className={`text-body-2 ${ps.loggedToday ? 'text-tertiary' : 'text-white'}`}>Yeah</Text>
          </Pressable>
          <Pressable
            disabled={ps.loggedToday}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              logPatternProgress(goal.id, { pattern: 'binaryStreak', mark: 'rough' });
            }}
            className="flex-1 items-center justify-center rounded-full border border-surfaces-divider bg-white py-3"
          >
            <Text className="text-body-2 text-primary">Not today</Text>
          </Pressable>
        </View>
        <Text className="text-caption-1 text-tertiary">
          &ldquo;Not today&rdquo; leaves no mark against you. This one never closes.
        </Text>
      </GoalCardShell>
    </View>
  );
}
