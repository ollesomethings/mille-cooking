import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { Moodies } from '@/lib/scribbles';
import { mentor } from '@/data/mock';
import type { PlaylistSong } from '@/data/playlists';
import { useAppStore } from '@/stores/app-store';
import { useHubStore } from '@/stores/hub-store';
import { useNavStore } from '@/stores/nav-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, MessageCircle, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SNIPPET_MS = 15000;

/** Spinning mini-vinyl for the row that's playing. */
function MiniVinyl({ color, playing }: { color: string; playing: boolean }) {
  const angle = useSharedValue(0);
  useEffect(() => {
    if (playing) {
      angle.value = withRepeat(
        withTiming(360, { duration: 2400, easing: Easing.linear }),
        -1,
      );
    } else {
      cancelAnimation(angle);
      angle.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);
  const spin = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}deg` }],
  }));
  return (
    <Animated.View
      style={[
        {
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: '#1F1E1D',
          alignItems: 'center',
          justifyContent: 'center',
        },
        spin,
      ]}
    >
      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: color }} />
      <View
        style={{
          position: 'absolute',
          top: 4,
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: 'rgba(255,255,255,0.35)',
        }}
      />
    </Animated.View>
  );
}

/** 15s snippet progress hairline. */
function SnippetProgress({ color }: { color: string }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: SNIPPET_MS, easing: Easing.linear });
  }, [t]);
  const style = useAnimatedStyle(() => ({ width: `${t.value * 100}%` }));
  return (
    <View
      style={{
        height: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(31,30,29,0.08)',
        overflow: 'hidden',
        marginTop: 8,
      }}
    >
      <Animated.View style={[{ height: '100%', borderRadius: 2, backgroundColor: color }, style]} />
    </View>
  );
}

export default function PlaylistView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entity = useHubStore(s =>
    s.entities.find(e => e.id === id && e.entityType === 'playlist'),
  );
  const reactToSong = useHubStore(s => s.reactToSong);
  const mentorOffline = useScenarioStore(s => s.mentorOffline);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (entity) track('playlist_opened', { owner: entity.owner.role });
    return () => {
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!entity?.playlist) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-body-2 text-secondary">This playlist is gone.</Text>
        <Pressable onPress={() => router.back()} className="mt-4 h-12 px-6 items-center justify-center">
          <Text className="text-body-2 text-primary underline">Go back</Text>
        </Pressable>
      </View>
    );
  }
  const pl = entity.playlist;
  const mine = entity.owner.role === 'teen';

  const togglePlay = (song: PlaylistSong) => {
    buzz.light();
    if (stopTimer.current) clearTimeout(stopTimer.current);
    if (playingId === song.id) {
      setPlayingId(null);
      return;
    }
    track('playlist_snippet_played', { song: song.title });
    console.log('[audio stub] 15s snippet:', song.title, '—', song.artist);
    setPlayingId(song.id);
    stopTimer.current = setTimeout(() => setPlayingId(null), SNIPPET_MS);
  };

  const react = (song: PlaylistSong) => {
    buzz.medium();
    track('playlist_song_reacted', { song: song.title, owner: entity.owner.role });
    reactToSong(entity.id, song.id, 'teen');
    // Online mentor notices the first reaction on this playlist (same
    // simulated-presence rules as the chat's auto-replies); offline, it
    // honestly waits for them. Guard lives in store state so re-seeds behave.
    if (!mine && !mentorOffline && !pl.mentorNoticed) {
      useHubStore.getState().markMentorNoticed(entity.id);
      setTimeout(() => {
        useAppStore
          .getState()
          .pushMentorMessage(`ok you reacting to ${song.title} is so valid`);
      }, 2600);
    }
  };

  const jumpToChat = (song: PlaylistSong) => {
    buzz.tick();
    track('playlist_chat_jump', { song: song.title });
    useAppStore.getState().setChatDraft(`wait you like ${song.title}?? `);
    useNavStore.getState().requestChat();
    if (router.canGoBack()) router.dismissAll();
    else router.replace('/');
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">Playlist</Text>
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover */}
        <Animated.View
          entering={FadeInDown.duration(360).easing(EASE_STANDARD)}
          className="items-center mt-2"
        >
          <View
            style={{
              width: 164,
              height: 164,
              borderRadius: 14,
              backgroundColor: pl.cover.bg,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transform: [{ rotate: '-2deg' }],
              shadowColor: '#000',
              shadowOpacity: 0.14,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
            }}
          >
            {[0.84, 0.6, 0.36].map(f => (
              <View
                key={f}
                style={{
                  position: 'absolute',
                  width: 164 * f,
                  height: 164 * f,
                  borderRadius: 999,
                  borderWidth: 1.5,
                  borderColor: 'rgba(31,30,29,0.08)',
                }}
              />
            ))}
            <Image
              source={Moodies[pl.cover.moodie]}
              style={{ width: 76, height: 76 }}
              contentFit="contain"
            />
          </View>
          <Text className="font-avantt-bold text-primary mt-4" style={{ fontSize: 26 }}>
            {pl.title}
          </Text>
          <View className="flex-row items-center mt-1.5" style={{ gap: 6 }}>
            <Image
              source={{ uri: entity.owner.avatar }}
              style={{ width: 20, height: 20, borderRadius: 10 }}
            />
            <Text className="text-body-3 text-secondary">
              {mine ? `you, for ${mentor.name}` : `${entity.owner.name}'s taste`} ·{' '}
              {pl.songs.length} songs
            </Text>
          </View>
          <Text
            className="text-tertiary mt-3"
            style={{ fontFamily: 'GeistMono-Medium', fontSize: 10, letterSpacing: 1.2 }}
          >
            TAP A SONG FOR A SNIPPET
          </Text>
        </Animated.View>

        {/* Songs */}
        <View className="px-5 mt-4">
          {pl.songs.map((song, i) => {
            const playing = playingId === song.id;
            const reactions = pl.reactions[song.id] ?? [];
            const iReacted = reactions.includes('teen');
            const mentorReacted = reactions.includes('mentor');
            return (
              <Animated.View
                key={song.id}
                entering={FadeInDown.delay(120 + Math.min(i, 8) * 55)
                  .duration(320)
                  .easing(EASE_STANDARD)}
                className="rounded-2xl px-3 py-3 mb-2"
                style={{
                  backgroundColor: playing ? pl.cover.bg : '#FAF9F6',
                  borderWidth: 1,
                  borderColor: playing ? song.color : 'transparent',
                }}
              >
                <View className="flex-row items-center" style={{ gap: 12 }}>
                  <Pressable
                    onPress={() => togglePlay(song)}
                    className="flex-1 flex-row items-center active:opacity-70"
                    style={{ gap: 12, minHeight: 44 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Play a snippet of ${song.title}`}
                  >
                    <MiniVinyl color={song.color} playing={playing} />
                    <View className="flex-1">
                      <Text
                        className="font-avantt-bold text-primary"
                        style={{ fontSize: 15 }}
                        numberOfLines={1}
                      >
                        {song.title}
                      </Text>
                      <Text className="text-body-3 text-secondary" numberOfLines={1}>
                        {song.artist}
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => jumpToChat(song)}
                    className="h-11 w-11 items-center justify-center active:opacity-60"
                    hitSlop={2}
                    accessibilityLabel={`Talk about ${song.title} in chat`}
                  >
                    <MessageCircle size={19} color="#8E8578" strokeWidth={1.9} />
                  </Pressable>
                  <Pressable
                    onPress={() => react(song)}
                    className="h-11 w-11 items-center justify-center active:opacity-60"
                    hitSlop={2}
                    accessibilityLabel={iReacted ? `Remove your reaction to ${song.title}` : `React to ${song.title}`}
                  >
                    <Heart
                      size={20}
                      color={iReacted ? '#E85C82' : '#8E8578'}
                      fill={iReacted ? '#E85C82' : 'transparent'}
                      strokeWidth={1.9}
                    />
                    {mentorReacted && (
                      <Image
                        source={{ uri: mentor.avatar }}
                        style={{
                          position: 'absolute',
                          right: 1,
                          bottom: 3,
                          width: 15,
                          height: 15,
                          borderRadius: 8,
                          borderWidth: 1.5,
                          borderColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </Pressable>
                </View>
                {playing && <SnippetProgress color={song.color} />}
              </Animated.View>
            );
          })}
        </View>

        {!mine && (
          <Text className="text-body-3 text-tertiary text-center mt-3 px-8">
            {mentor.name} made this during their setup — react to a song and
            they&apos;ll see it.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
