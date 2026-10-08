import { KnowFinish } from '@/components/proto/know-finish';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { PressableScale } from '@/components/ui/pressable-scale';
import { mentor, teen } from '@/data/mock';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { Scribbles } from '@/lib/scribbles';
import { useAppStore } from '@/stores/app-store';
import { useHubStore } from '@/stores/hub-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Plus, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  ZoomIn,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Our playlist — the mentor started one (left with their intro, not live);
 * the teen adds three tracks and names it. The finished playlist lands on
 * the hub as a note and pings the chat. The vinyl is tactile: hold it and
 * the record stops, the tonearm lifts.
 */
interface Track {
  title: string;
  artist: string;
  label: string;
}

const MENTOR_TRACKS: Track[] = [
  { title: 'Nights', artist: 'Frank Ocean', label: '#B164FF' },
  { title: 'Ribs', artist: 'Lorde', label: '#71E0FF' },
  { title: 'Mystery of Love', artist: 'Sufjan Stevens', label: '#C2DF4F' },
];

const CATALOG: Track[] = [
  { title: 'Ivy', artist: 'Frank Ocean', label: '#C2DF4F' },
  { title: 'Kill Bill', artist: 'SZA', label: '#E85C82' },
  { title: '505', artist: 'Arctic Monkeys', label: '#71E0FF' },
  { title: 'Sweater Weather', artist: 'The Neighbourhood', label: '#FF9812' },
  { title: 'Redbone', artist: 'Childish Gambino', label: '#B164FF' },
  { title: 'Good Days', artist: 'SZA', label: '#5FA74B' },
  { title: 'Line Without a Hook', artist: 'Ricky Montgomery', label: '#FFD84D' },
  { title: 'Space Song', artist: 'Beach House', label: '#4D55FD' },
];

const NAME_IDEAS = ['3am drive', 'no skips', 'main character', 'us, probably'];

/** A spinning record with a tonearm — hold it and it stops. */
function Vinyl({ label, size, playing }: { label: string; size: number; playing: boolean }) {
  const angle = useSharedValue(0);
  const arm = useSharedValue(0); // 0 = on the record, 1 = lifted
  useEffect(() => {
    if (playing) {
      angle.value = withRepeat(
        withTiming(angle.value + 360, { duration: 5000, easing: Easing.linear }),
        -1,
      );
      arm.value = withTiming(0, { duration: 260, easing: EASE_STANDARD });
    } else {
      cancelAnimation(angle);
      arm.value = withTiming(1, { duration: 260, easing: EASE_STANDARD });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);
  const spin = useAnimatedStyle(() => ({ transform: [{ rotate: `${angle.value}deg` }] }));
  const armStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${24 - arm.value * 26}deg` }],
  }));

  return (
    <View style={{ width: size + 34, height: size }}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#1F1E1D',
            alignItems: 'center',
            justifyContent: 'center',
          },
          spin,
        ]}
      >
        {[0.82, 0.66, 0.5].map(f => (
          <View
            key={f}
            style={{
              position: 'absolute',
              width: size * f,
              height: size * f,
              borderRadius: (size * f) / 2,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.14)',
            }}
          />
        ))}
        <View
          style={{
            width: size * 0.34,
            height: size * 0.34,
            borderRadius: (size * 0.34) / 2,
            backgroundColor: label,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#1F1E1D' }} />
        </View>
      </Animated.View>
      {/* tonearm, pivoting from its base */}
      <Animated.View
        style={[
          { position: 'absolute', right: 0, top: -6, transformOrigin: 'top center' },
          armStyle,
        ]}
      >
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#1F1E1D',
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            width: 5,
            height: size * 0.52,
            borderRadius: 3,
            backgroundColor: '#1F1E1D',
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            width: 10,
            height: 18,
            borderRadius: 3,
            backgroundColor: '#8E8578',
            alignSelf: 'center',
            marginTop: -2,
          }}
        />
      </Animated.View>
    </View>
  );
}

function TrackRow({
  track,
  by,
  onPress,
  added,
}: {
  track: Track;
  by?: 'mentor' | 'teen';
  onPress?: () => void;
  added?: boolean;
}) {
  const row = (
    <View className="flex-row items-center" style={{ gap: 10, minHeight: 44 }}>
      <View
        className="items-center justify-center rounded-md"
        style={{ width: 30, height: 30, backgroundColor: track.label }}
      >
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#1F1E1D' }} />
      </View>
      <View className="flex-1">
        <Text className="font-avantt-bold text-primary" style={{ fontSize: 14.5 }} numberOfLines={1}>
          {track.title}
        </Text>
        <Text className="text-secondary" style={{ fontFamily: 'TWKLausanne-400', fontSize: 12 }} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      {by === 'mentor' && (
        <Image source={{ uri: mentor.avatar }} style={{ width: 20, height: 20, borderRadius: 10 }} />
      )}
      {by === 'teen' && (
        <Text className="text-tertiary" style={{ fontFamily: 'GeistMono-Medium', fontSize: 9, letterSpacing: 1 }}>
          YOU
        </Text>
      )}
      {onPress && !added && <Plus size={16} color="#1F1E1D" strokeWidth={2.2} />}
    </View>
  );
  if (!onPress) return row;
  return (
    <Pressable onPress={onPress} className="active:opacity-60" style={added ? { opacity: 0.3 } : undefined} disabled={added}>
      {row}
    </Pressable>
  );
}

export default function Songs() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sendMessage = useAppStore(s => s.sendMessage);
  const addEntity = useHubStore(s => s.addEntity);
  const [building, setBuilding] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [picks, setPicks] = useState<Track[]>([]);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const startedAt = useRef(Date.now());

  const addPick = (t: Track) => {
    if (picks.length >= 3 || picks.includes(t)) return;
    buzz.light();
    setPicks(p => [...p, t]);
  };
  const removePick = (t: Track) => {
    buzz.tick();
    setPicks(p => p.filter(x => x !== t));
  };

  const ready = picks.length === 3 && name.trim().length > 0;

  const save = () => {
    if (!ready) return;
    buzz.medium();
    const title = name.trim();
    track('know_tool_completed', {
      tool: 'playlist',
      name: title,
      duration_s: Math.round((Date.now() - startedAt.current) / 1000),
    });
    const lines = [
      ...MENTOR_TRACKS.map((t, i) => `${i + 1}. ${t.title} — ${t.artist}  (${mentor.name})`),
      ...picks.map((t, i) => `${i + 4}. ${t.title} — ${t.artist}  (${teen.name})`),
    ].join('\n');
    addEntity({
      entityType: 'note',
      owner: { name: teen.name, avatar: teen.avatar, role: 'teen' },
      note: { content: `"${title}"\na playlist, both of us\n\n${lines}` },
    });
    sendMessage(`finished the playlist you started — "${title}". 6 tracks now.`);
    setSaved(true);
  };

  if (saved) {
    return <KnowFinish title="Playlist done." sub="on the hub, and in your chat" />;
  }

  if (!building) {
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
        <View className="flex-1 items-center justify-center">
          <Animated.View entering={FadeInDown.duration(400).easing(EASE_STANDARD)} className="items-center">
            <Text
              className="text-tertiary"
              style={{ fontFamily: 'GeistMono-Medium', fontSize: 11, letterSpacing: 1.5 }}
            >
              {mentor.name.toUpperCase()} STARTED A PLAYLIST · WITH HIS INTRO
            </Text>
            <Pressable
              onPressIn={() => {
                buzz.tick();
                setPlaying(false);
              }}
              onPressOut={() => setPlaying(true)}
              className="mt-7"
            >
              <Vinyl label="#B164FF" size={200} playing={playing} />
            </Pressable>
            <Text
              className="text-secondary mt-4"
              style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 18 }}
            >
              hold the record to stop it
            </Text>
            <View className="mt-6 self-stretch rounded-3xl border border-[#EFEBE4] bg-[#FDFCF9] px-4 py-3" style={{ gap: 4 }}>
              {MENTOR_TRACKS.map(t => (
                <TrackRow key={t.title} track={t} by="mentor" />
              ))}
            </View>
          </Animated.View>
        </View>
        <Animated.View entering={FadeInDown.delay(250).duration(360).easing(EASE_STANDARD)} style={{ gap: 12 }}>
          <Pressable
            onPress={() => {
              buzz.light();
              setBuilding(true);
            }}
            className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          >
            <Text className="text-body-2 text-white">Add your three</Text>
          </Pressable>
          <TalkNowLink screen="know_playlist" />
        </Animated.View>
      </View>
    );
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

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        {/* the playlist so far */}
        <Animated.View
          entering={FadeInDown.duration(360).easing(EASE_STANDARD)}
          className="rounded-3xl px-5 py-5 overflow-hidden"
          style={{ backgroundColor: '#F4F1FF' }}
        >
          <Image
            source={Scribbles.purpleSwoosh}
            style={{
              position: 'absolute',
              right: -34,
              top: -30,
              width: 130,
              height: 130,
              opacity: 0.35,
              transform: [{ rotate: '-14deg' }],
            }}
            contentFit="contain"
          />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="name this playlist…"
            placeholderTextColor="#8E8578"
            maxLength={28}
            style={{
              fontFamily: 'Caveat_600SemiBold',
              fontSize: 28,
              color: '#1F1E1D',
              paddingVertical: 2,
            }}
          />
          <View className="flex-row flex-wrap mt-1" style={{ gap: 6 }}>
            {NAME_IDEAS.map(idea => (
              <Pressable
                key={idea}
                onPress={() => {
                  buzz.tick();
                  setName(idea);
                }}
                className="rounded-full border px-3 py-1 active:opacity-60"
                style={{ borderColor: name === idea ? '#1F1E1D' : 'rgba(31,30,29,0.2)' }}
              >
                <Text style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 15, color: '#1F1E1D' }}>
                  {idea}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-4" style={{ gap: 6 }}>
            {MENTOR_TRACKS.map(t => (
              <TrackRow key={t.title} track={t} by="mentor" />
            ))}
            {picks.map(t => (
              <Animated.View key={t.title} entering={ZoomIn.springify().damping(13)}>
                <Pressable onPress={() => removePick(t)} className="active:opacity-60">
                  <TrackRow track={t} by="teen" />
                </Pressable>
              </Animated.View>
            ))}
            {Array.from({ length: 3 - picks.length }).map((_, i) => (
              <View
                key={`slot-${i}`}
                className="rounded-xl border items-center justify-center"
                style={{ height: 44, borderStyle: 'dashed', borderColor: 'rgba(31,30,29,0.25)' }}
              >
                <Text className="text-tertiary" style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 16 }}>
                  your song {picks.length + i + 1}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* the crate to dig through */}
        <Animated.Text
          entering={FadeInDown.delay(150).duration(320).easing(EASE_STANDARD)}
          className="font-avantt-bold text-primary mt-5 mb-2"
          style={{ fontSize: 17 }}
        >
          Dig through the crate
        </Animated.Text>
        <View style={{ gap: 2 }}>
          {CATALOG.map(t => (
            <TrackRow
              key={t.title}
              track={t}
              onPress={() => addPick(t)}
              added={picks.includes(t)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="pt-2" style={{ gap: 12 }}>
        <Pressable
          onPress={save}
          disabled={!ready}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          style={!ready ? { opacity: 0.35 } : undefined}
        >
          <Text className="text-body-2 text-white">
            {picks.length < 3
              ? `Pick ${3 - picks.length} more`
              : name.trim()
                ? 'Save our playlist'
                : 'Name it first'}
          </Text>
        </Pressable>
        <TalkNowLink screen="know_playlist" />
      </View>
    </View>
  );
}
