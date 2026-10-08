import { GoalCard } from '@/components/corner/goal-card';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Goal, needsAttentionToday } from '@/data/goals';
import { useGoalsStore } from '@/stores/goals-store';
import { Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

// Both the header "+" and the inline "add a goal" row route into the same
// Accept & Set (Deck) flow — there's no separate self-serve creation form.
// Config-gated so either entry point can be toggled off later without
// touching the flow logic itself.
const ADD_ENTRY: 'both' | 'header-plus' | 'inline-row' = 'both';

/**
 * Wraps a goal card so it fades/slides in on arrival, fades/slides out on
 * departure, and the whole list reflows smoothly around it — the same
 * animation vocabulary as the rest of the app's motion pass. This is what
 * makes moving from "Needs You" to "On Track" (or back, the next day it's
 * due again) read as a transition rather than a snap.
 */
function AnimatedGoalCard({ goal, index }: { goal: Goal; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 30).duration(220)}
      exiting={FadeOutUp.duration(200)}
      layout={LinearTransition.duration(260)}
    >
      <GoalCard goal={goal} />
    </Animated.View>
  );
}

function SectionLabel({ children, accent }: { children: string; accent?: boolean }) {
  return (
    <Text
      className="text-geist px-5 mb-1.5 mt-7"
      style={{
        fontSize: 10,
        letterSpacing: 1.2,
        color: accent ? '#4D55FD' : '#999388',
      }}
    >
      {children.toUpperCase()}
    </Text>
  );
}

function RecommendedPreviewCard({ count }: { count: number }) {
  const router = useRouter();
  return (
    <PressableScale
      onPress={() => router.push('/corner/deck')}
      scaleTo={0.98}
      className="mx-5 mt-2 rounded-3xl bg-surfaces-z2 border border-surfaces-divider overflow-hidden"
    >
      <View className="flex-row items-center">
        <View className="flex-1 p-5">
          <Text className="text-body-2 text-primary">
            {count} goal{count === 1 ? '' : 's'} still waiting for a look
          </Text>
          <View className="flex-row items-center mt-3">
            <Text className="text-body-3 text-primary underline mr-1">
              Go through them
            </Text>
            <ChevronRight size={15} color="#1F1E1D" strokeWidth={2} />
          </View>
        </View>
        <Image
          source={Scribbles.yellowSpiral}
          style={{ width: 84, height: 100, marginRight: 8 }}
          contentFit="contain"
        />
      </View>
    </PressableScale>
  );
}

function InlineAddGoalRow() {
  const router = useRouter();
  return (
    <PressableScale
      onPress={() => router.push('/corner/deck')}
      scaleTo={0.98}
      className="mx-5 flex-row items-center justify-center rounded-2xl py-3"
      style={{ borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CBC6BE', gap: 8 }}
    >
      <Plus size={15} color="#58534B" strokeWidth={2} />
      <Text className="text-body-2 text-secondary">add a goal</Text>
    </PressableScale>
  );
}

/** The lime scribble sweeps/draws itself in once on first load — subtle,
 * one-time, never loops. */
function CornerHeaderScribble() {
  const reveal = useSharedValue(0);

  useEffect(() => {
    reveal.value = withDelay(100, withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) }));
  }, [reveal]);

  const style = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ scaleX: interpolate(reveal.value, [0, 1], [0.7, 1]) }],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', top: -6, transformOrigin: 'left' }, style]}>
      <Image source={Scribbles.limeSwoosh} style={{ width: 130, height: 100 }} contentFit="contain" />
    </Animated.View>
  );
}

/**
 * "Your Corner" — the persistent home for goals. Lives to the left of Chat
 * in the main swipe pager, alongside the Hub to the right.
 */
export function CornerTab() {
  const goals = useGoalsStore(s => s.goals);
  const idkAt = useGoalsStore(s => s.idkAt);
  const router = useRouter();
  const [doneOpen, setDoneOpen] = useState(false);

  const inProgress = goals.filter(g => g.status === 'claimed');
  const completed = goals.filter(g => g.status === 'completed');
  const recommended = goals.filter(g => g.status === 'recommended');

  // The only rule: a day-30 review due today, or a daily-cadence goal with
  // today's check-in still outstanding. Everything else active is "on
  // track" — not bucket, not alphabetical, not time of day. Recomputed
  // fresh every render, so a goal moves the moment it's logged (or the
  // moment a new day makes it due again).
  const needsYou = inProgress.filter(needsAttentionToday);
  const onTrack = inProgress.filter(g => !needsAttentionToday(g));

  const isEmpty = inProgress.length === 0 && completed.length === 0;
  const showHeaderPlus = ADD_ENTRY === 'both' || ADD_ENTRY === 'header-plus';
  const showInlineAdd = ADD_ENTRY === 'both' || ADD_ENTRY === 'inline-row';

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingTop: 110, paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ position: 'relative' }}>
        <View className="items-center overflow-hidden">
          <CornerHeaderScribble />
          <Text className="text-header-3 text-primary text-center">Your Corner</Text>
        </View>
        {showHeaderPlus ? (
          <PressableScale
            onPress={() => router.push('/corner/deck')}
            className="h-10 w-10 items-center justify-center rounded-full bg-white border border-surfaces-divider"
            style={{ position: 'absolute', right: 20, top: -4 }}
            hitSlop={8}
          >
            <Plus size={18} color="#1F1E1D" strokeWidth={2} />
          </PressableScale>
        ) : null}
      </View>

      {isEmpty && recommended.length === 0 ? (
        <View className="items-center px-8 mt-10">
          <Text className="text-body-2 text-secondary text-center">
            This is where your goals will live once you have some.
          </Text>
        </View>
      ) : null}

      {isEmpty && idkAt ? (
        <View className="mx-5 mt-6 rounded-2xl bg-surfaces-z3 px-5 py-4">
          <Text className="text-body-3 text-secondary">
            You said you weren&apos;t sure yet — that&apos;s completely fine.
            Whenever something comes to mind, it&apos;s easy to come back here.
          </Text>
        </View>
      ) : null}

      {needsYou.length > 0 ? (
        <>
          <SectionLabel accent>Needs you</SectionLabel>
          <View className="mx-5" style={{ gap: 12 }}>
            {needsYou.map((g, i) => (
              <AnimatedGoalCard key={g.id} goal={g} index={i} />
            ))}
          </View>
        </>
      ) : null}

      {onTrack.length > 0 ? (
        <>
          <SectionLabel>On track</SectionLabel>
          <View className="mx-5" style={{ gap: 12 }}>
            {onTrack.map((g, i) => (
              <AnimatedGoalCard key={g.id} goal={g} index={i} />
            ))}
          </View>
        </>
      ) : null}

      {recommended.length > 0 ? (
        <>
          <SectionLabel>Still recommended</SectionLabel>
          <RecommendedPreviewCard count={recommended.length} />
        </>
      ) : null}

      {showInlineAdd ? (
        <View className="mt-6">
          <InlineAddGoalRow />
        </View>
      ) : null}

      {completed.length > 0 ? (
        <View className="mt-7">
          <Pressable
            onPress={() => setDoneOpen(o => !o)}
            className="mx-5 flex-row items-center py-1.5"
            style={{ gap: 8 }}
          >
            <Text className="text-geist text-tertiary" style={{ fontSize: 10, letterSpacing: 1.2 }}>
              DONE · {completed.length}
            </Text>
            <View className="flex-1 h-px bg-surfaces-divider" />
            <ChevronDown
              size={14}
              color="#999388"
              strokeWidth={2}
              style={{ transform: [{ rotate: doneOpen ? '180deg' : '0deg' }] }}
            />
          </Pressable>
          {doneOpen ? (
            <Animated.View entering={FadeInDown.duration(200)} className="mx-5 mt-2" style={{ gap: 10 }}>
              {completed.map(g => (
                <View
                  key={g.id}
                  className="rounded-2xl px-4 py-3"
                  style={{
                    backgroundColor: '#E6F6EE',
                    borderWidth: 1,
                    borderColor: 'rgba(20,179,99,0.18)',
                  }}
                >
                  <Text className="text-body-2 text-primary">{g.text}</Text>
                  <Text className="text-geist text-secondary mt-1" style={{ fontSize: 9, letterSpacing: 0.6 }}>
                    REACHED
                  </Text>
                </View>
              ))}
            </Animated.View>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  );
}
