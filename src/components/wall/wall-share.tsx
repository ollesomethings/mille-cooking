import { Moodies } from '@/lib/scribbles';
import { accentFor, useWallStore } from '@/stores/wall-store';
import { Image } from 'expo-image';
import { Check, Lock } from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CONFETTI_COLORS = ['#FF5001', '#7178FF', '#FFD400', '#3FC8F0', '#A9C93A'];

function ConfettiPiece({ index }: { index: number }) {
  const y = useSharedValue(-40);
  const left = 3 + ((index * 5.4) % 94);
  const size = 7 + (index % 4) * 3;
  const square = index % 3 === 0;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];

  useEffect(() => {
    y.set(
      withDelay(
        index * 130,
        withRepeat(withTiming(700, { duration: 2600 + (index % 5) * 350 }), 2, false),
      ),
    );
  }, [y, index]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.get() }, { rotate: `${(y.get() / 700) * 140}deg` }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: `${left}%`,
          width: size,
          height: square ? size : size * 1.7,
          backgroundColor: color,
          borderRadius: square ? 2 : 999,
        },
        style,
      ]}
    />
  );
}

export function WallShare() {
  const insets = useSafeAreaInsets();
  const accent = useWallStore(s => s.accent);
  const celebrate = useWallStore(s => s.celebrate);
  const name = useWallStore(s => s.name);
  const photo = useWallStore(s => s.photo);
  const placedTags = useWallStore(s => s.placedTags);
  const basics = useWallStore(s => s.basics);
  const wallPhotos = useWallStore(s => s.wallPhotos);
  const songIdx = useWallStore(s => s.songIdx);
  const shelf = useWallStore(s => s.shelf);
  const interests = useWallStore(s => s.interests);
  const answers = useWallStore(s => s.answers);
  const shareWithMentor = useWallStore(s => s.shareWithMentor);
  const keepTweaking = useWallStore(s => s.keepTweaking);
  const closeCelebration = useWallStore(s => s.closeCelebration);

  const acc = accentFor(accent);
  const confetti = useMemo(() => (celebrate ? Array.from({ length: 10 }, (_, i) => i) : []), [celebrate]);

  const basicsCount = Object.values(basics).filter(v => (v || '').trim()).length;
  const rows: { label: string; detail: string }[] = [
    placedTags.length ? { label: 'Stickers', detail: `${placedTags.length} placed` } : null,
    basicsCount ? { label: 'The basics', detail: `${basicsCount} filled` } : null,
    photo ? { label: 'Profile photo', detail: 'added' } : null,
    wallPhotos.length ? { label: 'Photos lately', detail: `${wallPhotos.length} pinned` } : null,
    songIdx ? { label: 'On repeat', detail: songIdx.t } : null,
    shelf.length ? { label: 'On the shelf', detail: `${shelf.length} picks` } : null,
    interests.length ? { label: 'Into', detail: `${interests.length} things` } : null,
    answers.length ? { label: 'In my words', detail: `${answers.length} ${answers.length === 1 ? 'prompt' : 'prompts'}` } : null,
  ].filter(Boolean) as { label: string; detail: string }[];

  return (
    <View style={{ flex: 1, backgroundColor: acc.hl }}>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 500, backgroundColor: acc.full, opacity: 0.16 }} />
      {confetti.map(i => (
        <ConfettiPiece key={i} index={i} />
      ))}

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26, paddingTop: insets.top + 20 }}>
        {!celebrate ? (
          <>
            <Text className="font-caveat" style={{ fontSize: 30, color: '#1E1E1E', transform: [{ rotate: '-2deg' }] }}>all done ✦</Text>
            <Text className="font-avantt-bold" style={{ fontSize: 33, color: '#1E1E1E', marginTop: 4, textAlign: 'center', lineHeight: 36 }}>
              Your wall is ready
            </Text>
            <Text style={{ fontSize: 14, color: '#58534B', lineHeight: 20, marginTop: 8, textAlign: 'center' }}>
              Nothing goes out until you share it. Here&apos;s what your mentor will see:
            </Text>
          </>
        ) : (
          <Animated.View entering={FadeIn} style={{ alignItems: 'center' }}>
            <Text className="font-caveat" style={{ fontSize: 30, color: '#1E1E1E', transform: [{ rotate: '-2deg' }] }}>it&apos;s live ✦</Text>
            <Text className="font-avantt-bold" style={{ fontSize: 33, color: '#1E1E1E', marginTop: 4, textAlign: 'center', lineHeight: 36 }}>
              Your mentor can see your wall now
            </Text>
            <Text style={{ fontSize: 14, color: '#58534B', lineHeight: 20, marginTop: 8, textAlign: 'center' }}>
              They&apos;ll take a look before your next session.
            </Text>
          </Animated.View>
        )}

        <View style={{ width: '100%', maxWidth: 310, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', marginTop: 20, transform: [{ rotate: '-1deg' }], shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 24 }}>
          <View style={{ height: 176, backgroundColor: acc.hl, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: acc.full, opacity: 0.18 }} />
            {photo ? (
              <Image source={{ uri: photo }} style={{ width: 62, height: 62, borderRadius: 999 }} contentFit="cover" />
            ) : (
              <View style={{ width: 62, height: 62, borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={Moodies.happy} style={{ width: 40, height: 40 }} contentFit="contain" />
              </View>
            )}
            <Text className="font-avantt-bold" style={{ fontSize: 20, color: '#1E1E1E', marginTop: 6 }}>{name}</Text>
            <View style={{ position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,.85)', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 }}>
              <Lock size={10} color="#58534B" strokeWidth={2} />
              <Text className="text-geist" style={{ fontSize: 9.5, color: '#58534B' }}>private</Text>
            </View>
          </View>
          <View style={{ padding: 14 }}>
            {rows.map(r => (
              <View key={r.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#F4F3F1' }}>
                <Check size={13} color="#FF5001" strokeWidth={2.6} />
                <Text style={{ fontSize: 13, color: '#1E1E1E', flex: 1 }} numberOfLines={1}>{r.label}</Text>
                <Text className="text-geist" style={{ fontSize: 10.5, color: '#A0998D' }}>{r.detail}</Text>
              </View>
            ))}
            <Text className="text-geist" style={{ fontSize: 10, color: '#CBC6BE', marginTop: 10 }}>
              ONLY YOUR MENTOR · NEVER PUBLIC
            </Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingBottom: insets.bottom + 20, gap: 10 }}>
        {!celebrate ? (
          <Pressable
            onPress={shareWithMentor}
            style={{ width: '100%', backgroundColor: '#FF5001', borderRadius: 999, paddingVertical: 16, alignItems: 'center', shadowColor: '#FF5001', shadowOpacity: 0.28, shadowRadius: 14 }}
          >
            <Text className="font-avantt-bold" style={{ fontSize: 17, color: '#fff' }}>Share with mentor</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={closeCelebration}
            style={{ width: '100%', backgroundColor: '#1E1E1E', borderRadius: 999, paddingVertical: 16, alignItems: 'center' }}
          >
            <Text className="font-avantt-bold" style={{ fontSize: 17, color: '#fff' }}>back to chat</Text>
          </Pressable>
        )}
        <Pressable onPress={keepTweaking} style={{ alignItems: 'center', paddingVertical: 4 }}>
          <Text className="text-geist" style={{ fontSize: 12, color: '#58534B', textDecorationLine: 'underline' }}>keep tweaking my wall</Text>
        </Pressable>
      </View>
    </View>
  );
}
