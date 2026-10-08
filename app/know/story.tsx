import { KnowFinish } from '@/components/proto/know-finish';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { PressableScale } from '@/components/ui/pressable-scale';
import { mentorCandidates } from '@/data/mentor-candidates';
import { teen } from '@/data/mock';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { useHubStore } from '@/stores/hub-store';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Make a story — the teen's own version of the mentor stories already on
 * the hub: one photo, an eyebrow, a headline. Lands on the hub as a real
 * story entity.
 */
const EYEBROWS = ['MY WEEK', 'RN', 'MOOD', 'LATELY'];

export default function Story() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const addEntity = useHubStore(s => s.addEntity);
  const [photo, setPhoto] = useState<string | null>(null);
  const [eyebrow, setEyebrow] = useState('RN');
  const [header, setHeader] = useState('');
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());

  const pool = useMemo(
    () =>
      [
        ...new Set(mentorCandidates.flatMap(m => m.interestPhotos)),
      ].slice(0, 4),
    [],
  );

  const previewW = Math.min(width - 130, 240);

  const publish = () => {
    if (!photo || !header.trim()) return;
    buzz.medium();
    track('know_tool_completed', {
      tool: 'story',
      duration_s: Math.round((Date.now() - startedAt.current) / 1000),
    });
    addEntity({
      entityType: 'story',
      owner: { name: teen.name, avatar: teen.avatar, role: 'teen' },
      story: { images: [{ url: photo, eyebrow, header: header.trim() }] },
    });
    setDone(true);
  };

  if (done) {
    return <KnowFinish title="Posted." sub="your story is on the hub now" />;
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

      <Animated.View entering={FadeInDown.duration(380).easing(EASE_STANDARD)}>
        <Text className="font-avantt-bold text-primary" style={{ fontSize: 27, lineHeight: 32 }}>
          Make a story.
        </Text>
        <Text className="text-body-3 text-secondary mt-1">
          Like the ones on the hub — but yours.
        </Text>
      </Animated.View>

      {/* live preview */}
      <View className="flex-1 items-center justify-center">
        <Animated.View
          key={photo ?? 'empty'}
          entering={photo ? ZoomIn.springify().damping(14) : FadeInDown.delay(140).springify().damping(18)}
          className="overflow-hidden rounded-3xl"
          style={{
            width: previewW,
            height: previewW * 1.45,
            backgroundColor: '#EFEBE4',
            transform: [{ rotate: '-2deg' }],
          }}
        >
          {photo && (
            <Image source={{ uri: photo }} style={{ position: 'absolute', width: '100%', height: '100%' }} contentFit="cover" />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' }}
          />
          <View className="flex-1 justify-end p-4">
            <Text style={{ fontFamily: 'GeistMono-Medium', fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.8)' }}>
              {eyebrow}
            </Text>
            <Text className="font-avantt-bold text-white mt-1" style={{ fontSize: 20, lineHeight: 24 }}>
              {header.trim() || 'say something…'}
            </Text>
          </View>
          {!photo && (
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-secondary" style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 20 }}>
                pick a photo below
              </Text>
            </View>
          )}
        </Animated.View>
      </View>

      {/* photo row */}
      <Animated.View entering={FadeInDown.delay(220).duration(320).easing(EASE_STANDARD)} className="flex-row" style={{ gap: 8 }}>
        {pool.map(uri => (
          <PressableScale key={uri} scaleTo={0.95} onPress={() => { buzz.tick(); setPhoto(uri); }} className="flex-1">
            <Image
              source={{ uri }}
              style={{
                width: '100%',
                aspectRatio: 1,
                borderRadius: 12,
                borderWidth: photo === uri ? 2.5 : 0,
                borderColor: '#1F1E1D',
                transform: [{ scale: photo === uri ? 1.05 : 1 }, { rotate: photo === uri ? '-2deg' : '0deg' }],
              }}
              contentFit="cover"
            />
          </PressableScale>
        ))}
      </Animated.View>

      {/* eyebrow chips + headline */}
      <View className="flex-row mt-3" style={{ gap: 8 }}>
        {EYEBROWS.map(e => (
          <Pressable
            key={e}
            onPress={() => { buzz.tick(); setEyebrow(e); }}
            className="items-center justify-center rounded-full px-3"
            style={{
              height: 34,
              backgroundColor: eyebrow === e ? '#1F1E1D' : '#FFFFFF',
              borderWidth: 1,
              borderColor: eyebrow === e ? '#1F1E1D' : '#DFDAD3',
            }}
          >
            <Text
              style={{
                fontFamily: 'GeistMono-Medium',
                fontSize: 10,
                letterSpacing: 1,
                color: eyebrow === e ? '#FFFFFF' : '#1F1E1D',
              }}
            >
              {e}
            </Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={header}
        onChangeText={setHeader}
        placeholder="headline, one line"
        placeholderTextColor="#767676"
        maxLength={48}
        className="rounded-2xl border border-[#DFDAD3] px-4 mt-3 text-primary"
        style={{ height: 48, fontFamily: 'TWKLausanne-400', fontSize: 16 }}
      />

      <View className="mt-3" style={{ gap: 12 }}>
        <Pressable
          onPress={publish}
          disabled={!photo || !header.trim()}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          style={!photo || !header.trim() ? { opacity: 0.35 } : undefined}
        >
          <Text className="text-body-2 text-white">Post it to the hub</Text>
        </Pressable>
        <TalkNowLink screen="know_story" />
      </View>
    </View>
  );
}
