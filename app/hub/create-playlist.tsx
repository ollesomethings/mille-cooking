import { ConfettiBurst } from '@/components/proto/bursts';
import { PressableScale } from '@/components/ui/pressable-scale';
import { mentor, teen } from '@/data/mock';
import { MENTOR_BACK_AT } from '@/data/offline';
import {
  COVER_OPTIONS,
  SONG_CATALOG,
  type PlaylistCover,
  type PlaylistSong,
} from '@/data/playlists';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { Moodies } from '@/lib/scribbles';
import { useAppStore } from '@/stores/app-store';
import { useHubStore } from '@/stores/hub-store';
import { useNavStore } from '@/stores/nav-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Check, Plus, Search, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Teen playlist builder — 1–10 songs, a title, a cover. Not a playlist app:
 * the point is sharing your taste, so there are no private playlists and
 * the final CTA is "Send to {mentor}". Sending saves it to the hub (the
 * pair's taste history) and drops an event line in chat. Online, the mentor
 * reacts the way chat already simulates replies; offline, it honestly waits.
 */
const MAX_SONGS = 10;
const TITLE_IDEAS = ['3am songs', 'no skips', 'main character', 'my brain rn'];

export default function CreatePlaylist() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mentorOffline = useScenarioStore(s => s.mentorOffline);
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState<PlaylistCover>(COVER_OPTIONS[0]);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<PlaylistSong[]>([]);
  const [sent, setSent] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SONG_CATALOG;
    return SONG_CATALOG.filter(
      s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q),
    );
  }, [query]);

  const toggleSong = (song: PlaylistSong) => {
    setPicked(prev => {
      if (prev.some(s => s.id === song.id)) {
        buzz.tick();
        return prev.filter(s => s.id !== song.id);
      }
      if (prev.length >= MAX_SONGS) {
        buzz.tick();
        return prev;
      }
      buzz.light();
      return [...prev, song];
    });
  };

  const send = () => {
    if (picked.length === 0 || sent) return;
    buzz.success();
    const finalTitle = title.trim() || 'my taste, probably';
    const entityId = useHubStore.getState().addEntity({
      entityType: 'playlist',
      owner: { name: teen.name, avatar: teen.avatar, role: 'teen' },
      playlist: { title: finalTitle, cover, songs: picked, reactions: {} },
    });
    useAppStore
      .getState()
      .addSystemMessage(`You sent ${mentor.name} a playlist`, 'playlist-event', entityId);
    track('playlist_sent', { songs: picked.length, titled: !!title.trim() });

    // Online: the mentor notices, the way chat already simulates replies.
    // Offline: nothing arrives until they're really back.
    if (!mentorOffline) {
      const fav = picked[Math.floor(Math.random() * picked.length)];
      setTimeout(() => {
        useHubStore.getState().reactToSong(entityId, fav.id, 'mentor');
        useAppStore
          .getState()
          .pushMentorMessage(`JUST listened — ${fav.title} is such a good pick`);
      }, 3200);
    }
    setSent(true);
  };

  const exitToSpace = () => {
    useNavStore.getState().requestHub('tool_exit');
    if (router.canGoBack()) router.dismissAll();
    else router.replace('/');
  };

  /* ------------------------------- sent ------------------------------- */
  if (sent) {
    return (
      <View
        className="flex-1 bg-white px-6"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <View className="flex-1 items-center justify-center">
          <View className="items-center">
            <ConfettiBurst count={18} spread={180} duration={1000} />
            <Animated.View entering={ZoomIn.springify().damping(13)}>
              <View
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 12,
                  backgroundColor: cover.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ rotate: '-3deg' }],
                }}
              >
                <Image
                  source={Moodies[cover.moodie]}
                  style={{ width: 60, height: 60 }}
                  contentFit="contain"
                />
              </View>
            </Animated.View>
          </View>
          <Animated.Text
            entering={FadeInDown.delay(140).duration(400).easing(EASE_STANDARD)}
            className="font-avantt-bold text-primary text-center mt-6"
            style={{ fontSize: 28, lineHeight: 33 }}
          >
            Sent to {mentor.name}.
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(220).duration(400).easing(EASE_STANDARD)}
            className="text-body-2 text-secondary text-center mt-2"
            style={{ lineHeight: 21, maxWidth: 300 }}
          >
            {mentorOffline
              ? `They'll hear it when they're back at ${MENTOR_BACK_AT}. It's saved in your space too.`
              : "It's saved in your space too — your taste history, building up."}
          </Animated.Text>
        </View>
        <Animated.View entering={FadeIn.delay(400).duration(300)}>
          <Pressable
            onPress={exitToSpace}
            className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          >
            <Text className="text-body-2 text-white">Back to your space</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  /* ------------------------------ builder ------------------------------ */
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">New playlist</Text>
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
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title + cover */}
        <View className="px-5 flex-row items-center mt-2" style={{ gap: 14 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 10,
              backgroundColor: cover.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={Moodies[cover.moodie]}
              style={{ width: 44, height: 44 }}
              contentFit="contain"
            />
          </View>
          <View className="flex-1">
            <Text className="text-body-3 text-secondary mb-1.5">Name it</Text>
            <TextInput
              value={title}
              onChangeText={t => setTitle(t.slice(0, 28))}
              placeholder="my taste, probably"
              placeholderTextColor="#767676"
              className="font-avantt-bold text-primary"
              style={{
                fontSize: 19,
                minHeight: 48,
                borderBottomWidth: 1.5,
                borderBottomColor: '#E5E0D8',
                paddingVertical: 8,
              }}
            />
          </View>
        </View>

        {/* Title ideas + covers */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {TITLE_IDEAS.map(idea => (
            <Pressable
              key={idea}
              onPress={() => {
                buzz.tick();
                setTitle(idea);
              }}
              className="rounded-full border border-[#E5E0D8] px-4 items-center justify-center active:opacity-60"
              style={{ height: 44 }}
            >
              <Text
                style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 17, color: '#66615B' }}
              >
                {idea}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View className="flex-row px-5 mt-3" style={{ gap: 10 }}>
          {COVER_OPTIONS.map(opt => {
            const active = opt.moodie === cover.moodie;
            return (
              <Pressable
                key={opt.moodie}
                onPress={() => {
                  buzz.tick();
                  setCover(opt);
                }}
                className="items-center justify-center active:opacity-70"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 8,
                  backgroundColor: opt.bg,
                  borderWidth: 2,
                  borderColor: active ? '#1F1E1D' : 'transparent',
                }}
                accessibilityLabel={`Cover ${opt.moodie}`}
                accessibilityState={{ selected: active }}
              >
                <Image
                  source={Moodies[opt.moodie]}
                  style={{ width: 28, height: 28 }}
                  contentFit="contain"
                />
              </Pressable>
            );
          })}
        </View>

        {/* Song search */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between">
            <Text className="font-avantt-bold text-primary" style={{ fontSize: 17 }}>
              Add songs
            </Text>
            <Text
              className="text-tertiary"
              style={{ fontFamily: 'GeistMono-Medium', fontSize: 11, letterSpacing: 1 }}
            >
              {picked.length}/{MAX_SONGS}
            </Text>
          </View>
          <View
            className="flex-row items-center rounded-full bg-surfaces-z2 border border-surfaces-divider px-4 mt-2"
            style={{ height: 48, gap: 8 }}
          >
            <Search size={17} color="#8E8578" strokeWidth={2} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search songs or artists"
              placeholderTextColor="#767676"
              className="flex-1 text-body-2 text-primary"
              style={{ height: 48 }}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={10}>
                <X size={16} color="#8E8578" strokeWidth={2} />
              </Pressable>
            )}
          </View>
        </View>

        <View className="px-5 mt-3">
          {results.map(song => {
            const added = picked.some(s => s.id === song.id);
            const full = !added && picked.length >= MAX_SONGS;
            return (
              <Pressable
                key={song.id}
                onPress={() => toggleSong(song)}
                className="flex-row items-center rounded-2xl px-3 py-2.5 mb-1.5 active:opacity-70"
                style={{
                  gap: 12,
                  minHeight: 56,
                  backgroundColor: added ? '#F4FBE8' : '#FAF9F6',
                  opacity: full ? 0.45 : 1,
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: added, disabled: full }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: '#1F1E1D',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: song.color }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-avantt-bold text-primary" style={{ fontSize: 14.5 }} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text className="text-body-3 text-secondary" numberOfLines={1}>
                    {song.artist}
                  </Text>
                </View>
                <View
                  className="items-center justify-center rounded-full"
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: added ? '#5FA74B' : '#FFFFFF',
                    borderWidth: added ? 0 : 1,
                    borderColor: '#E5E0D8',
                  }}
                >
                  {added ? (
                    <Check size={15} color="#FFFFFF" strokeWidth={2.6} />
                  ) : (
                    <Plus size={15} color="#66615B" strokeWidth={2.2} />
                  )}
                </View>
              </Pressable>
            );
          })}
          {results.length === 0 && (
            <Text className="text-body-3 text-tertiary text-center py-6">
              Nothing with that name in the demo catalog — try another search.
            </Text>
          )}
          {picked.length >= MAX_SONGS && (
            <Text className="text-body-3 text-tertiary text-center mt-2">
              That&apos;s the cap — 10 songs says plenty about your taste.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Send — sharing IS the save; no private playlists */}
      <View
        className="px-5 bg-white"
        style={{ paddingTop: 8, paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <PressableScale
          scaleTo={0.97}
          onPress={send}
          className="h-14 items-center justify-center rounded-full"
          style={{
            backgroundColor: picked.length > 0 ? '#1F1E1D' : '#E9E6E0',
          }}
        >
          <Text
            className="text-body-2"
            style={{ color: picked.length > 0 ? '#FFFFFF' : '#8E8578' }}
          >
            {picked.length === 0 ? 'Pick at least one song' : `Send to ${mentor.name}`}
          </Text>
        </PressableScale>
      </View>
    </View>
  );
}
