import { TalkNowLink } from '@/components/proto/talk-now-link';
import { PressableScale } from '@/components/ui/pressable-scale';
import {
  JOURNAL_CATEGORIES,
  JOURNAL_PROMPTS,
  type JournalCategory,
  type JournalPrompt,
} from '@/data/journal-prompts';
import { mentor, teen } from '@/data/mock';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { Scribbles } from '@/lib/scribbles';
import { useHubStore } from '@/stores/hub-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { useSelfcareStore } from '@/stores/selfcare-store';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Lock,
  Send,
  Trash2,
  X,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Vent space: full-screen free text, now a desk covered in supplies —
 * switch the pen (font), the ink, the paper, and slap stickers on it.
 * Stickers drag; drop one on the trash zone to toss it. Still private by
 * default: nothing is read unless the teen chooses to share it.
 */

const FONTS = [
  { id: 'plain', family: 'TWKLausanne-400', size: 17, lineHeight: 24 },
  { id: 'marker', family: 'Caveat_600SemiBold', size: 24, lineHeight: 30 },
  { id: 'cursive', family: 'CedarvilleCursive-Regular', size: 20, lineHeight: 32 },
  { id: 'loud', family: 'Avantt-Bold', size: 19, lineHeight: 25 },
  { id: 'typewriter', family: 'GeistMono-Medium', size: 14, lineHeight: 24 },
] as const;

const INKS = ['#1F1E1D', '#4D55FD', '#E85C82', '#5FA74B', '#FF9812'] as const;

const PAPERS: [string, string][] = [
  ['#F7F5F1', '#EAE6DC'],
  ['#FFF9E3', '#FFECAD'],
  ['#EAF9FF', '#D5F0FF'],
  ['#FFF0F4', '#FFDDE7'],
];

/**
 * Zine sticker kit — the brand's own scribbles as peel-off shapes, plus
 * handwritten word stickers. No emoji.
 */
type StickerDef =
  | { kind: 'scribble'; key: string; source: { uri: string }; tint: string }
  | { kind: 'word'; key: string; text: string; color: string };

const STICKER_DEFS: StickerDef[] = [
  { kind: 'scribble', key: 'cloud', source: Scribbles.orangeCloud, tint: '#FF9812' },
  { kind: 'scribble', key: 'loops', source: Scribbles.pinkLoops, tint: '#E85C82' },
  { kind: 'scribble', key: 'swoosh', source: Scribbles.blueSwoosh, tint: '#4D55FD' },
  { kind: 'scribble', key: 'spiral', source: Scribbles.yellowSpiral, tint: '#D9A514' },
  { kind: 'word', key: 'ugh', text: 'ugh.', color: '#1F1E1D' },
  { kind: 'word', key: 'nope', text: 'nope', color: '#E85C82' },
  { kind: 'word', key: 'sodone', text: 'SO DONE', color: '#4D55FD' },
  { kind: 'word', key: 'bangs', text: '!!!', color: '#FF9812' },
  { kind: 'word', key: 'whatever', text: 'whatever', color: '#5FA74B' },
  { kind: 'word', key: 'frfr', text: 'fr fr', color: '#B164FF' },
];

interface StickerData {
  id: number;
  def: StickerDef;
  x: number;
  y: number;
  rot: number;
}

/** A draggable sticker living on the paper. */
function Sticker({
  sticker,
  paperHeightRef,
  onDragState,
  onRemove,
}: {
  sticker: StickerData;
  paperHeightRef: React.MutableRefObject<number>;
  onDragState: (dragging: boolean) => void;
  onRemove: (id: number) => void;
}) {
  const tx = useSharedValue(sticker.x);
  const ty = useSharedValue(sticker.y);
  const lift = useSharedValue(0);
  const start = useRef({ x: sticker.x, y: sticker.y });

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        start.current = { x: tx.value, y: ty.value };
        lift.value = 1;
        buzz.tick();
        onDragState(true);
      },
      onPanResponderMove: (_e, g) => {
        tx.value = start.current.x + g.dx;
        ty.value = start.current.y + g.dy;
      },
      onPanResponderRelease: () => {
        lift.value = 0;
        onDragState(false);
        // dropped on the trash zone (bottom strip of the paper) → toss it
        if (ty.value > paperHeightRef.current - 84) {
          buzz.heavy();
          onRemove(sticker.id);
        }
      },
      onPanResponderTerminate: () => {
        lift.value = 0;
        onDragState(false);
      },
    }),
  ).current;

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${sticker.rot}deg` },
      { scale: 1 + lift.value * 0.25 },
    ],
  }));

  return (
    <Animated.View
      {...pan.panHandlers}
      entering={ZoomIn.springify().damping(11)}
      style={[{ position: 'absolute', left: 0, top: 0, padding: 6 }, style]}
    >
      {sticker.def.kind === 'scribble' ? (
        <Image
          source={sticker.def.source}
          style={{ width: 62, height: 62 }}
          contentFit="contain"
          tintColor={sticker.def.tint}
        />
      ) : (
        <Text
          style={{
            fontFamily: sticker.def.text === sticker.def.text.toUpperCase() && sticker.def.text.length > 3
              ? 'Avantt-Bold'
              : 'Caveat_600SemiBold',
            fontSize: sticker.def.text.length > 5 ? 24 : 30,
            color: sticker.def.color,
          }}
        >
          {sticker.def.text}
        </Text>
      )}
    </Animated.View>
  );
}

export default function Vent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { prompt: queryPromptId } = useLocalSearchParams<{ prompt?: string }>();

  const ventText = useSelfcareStore(s => s.ventText);
  const setVentText = useSelfcareStore(s => s.setVentText);
  const ventPromptId = useSelfcareStore(s => s.ventPromptId);
  const setVentPromptId = useSelfcareStore(s => s.setVentPromptId);
  const setVentShared = useSelfcareStore(s => s.setVentShared);

  const ollesVersion = useScenarioStore(s => s.ollesVersion);

  const [step, setStep] = useState<'prompt' | 'write'>(() =>
    !ollesVersion ? 'write' : queryPromptId ? 'write' : ventText.trim() ? 'write' : 'prompt',
  );

  const [promptId, setPromptIdState] = useState<string | null>(
    () => queryPromptId ?? ventPromptId ?? null,
  );

  const setPromptId = (id: string | null) => {
    setPromptIdState(id);
    setVentPromptId(id);
  };

  const selectedPrompt = useMemo(
    () => JOURNAL_PROMPTS.find(p => p.id === promptId),
    [promptId],
  );

  const [choosing, setChoosing] = useState(false);
  const [fontIdx, setFontIdx] = useState(0);
  const [inkIdx, setInkIdx] = useState(0);
  const [paperIdx, setPaperIdx] = useState(0);
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [dragging, setDragging] = useState(false);
  const startedAt = useRef(Date.now());
  const nextId = useRef(1);
  const paperSize = useRef({ w: 0, h: 0 });
  const paperHeightRef = useRef(0);

  const font = FONTS[fontIdx];
  const ink = INKS[inkIdx];
  const paper = PAPERS[paperIdx];

  const addSticker = (def: StickerDef) => {
    buzz.light();
    const { w, h } = paperSize.current;
    setStickers(s => [
      ...s,
      {
        id: nextId.current++,
        def,
        x: 30 + Math.random() * Math.max(40, w - 130),
        y: 30 + Math.random() * Math.max(40, h - 170),
        rot: -14 + Math.random() * 28,
      },
    ]);
  };

  const removeSticker = (id: number) =>
    setStickers(s => s.filter(st => st.id !== id));

  const finish = (shared: boolean) => {
    setVentShared(shared);
    track('offline_vent_shared', { shared, has_prompt: Boolean(selectedPrompt) });
    track('offline_tool_completed', {
      tool: 'vent',
      duration_s: Math.round((Date.now() - startedAt.current) / 1000),
      prompt_id: selectedPrompt?.id,
    });
    // Save to Hub's store as an artifact note
    useHubStore.getState().addEntity({
      entityType: 'note',
      owner: { ...teen, role: 'teen' as const },
      isPrivate: !shared,
      note: {
        content: selectedPrompt ? `"${selectedPrompt.title}"\n\n${ventText}` : ventText,
      },
    });
    router.replace(`/selfcare/done?tool=vent&shared=${shared ? '1' : '0'}`);
  };

  const stickerLayer = useMemo(
    () =>
      stickers.map(s => (
        <Sticker
          key={s.id}
          sticker={s}
          paperHeightRef={paperHeightRef}
          onDragState={setDragging}
          onRemove={removeSticker}
        />
      )),
    [stickers],
  );

  if (choosing) {
    return (
      <View className="flex-1 bg-white px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <View className="flex-1 justify-center" style={{ gap: 14 }}>
          <Animated.Text
            entering={FadeInDown.duration(360).easing(EASE_STANDARD)}
            className="font-avantt-bold text-primary mb-2"
            style={{ fontSize: 28, lineHeight: 32 }}
          >
            What should happen to it?
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(120).springify().damping(18)}>
            <PressableScale
              scaleTo={0.97}
              onPress={() => finish(false)}
              className="flex-row items-center rounded-3xl bg-surfaces-z2 border border-surfaces-divider px-5"
              style={{ minHeight: 84, gap: 14 }}
            >
              <Lock size={26} color="#1F1E1D" strokeWidth={1.8} />
              <View className="flex-1">
                <Text className="font-avantt-bold text-primary" style={{ fontSize: 19 }}>
                  Keep it private
                </Text>
                <Text className="text-body-3 text-secondary mt-0.5">
                  No one ever sees it
                </Text>
              </View>
            </PressableScale>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(220).springify().damping(18)}>
            <PressableScale
              scaleTo={0.97}
              onPress={() => finish(true)}
              className="flex-row items-center rounded-3xl bg-white border border-surfaces-divider px-5"
              style={{ minHeight: 84, gap: 14 }}
            >
              <Send size={24} color="#1F1E1D" strokeWidth={1.8} />
              <View className="flex-1">
                <Text className="font-avantt-bold text-primary" style={{ fontSize: 19 }}>
                  Share with {mentor.name}
                </Text>
                <Text className="text-body-3 text-secondary mt-0.5">
                  For when they&apos;re back
                </Text>
              </View>
            </PressableScale>
          </Animated.View>
        </View>
        <TalkNowLink screen="selfcare_vent_choice" />
      </View>
    );
  }

  if (ollesVersion && step === 'prompt') {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 8 }}>
        {/* Top bar */}
        <View className="flex-row items-center justify-between px-5 pb-3">
          <View className="w-9" />
          <Text className="text-body-3 text-secondary font-avantt-bold">Journal</Text>
          <Pressable
            onPress={() => {
              buzz.tick();
              if (router.canGoBack()) router.back();
              else router.replace('/');
            }}
            className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:opacity-60"
            hitSlop={8}
          >
            <X size={18} color="#1F1E1D" strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom + 20, 36),
          }}
        >
          <Animated.View entering={FadeInDown.duration(320).easing(EASE_STANDARD)} className="mb-5">
            <Text className="font-avantt-bold text-primary" style={{ fontSize: 28, lineHeight: 32 }}>
              Choose a prompt.
            </Text>
            <Text className="text-body-3 text-secondary mt-1.5">
              Pick a question to jumpstart your head, or write freely.
            </Text>
          </Animated.View>

          {/* Quick Action Cards: Free Write & Shuffle */}
          <View className="flex-row gap-3 mb-5">
            <PressableScale
              scaleTo={0.97}
              onPress={() => {
                buzz.tick();
                setPromptId(null);
                setStep('write');
              }}
              className="flex-1 p-4 rounded-2xl bg-[#F6F5F2] border border-slate-200/80 active:bg-slate-200"
            >
              <Text className="text-xl mb-1">✏️</Text>
              <Text className="font-avantt-bold text-primary text-sm">Free write</Text>
              <Text className="text-[11px] text-secondary mt-0.5">Blank page, no prompt</Text>
            </PressableScale>

            <PressableScale
              scaleTo={0.97}
              onPress={() => {
                buzz.tick();
                const random = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
                setPromptId(random.id);
                setStep('write');
              }}
              className="flex-1 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 active:bg-amber-100"
            >
              <Text className="text-xl mb-1">🎲</Text>
              <Text className="font-avantt-bold text-slate-800 text-sm">Surprise me</Text>
              <Text className="text-[11px] text-amber-700 mt-0.5">Random prompt</Text>
            </PressableScale>
          </View>

          <Text className="text-[11px] font-bold text-tertiary uppercase tracking-wider mb-2.5">
            Prompts to answer
          </Text>

          <View style={{ gap: 10 }}>
            {JOURNAL_PROMPTS.map((p, idx) => (
              <Animated.View
                key={p.id}
                entering={FadeInDown.delay(60 + idx * 35).duration(240)}
              >
                <PressableScale
                  scaleTo={0.98}
                  onPress={() => {
                    buzz.tick();
                    setPromptId(p.id);
                    setStep('write');
                  }}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs active:bg-slate-50"
                >
                  <View className="flex-row items-center justify-between mb-1.5">
                    <View
                      className="px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: p.accentColor + '18' }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontFamily: 'GeistMono-Medium',
                          color: p.accentColor,
                          letterSpacing: 0.8,
                          textTransform: 'uppercase',
                        }}
                      >
                        {p.category}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, fontFamily: 'Avantt-Bold', color: '#8A857C' }}>
                      Write this →
                    </Text>
                  </View>
                  <Text className="font-avantt-bold text-primary text-[15px] leading-snug">
                    "{p.title}"
                  </Text>
                  <Text className="text-xs text-secondary mt-1 leading-normal">
                    {p.placeholder}
                  </Text>
                </PressableScale>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
        <TalkNowLink screen="selfcare_vent" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 px-5" style={{ paddingTop: insets.top + 8 }}>
        {/* Navigation / Actions row */}
        <View className="flex-row items-center justify-between pb-2">
          {ollesVersion ? (
            <PressableScale
              scaleTo={0.96}
              onPress={() => {
                buzz.tick();
                setStep('prompt');
              }}
              className="flex-row items-center rounded-full bg-slate-100 px-3 py-1.5"
              style={{ gap: 4 }}
            >
              <ChevronLeft size={14} color="#1F1E1D" strokeWidth={2.4} />
              <Text className="text-xs font-bold text-slate-800">
                {selectedPrompt ? 'Change prompt' : 'Prompts'}
              </Text>
            </PressableScale>
          ) : (
            <View />
          )}

          <Pressable
            onPress={() => {
              buzz.tick();
              if (router.canGoBack()) router.back();
              else router.replace('/');
            }}
            className="h-8 w-8 items-center justify-center rounded-full bg-slate-100 active:opacity-60"
            hitSlop={8}
          >
            <X size={16} color="#1F1E1D" strokeWidth={2} />
          </Pressable>
        </View>

        <Animated.View entering={FadeInDown.duration(380).easing(EASE_STANDARD)}>
          <Text className="font-avantt-bold text-primary" style={{ fontSize: 26, lineHeight: 30 }}>
            {selectedPrompt ? 'Answer the prompt.' : 'Say whatever you need to.'}
          </Text>
          <Text className="text-body-3 text-secondary mt-1">
            {selectedPrompt
              ? 'Take your time — write as much or as little as you want.'
              : 'No one reads this unless you want them to.'}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(140).springify().damping(18)}
          style={{ flex: 1, marginTop: 4 }}
        >
          {/* plain View measures the paper — neither LinearGradient nor
              reanimated views forward onLayout on web */}
          <View
            style={{ flex: 1 }}
            onLayout={e => {
              paperSize.current = {
                w: e.nativeEvent.layout.width,
                h: e.nativeEvent.layout.height,
              };
              paperHeightRef.current = e.nativeEvent.layout.height;
            }}
          >
          <LinearGradient
            colors={paper}
            style={{ flex: 1, borderRadius: 18, padding: 16, overflow: 'hidden' }}
          >
            <Image
              source={Scribbles.yellowLoops}
              style={{
                position: 'absolute',
                right: -28,
                bottom: -30,
                width: 120,
                height: 120,
                opacity: 0.35,
                transform: [{ rotate: '10deg' }],
              }}
              contentFit="contain"
            />

            {/* Pinned Washi-Tape Prompt Banner */}
            {selectedPrompt && (
              <Animated.View
                entering={FadeInDown.duration(200)}
                exiting={FadeOut.duration(150)}
                className="mb-2.5 rounded-xl p-3 bg-white/85 border border-black/5"
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 1 },
                }}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center" style={{ gap: 6 }}>
                    <View
                      className="px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: selectedPrompt.accentColor + '20' }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontFamily: 'GeistMono-Medium',
                          color: selectedPrompt.accentColor,
                          letterSpacing: 0.8,
                          textTransform: 'uppercase',
                        }}
                      >
                        {selectedPrompt.category}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 10, color: '#8A857C', fontFamily: 'TWKLausanne-400' }}>
                      PROMPT
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      buzz.tick();
                      setPromptId(null);
                    }}
                    hitSlop={8}
                    className="h-5 w-5 items-center justify-center rounded-full bg-black/5 active:opacity-60"
                  >
                    <X size={11} color="#555" strokeWidth={2.4} />
                  </Pressable>
                </View>
                <Text
                  className="font-avantt-bold text-slate-800 leading-snug"
                  style={{ fontSize: 13 }}
                >
                  "{selectedPrompt.title}"
                </Text>
              </Animated.View>
            )}

            <TextInput
              value={ventText}
              onChangeText={setVentText}
              placeholder={selectedPrompt ? selectedPrompt.placeholder : '…'}
              placeholderTextColor="#767676"
              multiline
              autoFocus
              className="flex-1"
              style={{
                textAlignVertical: 'top',
                fontFamily: font.family,
                fontSize: font.size,
                lineHeight: font.lineHeight,
                color: ink,
              }}
            />
            {stickerLayer}
            {dragging && (
              <Animated.View
                entering={FadeIn.duration(160)}
                exiting={FadeOut.duration(160)}
                pointerEvents="none"
                className="absolute bottom-3 self-center flex-row items-center rounded-full px-4 py-2"
                style={{ left: '50%', transform: [{ translateX: -60 }], backgroundColor: 'rgba(31,30,29,0.75)', gap: 6 }}
              >
                <Trash2 size={14} color="#fff" strokeWidth={2} />
                <Text className="text-white" style={{ fontSize: 12, fontFamily: 'TWKLausanne-400' }}>
                  drop to toss
                </Text>
              </Animated.View>
            )}
          </LinearGradient>
          </View>
        </Animated.View>

        {/* The desk: pens, inks, paper, stickers */}
        <Animated.View entering={FadeInDown.delay(240).duration(320).easing(EASE_STANDARD)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ alignItems: 'center', gap: 8, paddingVertical: 10 }}
          >
            {FONTS.map((f, i) => (
              <Pressable
                key={f.id}
                onPress={() => {
                  buzz.tick();
                  setFontIdx(i);
                }}
                className="items-center justify-center rounded-full border"
                style={{
                  width: 44,
                  height: 44,
                  borderColor: i === fontIdx ? '#1F1E1D' : '#DFDAD3',
                  backgroundColor: i === fontIdx ? '#1F1E1D' : '#FFFFFF',
                }}
              >
                <Text style={{ fontFamily: f.family, fontSize: 17, color: i === fontIdx ? '#FFFFFF' : '#1F1E1D' }}>
                  Aa
                </Text>
              </Pressable>
            ))}
            <View style={{ width: 1, height: 26, backgroundColor: '#E5E0D8', marginHorizontal: 4 }} />
            {INKS.map((c, i) => (
              <Pressable
                key={c}
                onPress={() => {
                  buzz.tick();
                  setInkIdx(i);
                }}
                className="items-center justify-center rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  borderWidth: i === inkIdx ? 3 : 1,
                  borderColor: i === inkIdx ? '#1F1E1D' : '#DFDAD3',
                }}
                hitSlop={4}
              >
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: c }} />
              </Pressable>
            ))}
            <View style={{ width: 1, height: 26, backgroundColor: '#E5E0D8', marginHorizontal: 4 }} />
            {PAPERS.map((p, i) => (
              <Pressable
                key={p[0]}
                onPress={() => {
                  buzz.tick();
                  setPaperIdx(i);
                }}
                className="rounded-lg overflow-hidden"
                style={{
                  width: 34,
                  height: 40,
                  borderWidth: i === paperIdx ? 2.5 : 1,
                  borderColor: i === paperIdx ? '#1F1E1D' : '#DFDAD3',
                }}
                hitSlop={6}
              >
                <LinearGradient colors={p} style={{ flex: 1 }} />
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ alignItems: 'center', gap: 4, paddingBottom: 6 }}
          >
            {STICKER_DEFS.map(def => (
              <Pressable
                key={def.key}
                onPress={() => addSticker(def)}
                className="items-center justify-center active:opacity-60"
                style={{ minWidth: 44, height: 40, paddingHorizontal: 4, transform: [{ rotate: '-4deg' }] }}
              >
                {def.kind === 'scribble' ? (
                  <Image
                    source={def.source}
                    style={{ width: 32, height: 32 }}
                    contentFit="contain"
                    tintColor={def.tint}
                  />
                ) : (
                  <Text
                    style={{
                      fontFamily: def.text === def.text.toUpperCase() && def.text.length > 3
                        ? 'Avantt-Bold'
                        : 'Caveat_600SemiBold',
                      fontSize: def.text.length > 5 ? 15 : 19,
                      color: def.color,
                    }}
                  >
                    {def.text}
                  </Text>
                )}
              </Pressable>
            ))}
            <Text className="text-tertiary" style={{ fontSize: 12, fontFamily: 'TWKLausanne-400', marginLeft: 6 }}>
              tap to sticker it · drag to move
            </Text>
          </ScrollView>
        </Animated.View>
      </View>

      <View className="px-5 pt-2" style={{ paddingBottom: Math.max(insets.bottom, 16), gap: 12 }}>
        <Pressable
          onPress={() => {
            if (!ventText.trim()) return;
            buzz.medium();
            setChoosing(true);
          }}
          disabled={!ventText.trim()}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          style={!ventText.trim() ? { opacity: 0.35 } : undefined}
        >
          <Text className="text-body-2 text-white">I&apos;m done</Text>
        </Pressable>
        <TalkNowLink screen="selfcare_vent" />
      </View>
    </KeyboardAvoidingView>
  );
}
