import { GoalDeckCard, GoalDeckCardHandle } from '@/components/corner/goal-deck-card';
import { PATTERN_VISUALS } from '@/components/corner/pattern-visuals';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Cadence, TrackingPattern, classifyGoal } from '@/data/goals';
import { cadenceChipForConfirmation } from '@/data/cadence-resolution';
import { useGoalsStore } from '@/stores/goals-store';
import { Moodies, Scribbles } from '@/lib/scribbles';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Check, ChevronLeft, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Platform, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type FlowScreen = 'deck' | 'personalize' | 'cadence' | 'confirmation' | 'idk';

// Starter goals shown when the system deck runs dry — "evergreen", not pulled
// from check-ins, always available so the deck is never actually empty.
const STARTER_GOALS = [
  'do one thing that’s just for me this week',
  'get outside once a day, even for ten minutes',
  'say hi to someone I usually don’t',
];

const CADENCE_OPTIONS: { key: Cadence; title: string; subtitle: string }[] = [
  { key: 'daily', title: 'Every day', subtitle: 'quick tap, most days — blink and it’s done' },
  { key: 'weekly', title: 'Once a week', subtitle: 'a proper look, whenever suits you' },
  { key: 'whenever', title: 'Whenever I feel like it', subtitle: 'no schedule — we won’t chase you' },
];

function haptic() {
  if (Platform.OS !== 'web') Haptics.selectionAsync();
}

function ScreenHeader({
  onBack,
  label,
  closeInstead,
}: {
  onBack: () => void;
  label?: string;
  closeInstead?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-safe-or-4">
      <PressableScale
        onPress={onBack}
        className="h-11 w-11 items-center justify-center rounded-full"
        hitSlop={8}
      >
        {closeInstead ? (
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        ) : (
          <ChevronLeft size={22} color="#1F1E1D" strokeWidth={1.8} />
        )}
      </PressableScale>
      {label ? (
        <Text className="text-geist text-tertiary" style={{ fontSize: 11, letterSpacing: 1.4 }}>
          {label}
        </Text>
      ) : (
        <View />
      )}
      <View className="h-11 w-11" />
    </View>
  );
}

export default function Deck() {
  const router = useRouter();
  const commitGoal = useGoalsStore(s => s.commitGoal);
  const markIdk = useGoalsStore(s => s.markIdk);

  // Freeze the recommended candidates on mount so the deck doesn't reshuffle
  // mid-pass while the teen is deciding.
  const [candidates] = useState(() =>
    useGoalsStore.getState().goals.filter(g => g.status === 'recommended').map(g => ({ id: g.id, text: g.text })),
  );

  const [screen, setScreen] = useState<FlowScreen>('deck');
  const [deckIndex, setDeckIndex] = useState(0);
  const [evergreen, setEvergreen] = useState(false);
  const [justSwitchedToEvergreen, setJustSwitchedToEvergreen] = useState(false);

  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [origText, setOrigText] = useState('');
  const [goalText, setGoalText] = useState('');
  const [cadence, setCadence] = useState<Cadence>('weekly');
  // Classified the moment a goal is claimed (still a backend stub — just
  // called a beat earlier) so its icon/accent stay the same goal's identity
  // all the way through Personalize → Confirmation → the list.
  const [assignedPattern, setAssignedPattern] = useState<TrackingPattern | null>(null);

  const cardRef = useRef<GoalDeckCardHandle>(null);

  const deck = evergreen ? STARTER_GOALS.map(t => ({ id: null as string | null, text: t })) : candidates;
  const current = deck[deckIndex];

  const advanceOrEvergreen = () => {
    const next = deckIndex + 1;
    if (next >= deck.length) {
      if (!evergreen) {
        setEvergreen(true);
        setDeckIndex(0);
        setJustSwitchedToEvergreen(true);
      } else {
        setScreen('idk');
      }
    } else {
      setDeckIndex(next);
    }
  };

  const handleClaim = () => {
    if (!current) return;
    haptic();
    setCandidateId(current.id);
    setOrigText(current.text);
    setGoalText(current.text);
    setAssignedPattern(classifyGoal());
    setScreen('personalize');
  };

  const handleSkip = () => {
    advanceOrEvergreen();
  };

  const writeOwn = () => {
    setCandidateId(null);
    setOrigText('');
    setGoalText('');
    setAssignedPattern(classifyGoal());
    setScreen('personalize');
  };

  const personalizeNext = () => {
    if (!goalText.trim()) return;
    setScreen('cadence');
  };

  const lockIn = () => {
    const personalized = candidateId ? goalText.trim() !== origText.trim() : true;
    commitGoal({
      id: candidateId ?? undefined,
      text: goalText,
      personalized,
      cadence,
      trackingPattern: assignedPattern ?? undefined,
    });
    setScreen('confirmation');
  };

  const seeCorner = () => router.back();

  // The deck screen's card uses a GestureDetector (react-native-gesture-handler)
  // for its drag-to-claim/skip interaction. Conditionally unmounting that
  // screen (the usual if/return-per-screen pattern) left RNGH's native
  // recognizer for that gesture never cleanly detaching, which then silently
  // swallowed touches on every plain Pressable in whichever screen mounted
  // next — reproducibly, for the rest of the session. Keeping the deck
  // screen always mounted (just hidden) and layering every other screen on
  // top as an absolute overlay avoids ever unmounting that GestureDetector.
  return (
    <View className="flex-1 bg-white">
      <View style={{ flex: 1, display: screen === 'deck' ? 'flex' : 'none' }}>
        <ScreenHeader onBack={() => router.back()} closeInstead />
        <View className="items-center px-6 pt-1">
          <Text className="text-header-3 text-primary">
            {evergreen ? 'Start a goal' : 'Goal ideas'}
          </Text>
          <Text className="text-geist text-tertiary mt-1" style={{ fontSize: 11, letterSpacing: 1.2 }}>
            {evergreen
              ? `STARTERS · THEY KEEP · ${Math.min(deckIndex + 1, deck.length)} OF ${deck.length}`
              : `PICKED FOR YOU · ${Math.min(deckIndex + 1, deck.length)} OF ${deck.length}`}
          </Text>
          {evergreen && justSwitchedToEvergreen ? (
            <Animated.Text
              entering={FadeInDown.duration(240)}
              className="text-body-3 text-secondary text-center mt-2"
              style={{ maxWidth: 280 }}
            >
              No new ideas from your check-ins yet — that&apos;s normal. Write yours, or borrow a
              starter.
            </Animated.Text>
          ) : null}
        </View>

        <View className="flex-1 items-center justify-center px-8">
          {current ? (
            <GoalDeckCard
              key={`${evergreen ? 'ever' : 'sys'}-${deckIndex}`}
              ref={cardRef}
              text={current.text}
              label={evergreen ? 'STARTER · NOT FROM YOUR CHECK-INS' : 'FROM YOUR CHECK-INS'}
              onClaim={handleClaim}
              onSkip={handleSkip}
            />
          ) : (
            <Text className="text-body-2 text-secondary text-center">
              You&apos;ve been through all the suggestions.
            </Text>
          )}
        </View>

        {current ? (
          <View className="flex-row items-center justify-center gap-8 pb-4">
            <View className="items-center" style={{ gap: 6 }}>
              <PressableScale
                onPress={() => cardRef.current?.flyOut(-1)}
                className="items-center justify-center rounded-full bg-white"
                style={{ height: 52, width: 52, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 }}
              >
                <X size={20} color="#1F1E1D" strokeWidth={2} />
              </PressableScale>
              <Text className="text-geist text-tertiary" style={{ fontSize: 9, letterSpacing: 1 }}>
                NOT NOW
              </Text>
            </View>
            <Text className="text-geist text-tertiary" style={{ fontSize: 10 }}>
              ← DRAG →
            </Text>
            <View className="items-center" style={{ gap: 6 }}>
              <PressableScale
                onPress={() => cardRef.current?.flyOut(1)}
                className="items-center justify-center rounded-full bg-brand-trueBlack"
                style={{ height: 52, width: 52 }}
              >
                <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
              </PressableScale>
              <Text className="text-geist text-secondary" style={{ fontSize: 9, letterSpacing: 1 }}>
                CLAIM IT
              </Text>
            </View>
          </View>
        ) : null}

        <View className="px-6 pb-safe-or-6" style={{ gap: 10 }}>
          <PressableScale
            onPress={writeOwn}
            className={`h-14 items-center justify-center rounded-full flex-row gap-2 ${evergreen ? 'bg-brand-trueBlack' : 'bg-white border border-surfaces-divider'}`}
          >
            <Text className={`text-body-2 ${evergreen ? 'text-white' : 'text-primary'}`}>
              {evergreen ? 'Write your own' : 'Or write your own'}
            </Text>
          </PressableScale>
          <PressableScale onPress={() => setScreen('idk')} className="items-center py-1">
            <Text className="text-body-3 text-secondary underline">I don&apos;t know yet</Text>
          </PressableScale>
        </View>
      </View>

      {screen === 'idk' ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} className="bg-white">
          <ScreenHeader onBack={() => setScreen('deck')} closeInstead />
          <View className="flex-1 items-center justify-center px-8">
            <Image
              source={Moodies.confused}
              style={{ width: 130, height: 130 }}
              contentFit="contain"
            />
            <Text className="text-header-4 text-primary text-center mt-5" style={{ maxWidth: 280 }}>
              &ldquo;I don&apos;t know yet&rdquo; is a real answer.
            </Text>
            <Text className="text-body-2 text-secondary text-center mt-3" style={{ maxWidth: 290 }}>
              Your ideas will wait in your corner. Nothing expires, nobody&apos;s told, and no
              streak starts without you.
            </Text>
            <View className="flex-row items-center mt-5 rounded-full bg-surfaces-z3 px-4 py-2">
              <Image source={Scribbles.limeSwoosh} style={{ width: 20, height: 20 }} contentFit="contain" />
              <Text className="text-geist text-secondary ml-2" style={{ fontSize: 10, letterSpacing: 1.2 }}>
                SAVED · {candidates.length} IDEAS IN YOUR CORNER
              </Text>
            </View>
          </View>
          <View className="px-6 pb-safe-or-6">
            <PressableScale
              onPress={() => {
                markIdk();
                router.back();
              }}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack"
            >
              <Text className="text-body-2 text-white">Back to chat</Text>
            </PressableScale>
            <PressableScale onPress={() => setScreen('deck')} className="items-center py-3">
              <Text className="text-body-3 text-secondary underline">peek at the ideas again</Text>
            </PressableScale>
          </View>
        </View>
      ) : null}

      {screen === 'personalize' ? (
        (() => {
          // Classified at claim time (see handleClaim/writeOwn) — falls back
          // to moodCheck's visuals only in the defensive case this screen is
          // somehow reached without one, which shouldn't happen in practice.
          const visuals = PATTERN_VISUALS[assignedPattern ?? 'moodCheck'];
          return (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} className="bg-white">
              <ScreenHeader onBack={() => setScreen('deck')} label="CLAIMED · MAKE IT YOURS" />
              <ScrollView
                className="flex-1 px-6"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }}
              >
                <View className="items-center pb-2" style={{ position: 'relative' }}>
                  <Image
                    source={visuals.scribble}
                    style={{ position: 'absolute', width: 150, height: 120, top: -16 }}
                    contentFit="contain"
                  />
                  <View
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 38,
                      backgroundColor: '#FFFFFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#000',
                      shadowOpacity: 0.08,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 3 },
                    }}
                  >
                    <Image source={visuals.icon} style={{ width: 50, height: 50 }} contentFit="contain" />
                  </View>
                </View>
                <Text className="text-header-4 text-primary text-center mt-4" style={{ lineHeight: 34 }}>
                  Say it how you&apos;d actually say it.
                </Text>
                <Text className="text-body-2 text-secondary text-center mt-3">
                  These are the words you&apos;ll see every time you check in — so make them sound
                  like you.
                </Text>
                <TextInput
                  className="text-header-4 text-primary rounded-2xl p-5 mt-5"
                  value={goalText}
                  onChangeText={setGoalText}
                  multiline
                  placeholder="Your goal, your words…"
                  placeholderTextColor="#B8B2A9"
                  style={{
                    minHeight: 140,
                    lineHeight: 30,
                    fontFamily: 'TWKLausanne-400',
                    backgroundColor: visuals.tint,
                    borderWidth: 2,
                    borderColor: visuals.accent,
                  }}
                />
                {origText ? (
                  <View className="mt-5">
                    <Text className="text-geist text-tertiary mb-2" style={{ fontSize: 10, letterSpacing: 1.4 }}>
                      STARTED FROM
                    </Text>
                    <View className="flex-row items-start justify-between gap-3 rounded-xl bg-surfaces-z3 px-4 py-3">
                      <Text className="text-body-3 text-secondary flex-1">{origText}</Text>
                      <PressableScale onPress={() => setGoalText(origText)} hitSlop={8}>
                        <Text className="text-body-3" style={{ color: visuals.accent, fontWeight: '500' }}>
                          use as is
                        </Text>
                      </PressableScale>
                    </View>
                  </View>
                ) : null}
              </ScrollView>
              <View className="px-6 pb-safe-or-6 pt-2">
                <PressableScale
                  onPress={personalizeNext}
                  disabled={!goalText.trim()}
                  className={`h-14 items-center justify-center rounded-full ${goalText.trim() ? 'bg-brand-trueBlack' : 'bg-surfaces-z5'}`}
                >
                  <Text className="text-body-2 text-white">That&apos;s the one</Text>
                </PressableScale>
                <PressableScale onPress={() => setScreen('idk')} className="items-center py-3">
                  <Text className="text-body-3 text-secondary underline">I don&apos;t know yet</Text>
                </PressableScale>
              </View>
            </View>
          );
        })()
      ) : null}

      {screen === 'cadence' ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} className="bg-white">
          <ScreenHeader onBack={() => setScreen('personalize')} label="LAST STEP" />
          <ScrollView className="flex-1 px-6 pt-2">
            <View className="flex-row items-center gap-3 rounded-2xl bg-white border border-surfaces-divider px-4 py-3">
              <Image source={Scribbles.orangeStarburst} style={{ width: 26, height: 26 }} contentFit="contain" />
              <Text className="text-body-2 text-primary flex-1">{goalText}</Text>
            </View>
            <Text className="text-header-4 text-primary mt-6" style={{ lineHeight: 34 }}>
              How often should we poke at this?
            </Text>
            <Text className="text-body-2 text-secondary mt-2">Your goal, your pace. Pick one.</Text>
            <View className="mt-5" style={{ gap: 10 }}>
              {CADENCE_OPTIONS.map(opt => {
                const selected = cadence === opt.key;
                return (
                  <PressableScale
                    key={opt.key}
                    onPress={() => {
                      haptic();
                      setCadence(opt.key);
                    }}
                    className="rounded-2xl bg-white px-5 py-4 flex-row items-center justify-between"
                    style={{
                      borderWidth: selected ? 2 : 1,
                      borderColor: selected ? '#4D55FD' : '#DFDAD3',
                    }}
                  >
                    <View className="flex-1 pr-3">
                      <Text className="text-body-1 text-primary">{opt.title}</Text>
                      <Text className="text-body-3 text-secondary mt-0.5">{opt.subtitle}</Text>
                    </View>
                    {selected ? <Check size={20} color="#4D55FD" strokeWidth={2.5} /> : null}
                  </PressableScale>
                );
              })}
            </View>
            <Text className="text-caption-1 text-tertiary mt-4">
              Not a contract — change it any time.
            </Text>
          </ScrollView>
          <View className="px-6 pb-safe-or-6 pt-2">
            <PressableScale
              onPress={lockIn}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack"
            >
              <Text className="text-body-2 text-white">Lock it in</Text>
            </PressableScale>
          </View>
        </View>
      ) : null}

      {screen === 'confirmation' ? (
        (() => {
          const visuals = PATTERN_VISUALS[assignedPattern ?? 'moodCheck'];
          return (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} className="bg-white">
              <View className="flex-1 items-center justify-center px-8">
                <Animated.View entering={FadeIn.duration(300)} className="items-center">
                  <View style={{ width: 190, height: 190, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      source={visuals.scribble}
                      style={{ position: 'absolute', width: 190, height: 190 }}
                      contentFit="contain"
                    />
                    <Image source={visuals.icon} style={{ width: 96, height: 96 }} contentFit="contain" />
                  </View>
                  <Text className="text-geist text-tertiary mt-2" style={{ fontSize: 11, letterSpacing: 1.4 }}>
                    GOAL · YOURS · SET TODAY
                  </Text>
                  <Text className="text-header-4 text-primary text-center mt-3" style={{ maxWidth: 300 }}>
                    &ldquo;{goalText}&rdquo;
                  </Text>
                  <View className="flex-row items-center mt-4 rounded-full bg-surfaces-z3 px-4 py-2">
                    <Text className="text-geist text-secondary" style={{ fontSize: 10, letterSpacing: 1.2 }}>
                      {cadenceChipForConfirmation(cadence)}
                    </Text>
                  </View>
                  <Text className="text-body-2 text-secondary text-center mt-4" style={{ maxWidth: 280 }}>
                    It&apos;s set. It lives in your corner now — check in when you said you would, or
                    don&apos;t. Both count as honest.
                  </Text>
                </Animated.View>
              </View>
              <View className="px-6 pb-safe-or-6">
                <PressableScale
                  onPress={seeCorner}
                  className="h-14 items-center justify-center rounded-full bg-brand-trueBlack"
                >
                  <Text className="text-body-2 text-white">See it in your corner</Text>
                </PressableScale>
              </View>
            </View>
          );
        })()
      ) : null}
    </View>
  );
}
