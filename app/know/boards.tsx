import { KnowFinish } from '@/components/proto/know-finish';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { PressableScale } from '@/components/ui/pressable-scale';
import { mentorCandidates } from '@/data/mentor-candidates';
import { mentor, teen } from '@/data/mock';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { useHubStore } from '@/stores/hub-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Vibe boards — pinterest, basically. The mentor's board was left with
 * their intro (not live); the teen pins three images back and the board
 * lands on the hub as a moment.
 */
export default function Boards() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const addEntity = useHubStore(s => s.addEntity);
  const [making, setMaking] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const startedAt = useRef(Date.now());

  // The mentor's board: their own gallery. The teen's pool: everyone else's.
  const mentorBoard = useMemo(
    () => [...mentorCandidates[0].gallery, ...mentorCandidates[0].interestPhotos].slice(0, 4),
    [],
  );
  const pool = useMemo(
    () =>
      [
        ...new Set(
          mentorCandidates.slice(1).flatMap(m => [...m.gallery, ...m.interestPhotos]),
        ),
      ].slice(0, 9),
    [],
  );

  const tile = (width - 40 - 16) / 3;

  const togglePick = (uri: string) => {
    buzz.tick();
    setPicked(p =>
      p.includes(uri) ? p.filter(u => u !== uri) : p.length < 3 ? [...p, uri] : p,
    );
  };

  const send = () => {
    if (picked.length !== 3) return;
    buzz.medium();
    track('know_tool_completed', {
      tool: 'boards',
      duration_s: Math.round((Date.now() - startedAt.current) / 1000),
    });
    addEntity({
      entityType: 'moment',
      owner: { name: teen.name, avatar: teen.avatar, role: 'teen' },
      moment: { caption: `vibe board, for ${mentor.name}`, images: picked },
    });
    setSent(true);
  };

  if (sent) {
    return <KnowFinish title="Pinned." sub="your board is on the hub now" />;
  }

  return (
    <View className="flex-1 bg-white px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      <View className="flex-row items-center justify-end" style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      {!making ? (
        <>
          <Animated.View entering={FadeInDown.duration(380).easing(EASE_STANDARD)}>
            <Text
              className="text-tertiary"
              style={{ fontFamily: 'GeistMono-Medium', fontSize: 11, letterSpacing: 1.5 }}
            >
              {mentor.name.toUpperCase()}&apos;S BOARD · FROM HIS INTRO
            </Text>
            <Text className="font-avantt-bold text-primary mt-2" style={{ fontSize: 27, lineHeight: 32 }}>
              His current vibe, in four.
            </Text>
          </Animated.View>
          <View className="flex-1 justify-center">
            <View className="flex-row flex-wrap" style={{ gap: 10 }}>
              {mentorBoard.map((uri, i) => (
                <Animated.View
                  key={uri}
                  entering={ZoomIn.delay(140 + i * 90).springify().damping(14)}
                  style={{ width: (width - 40 - 10) / 2 }}
                >
                  <Image
                    source={{ uri }}
                    style={{
                      width: '100%',
                      height: (width - 40 - 10) / 2,
                      borderRadius: 16,
                      transform: [{ rotate: `${i % 2 === 0 ? -2 : 2}deg` }],
                    }}
                    contentFit="cover"
                  />
                </Animated.View>
              ))}
            </View>
          </View>
          <Animated.View entering={FadeInDown.delay(300).duration(360).easing(EASE_STANDARD)} style={{ gap: 12 }}>
            <Pressable
              onPress={() => {
                buzz.light();
                setMaking(true);
              }}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
            >
              <Text className="text-body-2 text-white">Make yours</Text>
            </Pressable>
            <TalkNowLink screen="know_boards" />
          </Animated.View>
        </>
      ) : (
        <>
          <Animated.View entering={FadeInDown.duration(360).easing(EASE_STANDARD)}>
            <Text className="font-avantt-bold text-primary mt-2" style={{ fontSize: 27, lineHeight: 32 }}>
              Pick three that feel like right now.
            </Text>
          </Animated.View>
          <View className="flex-1 justify-center">
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {pool.map((uri, i) => {
                const sel = picked.includes(uri);
                return (
                  <Animated.View key={uri} entering={ZoomIn.delay(80 + i * 50).springify().damping(15)}>
                    <PressableScale scaleTo={0.95} onPress={() => togglePick(uri)}>
                      <Image
                        source={{ uri }}
                        style={{
                          width: tile,
                          height: tile,
                          borderRadius: 14,
                          opacity: picked.length === 3 && !sel ? 0.4 : 1,
                        }}
                        contentFit="cover"
                      />
                      {sel && (
                        <View
                          className="absolute items-center justify-center rounded-full"
                          style={{
                            top: 6,
                            right: 6,
                            width: 24,
                            height: 24,
                            backgroundColor: '#1F1E1D',
                          }}
                        >
                          <Check size={14} color="#fff" strokeWidth={2.6} />
                        </View>
                      )}
                    </PressableScale>
                  </Animated.View>
                );
              })}
            </View>
            {/* the board taking shape — picks fly into the slots */}
            <View className="flex-row justify-center mt-5" style={{ gap: 10 }}>
              {[0, 1, 2].map(i =>
                picked[i] ? (
                  <Animated.View key={picked[i]} entering={ZoomIn.springify().damping(11)}>
                    <Pressable onPress={() => togglePick(picked[i])} className="active:opacity-70">
                      <Image
                        source={{ uri: picked[i] }}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 12,
                          transform: [{ rotate: `${i % 2 === 0 ? -4 : 4}deg` }],
                        }}
                        contentFit="cover"
                      />
                    </Pressable>
                  </Animated.View>
                ) : (
                  <View
                    key={`slot-${i}`}
                    className="items-center justify-center rounded-xl border"
                    style={{
                      width: 56,
                      height: 56,
                      borderStyle: 'dashed',
                      borderColor: 'rgba(31,30,29,0.25)',
                    }}
                  >
                    <Text className="text-tertiary" style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 15 }}>
                      {i + 1}
                    </Text>
                  </View>
                ),
              )}
            </View>
          </View>
          <View style={{ gap: 12 }}>
            <Pressable
              onPress={send}
              disabled={picked.length !== 3}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
              style={picked.length !== 3 ? { opacity: 0.35 } : undefined}
            >
              <Text className="text-body-2 text-white">Pin it to the hub</Text>
            </Pressable>
            <TalkNowLink screen="know_boards" />
          </View>
        </>
      )}
    </View>
  );
}
