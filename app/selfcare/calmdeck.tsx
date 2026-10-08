import { ConfettiBurst } from '@/components/proto/bursts';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { ToolGlyph } from '@/components/proto/tool-glyphs';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Calm cards — a deck of one-line ways to come down. Swipe a card away
 * (or tap it) to pull the next. No streaks, no order, leave whenever.
 */

const TIPS = [
  'Unclench your jaw. Drop your shoulders. Again — they crept back up.',
  'Breathe out longer than you breathe in. The out-breath is the brake pedal.',
  'Put both feet flat on the floor and press down for ten slow seconds.',
  'Drink something cold, slowly. Follow it the whole way down.',
  'Splash cold water on your face. It genuinely slows your heart rate.',
  'Tense every muscle you have for five seconds. Let it all go at once.',
  'Hum one line of any song. The vibration settles your nervous system.',
  'Look out the farthest window you can find and let your eyes focus far away.',
  'Name three things in the room that weren’t there a year ago.',
  'Say what you’re feeling out loud, just to the room. Naming it shrinks it.',
  'Put a hand on your chest. That heartbeat has carried you through every bad night so far.',
  'Text someone one honest sentence. No context needed.',
  'Wiggle your toes and count them. You can’t spiral and count toes at the same time.',
  'This feeling is a wave. You have never had one that didn’t pass.',
] as const;

// Card looks cycle through the brand paper tints
const LOOKS = [
  { bg: '#FFF9E3', tint: '#D9A514', scribble: Scribbles.yellowSpiral },
  { bg: '#EAF9FF', tint: '#71E0FF', scribble: Scribbles.blueSwoosh },
  { bg: '#FFF0F4', tint: '#E85C82', scribble: Scribbles.pinkLoops },
  { bg: '#F4FBE8', tint: '#5FA74B', scribble: Scribbles.greenSwoosh },
  { bg: '#F4F1FF', tint: '#B164FF', scribble: Scribbles.purpleSwoosh },
] as const;

function CardFace({ tip, look, w, h }: { tip: string; look: (typeof LOOKS)[number]; w: number; h: number }) {
  return (
    <View
      className="rounded-3xl overflow-hidden justify-between px-6 py-6"
      style={{ width: w, height: h, backgroundColor: look.bg }}
    >
      <Image
        source={look.scribble}
        style={{
          position: 'absolute',
          right: -40,
          bottom: -36,
          width: 150,
          height: 150,
          opacity: 0.3,
          transform: [{ rotate: '-10deg' }],
        }}
        contentFit="contain"
        tintColor={look.tint}
      />
      <Text
        className="text-tertiary"
        style={{ fontFamily: 'GeistMono-Medium', fontSize: 10, letterSpacing: 1.5 }}
      >
        CALM CARD
      </Text>
      <Text className="font-avantt-bold text-primary" style={{ fontSize: 23, lineHeight: 29 }}>
        {tip}
      </Text>
      <Text className="text-secondary" style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 18 }}>
        swipe when you&apos;ve tried it
      </Text>
    </View>
  );
}

/** The interactive top card: drag to throw, small tap also advances. */
function TopCard({
  tip,
  look,
  w,
  h,
  onGone,
}: {
  tip: string;
  look: (typeof LOOKS)[number];
  w: number;
  h: number;
  onGone: () => void;
}) {
  const tx = useSharedValue(0);
  const gone = useRef(false);

  const throwAway = (dir: number) => {
    if (gone.current) return;
    gone.current = true;
    buzz.medium();
    // The fly-off is decoration; state advances on a plain timeout so a
    // dropped animation frame can never strand the deck.
    tx.value = withTiming(dir * (w + 140), { duration: 300, easing: Easing.in(Easing.quad) });
    setTimeout(onGone, 310);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_e, g) => {
        tx.value = g.dx;
      },
      onPanResponderRelease: (_e, g) => {
        if (Math.abs(g.dx) > 90 || Math.abs(g.vx) > 0.6) {
          throwAway(g.dx >= 0 ? 1 : -1);
        } else if (Math.abs(g.dx) < 8 && Math.abs(g.dy) < 8) {
          // a tap — throw it the lazy way
          throwAway(1);
        } else {
          tx.value = withSpring(0, { damping: 16 });
        }
      },
      onPanResponderTerminate: () => {
        tx.value = withSpring(0, { damping: 16 });
      },
    }),
  ).current;

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { rotate: `${tx.value / 16}deg` }],
  }));

  return (
    <Animated.View
      {...pan.panHandlers}
      entering={FadeInDown.duration(300).easing(EASE_STANDARD)}
      style={[{ position: 'absolute' }, style]}
    >
      <CardFace tip={tip} look={look} w={w} h={h} />
    </Animated.View>
  );
}

export default function CalmDeck() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [finale, setFinale] = useState(false);
  const startedAt = useRef(Date.now());

  // A fresh shuffle each visit — no fixed order to memorize
  const deck = useMemo(() => [...TIPS].sort(() => Math.random() - 0.5), []);

  const cardW = Math.min(width - 56, 360);
  // cap by height so short windows keep the buttons on screen
  const cardH = Math.min(cardW * 0.96, height * 0.44);

  const finish = (seen: number) => {
    track('offline_tool_completed', {
      tool: 'calm_deck',
      tips_seen: seen,
      duration_s: Math.round((Date.now() - startedAt.current) / 1000),
    });
    router.replace('/selfcare/done?tool=calm_deck');
  };

  const next = () => {
    if (index + 1 >= deck.length) {
      buzz.success();
      setFinale(true);
      return;
    }
    setIndex(index + 1);
  };

  return (
    <View className="flex-1 bg-white px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      <Animated.View entering={FadeInDown.duration(380).easing(EASE_STANDARD)} style={{ paddingTop: insets.top + 20 }}>
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <ToolGlyph id="calm_deck" size={26} color="#B8860B" />
          <Text className="font-avantt-bold text-primary" style={{ fontSize: 28, lineHeight: 32 }}>
            Calm cards.
          </Text>
        </View>
        <Text className="text-body-3 text-secondary mt-1.5">
          One small thing at a time. Try it, then pull the next.
        </Text>
      </Animated.View>

      {/* hairline progress — a sense of place, no score */}
      <View className="mt-4 overflow-hidden rounded-full" style={{ height: 3, backgroundColor: '#EFEBE4' }}>
        <View
          style={{
            height: '100%',
            width: `${finale ? 100 : ((index + 1) / deck.length) * 100}%`,
            borderRadius: 2,
            backgroundColor: '#D9A514',
          }}
        />
      </View>

      {finale ? (
        <>
          <View className="flex-1 items-center justify-center">
            <View pointerEvents="none" style={{ position: 'absolute' }}>
              <ConfettiBurst count={18} spread={200} duration={1000} />
            </View>
            {/* the whole deck, stacked back into a fan */}
            <View style={{ width: 220, height: 130 }}>
              {LOOKS.map((look, i) => {
                const rot = -26 + i * 13;
                return (
                  <Animated.View
                    key={look.bg}
                    entering={ZoomIn.delay(120 + i * 110).springify().damping(12)}
                    style={{
                      position: 'absolute',
                      left: 78,
                      top: 20,
                      transform: [
                        { rotate: `${rot}deg` },
                        { translateY: Math.abs(rot) * 0.7 },
                      ],
                    }}
                  >
                    <View
                      className="rounded-xl overflow-hidden"
                      style={{
                        width: 64,
                        height: 88,
                        backgroundColor: look.bg,
                        borderWidth: 1,
                        borderColor: 'rgba(31,30,29,0.08)',
                      }}
                    >
                      <Image
                        source={look.scribble}
                        style={{ position: 'absolute', right: -16, bottom: -14, width: 60, height: 60, opacity: 0.35 }}
                        contentFit="contain"
                        tintColor={look.tint}
                      />
                    </View>
                  </Animated.View>
                );
              })}
            </View>
            <Animated.Text
              entering={FadeInDown.delay(650).duration(400).easing(EASE_STANDARD)}
              className="font-avantt-bold text-primary text-center mt-8"
              style={{ fontSize: 27, lineHeight: 32 }}
            >
              That&apos;s the whole deck.
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(800).duration(400).easing(EASE_STANDARD)}
              className="text-secondary text-center mt-2"
              style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 21 }}
            >
              fourteen ways down, whenever you need one.
            </Animated.Text>
          </View>
          <Animated.View entering={FadeInDown.delay(950).duration(360).easing(EASE_STANDARD)} style={{ gap: 12 }}>
            <Pressable
              onPress={() => finish(deck.length)}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
            >
              <Text className="text-body-2 text-white">I&apos;m done</Text>
            </Pressable>
            <TalkNowLink screen="selfcare_calmdeck" />
          </Animated.View>
        </>
      ) : (
      <>
      <View className="flex-1 items-center justify-center">
        <View style={{ width: cardW, height: cardH }}>
          {/* the two cards waiting underneath */}
          {index + 2 < deck.length && (
            <View style={{ position: 'absolute', transform: [{ scale: 0.9 }, { translateY: 22 }, { rotate: '2deg' }], opacity: 0.55 }}>
              <CardFace tip={deck[index + 2]} look={LOOKS[(index + 2) % LOOKS.length]} w={cardW} h={cardH} />
            </View>
          )}
          {index + 1 < deck.length && (
            <View style={{ position: 'absolute', transform: [{ scale: 0.95 }, { translateY: 12 }, { rotate: '-1.5deg' }], opacity: 0.8 }}>
              <CardFace tip={deck[index + 1]} look={LOOKS[(index + 1) % LOOKS.length]} w={cardW} h={cardH} />
            </View>
          )}
          <TopCard
            key={index}
            tip={deck[index]}
            look={LOOKS[index % LOOKS.length]}
            w={cardW}
            h={cardH}
            onGone={next}
          />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Pressable onPress={() => finish(index + 1)} className="h-11 items-center justify-center active:opacity-60">
          <Text className="text-body-2 text-secondary underline">I&apos;m done</Text>
        </Pressable>
        <TalkNowLink screen="selfcare_calmdeck" />
      </View>
      </>
      )}
    </View>
  );
}
