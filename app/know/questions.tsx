import { KnowFinish } from '@/components/proto/know-finish';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { mentor } from '@/data/mock';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { Scribbles } from '@/lib/scribbles';
import { useAppStore } from '@/stores/app-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 20 questions — trade quick answers with your mentor, played as a deck of
 * flip cards: question on the front, the mentor's PRE-LEFT intro answer on
 * the back (labeled, never a simulated live reply). Typed answers can go to
 * chat at the end as one message.
 */
const QA: { q: string; a: string }[] = [
  { q: 'How do you actually get to know someone online?', a: "trading playlists, honestly. music says the stuff you won't." },
  { q: "What's one thing you'd tell a complete stranger?", a: "i talk to my dog like he's my roommate. zero shame." },
  { q: 'Cereal for dinner — defensible?', a: 'three nights straight is a lifestyle, not a mistake.' },
  { q: 'Hype song before something scary?', a: '"Lose Yourself". not original. don’t care.' },
  { q: 'Best advice you ever ignored?', a: '"sleep on it." i have never once slept on it.' },
  { q: 'What did 15-year-old you stress about?', a: 'being picked last. spoiler: nobody remembers who got picked last.' },
  { q: 'Reply instantly or three days later?', a: "instantly or never. there is no in-between and i'm sorry." },
  { q: '3am snack of choice?', a: 'cold pizza over the sink, like a raccoon.' },
];

/** The flip card: tap the question, it turns over to the mentor's answer. */
function FlipCard({
  qa,
  index,
  total,
  onReveal,
  draft,
  setDraft,
}: {
  qa: { q: string; a: string };
  index: number;
  total: number;
  onReveal: () => void;
  draft: string;
  setDraft: (t: string) => void;
}) {
  const flip = useSharedValue(0);
  const [flipped, setFlipped] = useState(false);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${flip.value * 180}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${180 + flip.value * 180}deg` }],
  }));

  const reveal = () => {
    if (flipped) return;
    buzz.medium();
    setFlipped(true);
    flip.value = withTiming(1, { duration: 480, easing: EASE_STANDARD });
    onReveal();
  };

  return (
    <View style={{ height: 400 }}>
      {/* front — the question */}
      <Animated.View
        style={[
          { position: 'absolute', inset: 0, backfaceVisibility: 'hidden' },
          frontStyle,
        ]}
        pointerEvents={flipped ? 'none' : 'auto'}
      >
        <Pressable
          onPress={reveal}
          className="flex-1 rounded-3xl px-6 py-6 overflow-hidden justify-between active:opacity-90"
          style={{ backgroundColor: '#FFF0F4' }}
        >
          <Image
            source={Scribbles.pinkLoops}
            style={{
              position: 'absolute',
              right: -44,
              bottom: -40,
              width: 170,
              height: 170,
              opacity: 0.3,
              transform: [{ rotate: '-10deg' }],
            }}
            contentFit="contain"
            tintColor="#E85C82"
          />
          <Text
            className="text-tertiary"
            style={{ fontFamily: 'GeistMono-Medium', fontSize: 10, letterSpacing: 1.5 }}
          >
            QUESTION {index + 1} OF {total}
          </Text>
          <Text className="font-avantt-bold text-primary" style={{ fontSize: 27, lineHeight: 33 }}>
            {qa.q}
          </Text>
          <Text className="text-secondary" style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 19 }}>
            tap to flip — {mentor.name} went first
          </Text>
        </Pressable>
      </Animated.View>

      {/* back — the mentor's pre-left answer + your turn */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: 24,
            borderWidth: 1,
            borderColor: '#DFDAD3',
            backgroundColor: '#FFFFFF',
            padding: 18,
          },
          backStyle,
        ]}
        pointerEvents={flipped ? 'auto' : 'none'}
      >
        <Text className="text-body-3 text-secondary" style={{ lineHeight: 19 }}>
          {qa.q}
        </Text>
        <View className="flex-row items-end mt-4" style={{ gap: 8 }}>
          <Image source={{ uri: mentor.avatar }} style={{ width: 26, height: 26, borderRadius: 13 }} />
          <View className="flex-1 rounded-[20px] bg-surfaces-z3 px-4 py-3">
            <Text className="text-body-2 text-primary" style={{ lineHeight: 21 }}>
              {qa.a}
            </Text>
          </View>
        </View>
        <Text
          className="text-tertiary mt-1.5"
          style={{ fontFamily: 'GeistMono-Medium', fontSize: 9.5, letterSpacing: 1, marginLeft: 34 }}
        >
          ANSWERED WITH {mentor.name.toUpperCase()}&apos;S INTRO · NOT LIVE
        </Text>
        <Text
          className="text-secondary mt-5 mb-2"
          style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 19 }}
        >
          your turn (optional)
        </Text>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="type it or skip it…"
          placeholderTextColor="#767676"
          multiline
          className="flex-1 rounded-2xl border border-[#EFEBE4] bg-[#FDFCF9] px-4 py-3 text-primary"
          style={{
            textAlignVertical: 'top',
            fontFamily: 'TWKLausanne-400',
            fontSize: 16,
            lineHeight: 22,
          }}
        />
      </Animated.View>
    </View>
  );
}

export default function Questions() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sendMessage = useAppStore(s => s.sendMessage);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [draft, setDraft] = useState('');
  const [answers, setAnswers] = useState<{ q: string; a: string }[]>([]);
  const [choosing, setChoosing] = useState(false);
  const [finish, setFinish] = useState<null | 'sent' | 'kept'>(null);
  const startedAt = useRef(Date.now());

  const qa = QA[index];

  const advance = () => {
    buzz.tick();
    const next = draft.trim() ? [...answers, { q: qa.q, a: draft.trim() }] : answers;
    setAnswers(next);
    setDraft('');
    setRevealed(false);
    if (index + 1 < QA.length) {
      setIndex(index + 1);
      return;
    }
    buzz.success();
    track('know_tool_completed', {
      tool: 'questions',
      questions_seen: QA.length,
      answers_written: next.length,
      duration_s: Math.round((Date.now() - startedAt.current) / 1000),
    });
    if (next.length > 0) setChoosing(true);
    else setFinish('kept');
  };

  const sendAnswers = () => {
    buzz.medium();
    track('know_answers_sent', { count: answers.length });
    sendMessage(
      `20 questions, my turn:\n` +
        answers.map(a => `${a.q}\n→ ${a.a}`).join('\n\n'),
    );
    setChoosing(false);
    setFinish('sent');
  };

  if (finish === 'sent') {
    return <KnowFinish title="Sent." sub={`waiting in your chat for ${mentor.name}`} />;
  }
  if (finish === 'kept') {
    return <KnowFinish title="That was the round." sub={`now you know ${mentor.name} a little better`} />;
  }

  if (choosing) {
    return (
      <View className="flex-1 bg-white px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <View className="flex-1 justify-center" style={{ gap: 14 }}>
          <Animated.Text
            entering={FadeInDown.duration(360).easing(EASE_STANDARD)}
            className="font-avantt-bold text-primary"
            style={{ fontSize: 28, lineHeight: 32 }}
          >
            You wrote {answers.length} answer{answers.length === 1 ? '' : 's'}.
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(120).springify().damping(18)}>
            <Pressable
              onPress={sendAnswers}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
            >
              <Text className="text-body-2 text-white">Send them to {mentor.name}</Text>
            </Pressable>
          </Animated.View>
          <Pressable
            onPress={() => setFinish('kept')}
            className="h-12 items-center justify-center active:opacity-60"
          >
            <Text className="text-body-2 text-secondary underline">Keep them to myself</Text>
          </Pressable>
        </View>
        <TalkNowLink screen="know_questions" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      <View className="flex-row items-center justify-between" style={{ paddingTop: insets.top + 8 }}>
        {/* pips — where you are in the deck */}
        <View className="flex-row items-center" style={{ gap: 5 }}>
          {QA.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i < index ? '#E85C82' : i === index ? '#1F1E1D' : 'rgba(31,30,29,0.15)',
              }}
            />
          ))}
        </View>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <View className="flex-1 justify-center">
        <Animated.View key={`card-${index}`} entering={FadeInRight.duration(300).easing(EASE_STANDARD)}>
          <FlipCard
            qa={qa}
            index={index}
            total={QA.length}
            onReveal={() => setRevealed(true)}
            draft={draft}
            setDraft={setDraft}
          />
        </Animated.View>
      </View>

      <View style={{ gap: 12 }}>
        {revealed && (
          <Animated.View entering={FadeInDown.duration(280).easing(EASE_STANDARD)}>
            <Pressable
              onPress={advance}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
            >
              <Text className="text-body-2 text-white">
                {index + 1 < QA.length ? 'Next question' : 'Finish the round'}
              </Text>
            </Pressable>
          </Animated.View>
        )}
        <TalkNowLink screen="know_questions" />
      </View>
    </View>
  );
}
