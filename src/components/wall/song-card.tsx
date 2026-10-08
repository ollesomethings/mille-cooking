import { SONG_TRY, SONGS } from '@/data/wall-data';
import { useWallStore } from '@/stores/wall-store';
import { Disc3, Music2, Pause, Play, Search, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export function SongCard() {
  const songIdx = useWallStore(s => s.songIdx);
  const openSheet = useWallStore(s => s.openSheet);
  const setSong = useWallStore(s => s.setSong);
  const skipSong = useWallStore(s => s.skipSong);
  const [playing, setPlaying] = useState(false);

  const spin = useSharedValue(0);
  useEffect(() => {
    if (playing) {
      spin.set(withRepeat(withTiming(spin.get() + 1, { duration: 3600, easing: Easing.linear }), -1, false));
    }
  }, [playing, spin]);
  const discStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.get() * 360}deg` }],
  }));

  if (!songIdx) {
    return (
      <View style={{ marginHorizontal: 16, marginTop: 22, position: 'relative' }}>
        <Pressable
          onPress={() => openSheet('song')}
          style={{ backgroundColor: '#fff', borderRadius: 24, padding: 20, flexDirection: 'row', gap: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 16 }}
        >
          <View style={{ width: 90, height: 90, borderRadius: 999, borderWidth: 2, borderStyle: 'dashed', borderColor: '#DFDDD8', alignItems: 'center', justifyContent: 'center' }}>
            <Music2 size={22} color="#A0998D" strokeWidth={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Text className="text-geist" style={{ fontSize: 12, color: '#58534B', letterSpacing: 1 }}>ON REPEAT</Text>
              <Text className="text-geist" style={{ fontSize: 10.5, color: '#CBC6BE' }}>OPTIONAL</Text>
            </View>
            <Text className="font-avantt-bold" style={{ fontSize: 20, color: '#1E1E1E', marginTop: 6 }}>add a song</Text>
            <Text style={{ fontSize: 13.5, color: '#58534B', marginTop: 4 }}>whatever you&apos;ve had on loop lately</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={skipSong}
          hitSlop={6}
          style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: 999, backgroundColor: '#F4F3F1', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={9} color="#A0998D" strokeWidth={3} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ marginHorizontal: 16, marginTop: 22 }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 20, flexDirection: 'row', gap: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, position: 'relative' }}>
        <Pressable onPress={() => setPlaying(p => !p)} style={{ width: 90, height: 90 }}>
          <Animated.View
            style={[
              { width: 90, height: 90, borderRadius: 999, backgroundColor: '#141312', alignItems: 'center', justifyContent: 'center' },
              playing ? discStyle : undefined,
            ]}
          >
            <Disc3 size={26} color="#3a3733" strokeWidth={1.2} />
          </Animated.View>
          <View style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.94)', alignItems: 'center', justifyContent: 'center' }}>
            {playing ? (
              <Pause size={11} color="#1E1E1E" fill="#1E1E1E" />
            ) : (
              <Play size={11} color="#1E1E1E" fill="#1E1E1E" style={{ marginLeft: 1 }} />
            )}
          </View>
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text className="text-geist" style={{ fontSize: 12, color: '#FF5001', letterSpacing: 1 }}>ON REPEAT</Text>
          <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E', marginTop: 5 }} numberOfLines={1}>
            {songIdx.t}
          </Text>
          <Text style={{ fontSize: 13, color: '#58534B' }} numberOfLines={1}>
            {songIdx.a}
          </Text>
        </View>
        <Pressable
          onPress={() => setSong(null)}
          style={{ position: 'absolute', top: 12, right: 12, width: 26, height: 26, borderRadius: 999, backgroundColor: '#F4F3F1', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={10} color="#A0998D" strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
}

export function SongSheetContent() {
  const [query, setQuery] = useState('');
  const setSong = useWallStore(s => s.setSong);

  const results = query.trim()
    ? SONGS.filter(s => `${s.t} ${s.a}`.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>On repeat</Text>
        <Text className="text-geist" style={{ fontSize: 10, color: '#A0998D' }}>OPTIONAL</Text>
      </View>
      <Text style={{ fontSize: 12.5, color: '#A0998D', lineHeight: 18, marginBottom: 6 }}>
        whatever you&apos;ve had on loop lately — it spins on your wall.
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F4F3F1', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}>
        <Search size={14} color="#A0998D" strokeWidth={2.2} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="search any song or artist"
          style={{ flex: 1, fontSize: 13.5, color: '#1E1E1E' }}
        />
      </View>
      {!query.trim() && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
          <Text className="text-geist" style={{ fontSize: 10.5, color: '#CBC6BE' }}>TRY</Text>
          {SONG_TRY.map(t => (
            <Pressable
              key={t}
              onPress={() => setQuery(t)}
              style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#F4F3F1', borderWidth: 1, borderColor: '#F2F0EC' }}
            >
              <Text style={{ fontSize: 12, color: '#58534B' }}>{t}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {query.trim() && results.length === 0 && (
        <Text style={{ textAlign: 'center', paddingVertical: 20, fontSize: 12.5, color: '#A0998D' }}>
          nothing came up — try another spelling?
        </Text>
      )}
      {results.length > 0 && (
        <ScrollView style={{ maxHeight: 240, marginTop: 8 }}>
          {results.map(r => (
            <Pressable
              key={r.t}
              onPress={() => setSong(r)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 9, borderRadius: 12, backgroundColor: '#F8F5EE', marginBottom: 5 }}
            >
              <View style={{ width: 42, height: 42, borderRadius: 8, backgroundColor: '#EEE9E1', alignItems: 'center', justifyContent: 'center' }}>
                <Music2 size={16} color="#A0998D" />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '500', color: '#1E1E1E' }} numberOfLines={1}>{r.t}</Text>
                <Text style={{ fontSize: 11.5, color: '#A0998D' }} numberOfLines={1}>{r.a}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
