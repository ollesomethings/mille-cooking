import { resolveCadenceChips } from '@/data/cadence-resolution';
import { Goal, NumericTargetState, needsAttentionToday } from '@/data/goals';
import { useGoalsStore } from '@/stores/goals-store';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { ChipRow, GoalCardShell, MarkTrack, MetaBadge } from './goal-card-shell';
import { PATTERN_VISUALS } from '../pattern-visuals';
import { SafetyBanner } from './safety-banner';

export function NumericTargetCard({ goal }: { goal: Goal & { patternState: NumericTargetState } }) {
  const logPatternProgress = useGoalsStore(s => s.logPatternProgress);
  const ps = goal.patternState;
  const [pending, setPending] = useState(ps.value);
  const dueToday = needsAttentionToday(goal);

  const step = (delta: number) =>
    setPending(v => Math.round((Math.min(12, Math.max(0, v + delta))) * 2) / 2);

  const chips = resolveCadenceChips({
    cadence: goal.cadence,
    patternCycleLabel: `TARGET · ${ps.target} ${ps.unit.toUpperCase()}/NIGHT`,
  });

  return (
    <View>
      {goal.safetyAdjacent ? <SafetyBanner /> : null}
      <GoalCardShell
        icon={<Image source={PATTERN_VISUALS.numericTarget.icon} style={{ width: 30, height: 30 }} contentFit="contain" />}
        title={goal.text}
        tone={ps.graduated ? 'success' : 'default'}
        trailing={
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <MarkTrack marks={ps.track} total={ps.totalNights} size="compact" />
            <MetaBadge
              text={ps.graduated ? 'REACHED' : `${ps.value} / ${ps.target} ${ps.unit.toUpperCase()}`}
              urgent={dueToday && !ps.graduated}
            />
          </View>
        }
      >
        <ChipRow chips={[...chips, `${ps.totalNights} NIGHTS`]} />
        <MarkTrack marks={ps.track} total={ps.totalNights} size="full" />
        <View className="h-px bg-surfaces-divider" />
        {ps.loggedTonight ? (
          <Text className="text-caption-1 text-tertiary">
            {ps.graduated
              ? `${ps.target} ${ps.unit}. That's the finish line — this one's done.`
              : `Logged tonight. Hitting ${ps.target} turns this tile green — that's the finish line.`}
          </Text>
        ) : (
          <>
            <Text className="text-body-2 text-primary">
              How many {ps.unit} last night?
            </Text>
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Pressable
                onPress={() => step(-0.5)}
                className="h-11 w-11 items-center justify-center rounded-xl bg-white border border-surfaces-divider active:opacity-70"
              >
                <Minus size={16} color="#1F1E1D" strokeWidth={2} />
              </Pressable>
              <View className="flex-1 items-center rounded-xl bg-white border-2 py-2.5" style={{ borderColor: '#4D55FD' }}>
                <Text className="text-geist text-primary" style={{ fontSize: 22 }}>
                  {pending % 1 ? pending.toFixed(1) : String(pending)}{' '}
                  <Text className="text-geist text-tertiary" style={{ fontSize: 12 }}>
                    {ps.unit.toUpperCase()}
                  </Text>
                </Text>
              </View>
              <Pressable
                onPress={() => step(0.5)}
                className="h-11 w-11 items-center justify-center rounded-xl bg-white border border-surfaces-divider active:opacity-70"
              >
                <Plus size={16} color="#1F1E1D" strokeWidth={2} />
              </Pressable>
            </View>
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                logPatternProgress(goal.id, { pattern: 'numericTarget', value: pending });
              }}
              className="items-center justify-center rounded-full bg-brand-trueBlack py-3"
            >
              <Text className="text-body-2 text-white">Log it</Text>
            </Pressable>
          </>
        )}
      </GoalCardShell>
    </View>
  );
}
