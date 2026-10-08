import { WordBurst } from '@/components/proto/bursts';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { ToolGlyph } from '@/components/proto/tool-glyphs';
import { PressableScale } from '@/components/ui/pressable-scale';
import {
  ALL_LABEL,
  ALL_THEMES,
  CONFESSIONS,
  THEMES,
  themeLabel,
  type Confession,
} from '@/data/confessions';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { Moodies, Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelfcareStore } from '@/stores/selfcare-store';
import { useHorizontalDragScroll } from '@/web/use-drag-scroll';

const BG = '#211D2B';
const BREATHER_EVERY = 9;

/** Paint color per theme — label, progress and me-too glow pick it up */
const THEME_COLORS: Record<string, string> = {
  lonely: '#B164FF',
  school: '#71E0FF',
  family: '#FF9812',
  friends: '#C2DF4F',
  heartbreak: '#E85C82',
  pretending: '#FFD84D',
  future: '#8FD4FF',
};
const themeColor = (t: string) => THEME_COLORS[t] ?? '#B164FF';

type FeedItem =
  | { kind: 'confession'; confession: Confession }
  | { kind: 'breather' };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * "Show me I'm not alone" — a read-only feed of real anonymized confessions
 * from other teens. Deliberately quiet: no likes, no comments, no counters.
 * One card at a time; tap anywhere (or Next) to advance.
 */
export default function NotAlone() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const introSeen = useSelfcareStore(s => s.notAloneIntroSeen);
  const setIntroSeen = useSelfcareStore(s => s.setNotAloneIntroSeen);

  const [stage, setStage] = useState<'intro' | 'feed'>(introSeen ? 'feed' : 'intro');
  const [theme, setTheme] = useState<string>(ALL_THEMES);
  const [index, setIndex] = useState(0);
  const [feltIds, setFeltIds] = useState<Set<number | string>>(new Set());
  const [burstKey, setBurstKey] = useState(0);
  const viewedRef = useRef(0);
  const chipsRef = useRef<ScrollView>(null);
  // Desktop reviewers can't pan the chip row with a mouse — 0 = free scroll
  useHorizontalDragScroll(chipsRef, () => 0);

  const deck = useMemo<FeedItem[]>(() => {
    const pool =
      theme === ALL_THEMES ? CONFESSIONS : CONFESSIONS.filter(c => c.theme === theme);
    const items: FeedItem[] = [];
    shuffle(pool).forEach((confession, i) => {
      if (i > 0 && i % BREATHER_EVERY === 0) items.push({ kind: 'breather' });
      items.push({ kind: 'confession', confession });
    });
    return items;
  }, [theme]);

  const item = deck[index];

  useEffect(() => {
    if (stage === 'feed' && item?.kind === 'confession') {
      viewedRef.current += 1;
      track('confession_viewed', { theme: item.confession.theme, index });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, item]);

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming((index + 1) / deck.length, {
      duration: 360,
      easing: EASE_STANDARD,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, deck.length]);

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  const finish = () => {
    track('offline_tool_completed', {
      tool: 'not_alone',
      cards_viewed: viewedRef.current,
    });
    router.replace('/selfcare/done?tool=not_alone');
  };

  const advance = () => {
    if (index + 1 < deck.length) setIndex(index + 1);
    else finish();
  };

  // Anonymous resonance — no counters, no names, nothing leaves the device
  // in the prototype. Tapping again just sends more warmth.
  const meToo = (c: Confession) => {
    buzz.light();
    const id = c.id ?? c.text;
    track('confession_me_too', { theme: c.theme, id: c.id ?? null });
    setFeltIds(prev => new Set(prev).add(id));
    setBurstKey(k => k + 1);
  };

  const pickTheme = (t: string) => {
    if (t === theme) return;
    track('confession_theme_selected', { theme: t });
    setTheme(t);
    setIndex(0);
  };

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: BG, paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <StatusBar style="light" />
      <Image
        source={Scribbles.pinkLoops}
        style={{
          position: 'absolute',
          right: -70,
          top: 90,
          width: 260,
          height: 260,
          opacity: 0.1,
          transform: [{ rotate: '-14deg' }],
        }}
        contentFit="contain"
        tintColor="#B164FF"
      />

      <View
        className="flex-row items-center justify-end px-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={close}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#FFFFFF" strokeWidth={1.8} />
        </Pressable>
      </View>

      {stage === 'intro' ? (
        <View className="flex-1 px-6">
          <View className="flex-1 items-center justify-center">
            <Animated.View entering={FadeInDown.duration(420).easing(EASE_STANDARD)}>
              <Image
                source={Moodies.tired}
                style={{ width: 92, height: 92, transform: [{ rotate: '-6deg' }] }}
                contentFit="contain"
              />
            </Animated.View>
            <Animated.Text
              entering={FadeInDown.delay(120).duration(420).easing(EASE_STANDARD)}
              className="font-avantt-bold text-white text-center mt-5"
              style={{ fontSize: 32, lineHeight: 37 }}
            >
              You&apos;re not the only one up right now.
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(240).duration(420).easing(EASE_STANDARD)}
              className="text-center mt-3"
              style={{
                fontFamily: 'TWKLausanne-400',
                fontSize: 16,
                lineHeight: 23,
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              These are real, anonymous words from other teens.
            </Animated.Text>
          </View>
          <Animated.View
            entering={FadeInDown.delay(380).duration(400).easing(EASE_STANDARD)}
            style={{ gap: 12 }}
          >
            <PressableScale
              scaleTo={0.97}
              onPress={() => {
                setIntroSeen(true);
                setStage('feed');
              }}
              className="h-14 items-center justify-center rounded-full bg-white"
            >
              <Text className="text-body-2 text-primary font-avantt-bold" style={{ fontSize: 17 }}>
                Show me
              </Text>
            </PressableScale>
            <TalkNowLink screen="notalone_intro" light />
          </Animated.View>
        </View>
      ) : (
        <View className="flex-1">
          {/* Theme chips — optional filter, one tap, "everything" default */}
          <Animated.View entering={FadeIn.duration(300)}>
            <ScrollView
              ref={chipsRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            >
              {[ALL_THEMES, ...THEMES].map(t => {
                const selected = t === theme;
                return (
                  <Pressable
                    key={t}
                    onPress={() => pickTheme(t)}
                    className="items-center justify-center rounded-full px-4 active:opacity-70"
                    style={{
                      height: 38,
                      backgroundColor: selected ? '#FFFFFF' : 'rgba(255,255,255,0.1)',
                      borderWidth: 1,
                      borderColor: selected ? '#FFFFFF' : 'rgba(255,255,255,0.22)',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'TWKLausanne-400',
                        fontSize: 14,
                        color: selected ? '#1F1E1D' : 'rgba(255,255,255,0.85)',
                      }}
                    >
                      {t === ALL_THEMES ? ALL_LABEL : themeLabel(t)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* Hairline progress — a sense of place, no numbers */}
          <View
            className="mx-5 mt-4 overflow-hidden rounded-full"
            style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.14)' }}
          >
            <Animated.View
              style={[
                {
                  height: '100%',
                  width: '100%',
                  borderRadius: 2,
                  backgroundColor:
                    item?.kind === 'confession' ? themeColor(item.confession.theme) : '#B164FF',
                  transformOrigin: 'left',
                },
                progressStyle,
              ]}
            />
          </View>

          {/* The card — tap anywhere to move on */}
          <Pressable className="flex-1 justify-center px-6" onPress={advance}>
            {item?.kind === 'breather' ? (
              <Animated.View
                key={`${theme}-${index}`}
                entering={FadeInDown.duration(400).easing(EASE_STANDARD)}
                className="items-center"
              >
                <ToolGlyph id="not_alone" size={52} color="#B164FF" rotate={-8} />
                <Text
                  className="font-avantt-bold text-white text-center mt-5"
                  style={{ fontSize: 26, lineHeight: 32 }}
                >
                  Thousands of teens sent these in.
                </Text>
                <Text
                  className="text-center mt-3"
                  style={{
                    fontFamily: 'TWKLausanne-400',
                    fontSize: 16,
                    lineHeight: 23,
                    color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  Whatever you&apos;re feeling — someone else has felt it too.
                </Text>
              </Animated.View>
            ) : item ? (
              <Animated.View
                key={`${theme}-${index}`}
                entering={FadeInDown.duration(400).easing(EASE_STANDARD)}
                style={{ transform: [{ rotate: `${((index * 37) % 5) - 2}deg` }] }}
              >
                <Text
                  style={{
                    fontFamily: 'GeistMono-Medium',
                    fontSize: 12,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: themeColor(item.confession.theme),
                  }}
                >
                  {themeLabel(item.confession.theme)}
                </Text>
                <Text
                  className="text-white mt-4"
                  style={{
                    fontFamily: 'TWKLausanne-400',
                    fontSize: item.confession.text.length > 170 ? 19 : 23,
                    lineHeight: item.confession.text.length > 170 ? 29 : 34,
                  }}
                >
                  &ldquo;{item.confession.text}&rdquo;
                </Text>
                <Text
                  className="mt-5"
                  style={{
                    fontFamily: 'TWKLausanne-400',
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  — anonymous
                </Text>
              </Animated.View>
            ) : null}
          </Pressable>

          {/* Anonymous "me too" — its own row so it never advances the card */}
          {item?.kind === 'confession' && (
            <View className="items-center" style={{ marginBottom: 14 }}>
              <View className="items-center">
                {burstKey > 0 && item.kind === 'confession' && (
                  <View style={{ position: 'absolute', top: -6, left: '50%' }}>
                    <WordBurst
                      key={burstKey}
                      words={['same', 'fr', 'this', 'felt', 'me too']}
                      color={themeColor(item.confession.theme)}
                      count={5}
                      rise={160}
                    />
                  </View>
                )}
                <Pressable
                  onPress={() => item.kind === 'confession' && meToo(item.confession)}
                  className="flex-row items-center rounded-full px-5 active:opacity-80"
                  style={{
                    minHeight: 44,
                    gap: 8,
                    borderWidth: 1,
                    borderColor: feltIds.has(item.confession.id ?? item.confession.text)
                      ? themeColor(item.confession.theme)
                      : 'rgba(255,255,255,0.3)',
                    backgroundColor: feltIds.has(item.confession.id ?? item.confession.text)
                      ? 'rgba(255,255,255,0.08)'
                      : 'transparent',
                  }}
                >
                  <ToolGlyph
                    id="not_alone"
                    size={20}
                    color={
                      item.kind === 'confession'
                        ? themeColor(item.confession.theme)
                        : '#B164FF'
                    }
                    rotate={-6}
                  />
                  <Text
                    style={{
                      fontFamily: 'TWKLausanne-400',
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    {feltIds.has(item.confession.id ?? item.confession.text)
                      ? 'felt — you\u2019re not the only one'
                      : 'me too'}
                  </Text>
                </Pressable>
              </View>
              <Text
                style={{
                  fontFamily: 'TWKLausanne-400',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: 6,
                }}
              >
                anonymous, always
              </Text>
            </View>
          )}

          <View className="px-6" style={{ gap: 12 }}>
            <PressableScale
              scaleTo={0.97}
              onPress={() => {
                buzz.tick();
                advance();
              }}
              className="h-14 items-center justify-center rounded-full bg-white"
            >
              <Text className="text-body-2 text-primary font-avantt-bold" style={{ fontSize: 17 }}>
                Next
              </Text>
            </PressableScale>
            <Pressable
              onPress={finish}
              className="items-center justify-center active:opacity-60"
              style={{ minHeight: 44 }}
            >
              <Text
                style={{
                  fontFamily: 'TWKLausanne-400',
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                I&apos;m done for now
              </Text>
            </Pressable>
            <TalkNowLink screen="notalone_feed" light />
          </View>
        </View>
      )}
    </View>
  );
}
