import { ForYouCards } from '@/components/hub/for-you-cards';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { HubName } from '@/components/hub/hub-name';
import { MomentCard } from '@/components/hub/moment-card';
import { NoteCard } from '@/components/hub/note-card';
import { PlaylistCard } from '@/components/hub/playlist-card';
import { StoryCard } from '@/components/hub/story-card';
import { SwapCard } from '@/components/hub/swap-card';
import { PressableScale } from '@/components/ui/pressable-scale';
import { type HubEntity } from '@/data/hub-entities';
import { hubPhotos, mentor } from '@/data/mock';
import { CALM_TOOLS, MENTOR_TOOLS, SELFCARE_TOOLS, type SelfcareTool } from '@/data/selfcare-tools';
import { ToolGlyph } from '@/components/proto/tool-glyphs';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { getRecommendation } from '@/lib/recommendation';
import { useNavStore } from '@/stores/nav-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { useAppStore } from '@/stores/app-store';
import { useHubStore } from '@/stores/hub-store';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Moon, Sparkles, SquarePen } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * THE single tool surface, as two views behind a floating pill switch:
 *  - Home: intention header ("today I will …"), featured carousel of recent
 *    artifacts, compact icon+label cards for every tool and activity
 *  - Journey: everything the pair has made (the artifact grid)
 * Styled to the "U cooking" mock: icy gradient sky, big left-aligned hub
 * name, week strip, highlighter-swiped intention, white cards, ink-sketch
 * glyphs. The crisis link stays pinned below the pill — never buried.
 */

const SKY = ['#EAF1FC', '#F7FAFF'] as const;

// Card rotation pattern by grid position, from mono/link-v2
// src/components/shared/grid/index.tsx — cycles per row.
const ROTATIONS: [number, number][] = [
  [-4, 2],
  [3, -2],
  [-2, 4],
];

const CARD_SHADOW = {
  shadowColor: '#2B3A55',
  shadowOpacity: 0.07,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 5 },
  elevation: 2,
} as const;

/** The mock's little sand-colored bar under titles */
function LabelBar({ width = 56 }: { width?: number }) {
  return (
    <View
      style={{
        width,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#E8E2D2',
        marginTop: 9,
      }}
    />
  );
}

const MENTOR_ACTIVITIES = [
  'Our playlist',
  'Make a story',
  '20 questions',
  'Draw together',
  'Sound check',
];

/** Labels & subtitle tags for activities */
const SHORT_LABELS: Record<string, string> = {
  breathe: 'Breathe',
  vent: 'Journal',
  ground: 'Grounding',
  not_alone: 'Confession',
  paint: 'Paint',
  calm_deck: 'Calm cards',
  star: 'Star trace',
};

const ACTIVITY_METAS: Record<string, { label: string; sub: string }> = {
  breathe: { label: 'Breathe', sub: '2 min · Reset' },
  vent: { label: 'Journal', sub: 'Prompt · Free' },
  ground: { label: 'Grounding', sub: '5-4-3-2-1' },
  not_alone: { label: 'Confession', sub: 'Shared' },
  paint: { label: 'Paint', sub: 'Keepsake' },
  calm_deck: { label: 'Calm cards', sub: 'Pocket deck' },
  star: { label: 'Star trace', sub: 'Focus' },
  playlist: { label: 'Playlists', sub: 'Co-op vinyl' },
  questions: { label: 'Questions', sub: 'Check-in' },
  boards: { label: 'Boards', sub: 'Vision pin' },
  story: { label: 'Story', sub: 'Reel' },
  connect: { label: 'Cards', sub: 'Deep talks' },
  hot_takes: { label: 'Hot takes', sub: 'Quick votes' },
};

interface GridItem {
  id: string;
  label: string;
  sub?: string;
  glyph: string;
  soon?: boolean;
  onPress?: () => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// A soft daily intention, keyed to the weekday — swap for real content later
const INTENTIONS = [
  'let today be slow',
  'show up anyway',
  'be soft with myself',
  'go with the flow',
  'notice the good bits',
  'ask for what I need',
  'take the long way',
];

function WeekStrip() {
  const today = new Date().getDay();
  return (
    <View className="flex-row items-center mt-2.5" style={{ gap: 8 }}>
      {DAYS.map((d, i) => {
        const isToday = i === today;
        return (
          <View
            key={i}
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isToday ? '#1F1E1D' : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: 'GeistMono-Medium',
                fontSize: 12,
                letterSpacing: 0.5,
                color: isToday ? '#FFFFFF' : '#8E94A5',
              }}
            >
              {d}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/** "today I will / {intention}" with a marker-swipe highlight behind it */
function Intention({
  intentionIndex,
  onCycle,
}: {
  intentionIndex: number;
  onCycle: () => void;
}) {
  const line = INTENTIONS[intentionIndex % INTENTIONS.length];
  return (
    <PressableScale
      scaleTo={0.97}
      onPress={onCycle}
      className="items-center mt-6 active:opacity-90"
    >
      <View className="flex-row items-center" style={{ gap: 6 }}>
        <Text className="text-body-2 text-secondary">today I will</Text>
        <Sparkles size={13} color="#C2DF4F" strokeWidth={2.4} />
      </View>
      <View className="items-center justify-center mt-1">
        {/* the highlighter swipe */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: -14,
            right: -20,
            height: 22,
            bottom: 6,
            borderRadius: 4,
            backgroundColor: '#C2DF4F',
            opacity: 0.6,
            transform: [{ rotate: '-1.4deg' }],
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: -26,
            bottom: -2,
            width: 46,
            height: 12,
            borderRadius: 3,
            backgroundColor: '#C2DF4F',
            opacity: 0.45,
            transform: [{ rotate: '24deg' }],
          }}
        />
        <Text className="font-avantt-bold text-primary" style={{ fontSize: 32, lineHeight: 38 }}>
          {line}
        </Text>
      </View>
    </PressableScale>
  );
}

/** Outlined vinyl for playlist carousel items, like the mock's circle */
function VinylOutline({ size }: { size: number }) {
  return (
    <Svg viewBox="0 0 64 64" width={size} height={size}>
      <Circle cx="32" cy="32" r="29" stroke="#1F1E1D" strokeWidth={2.4} fill="none" />
      <Circle cx="32" cy="32" r="6" stroke="#1F1E1D" strokeWidth={2.2} fill="none" opacity={0.6} />
    </Svg>
  );
}

function entityTitle(e: HubEntity): string {
  if (e.playlist) return e.playlist.title;
  if (e.note) return e.note.content.split('\n')[0];
  if (e.moment) return e.moment.caption ?? 'a moment';
  if (e.swap) return e.swap.promptTitle;
  if (e.story) return e.story.images[0]?.header ?? 'a story';
  return 'something you made';
}

function entityThumb(e: HubEntity): string | null {
  if (e.moment) return e.moment.images[0] ?? null;
  if (e.swap) return e.swap.mentorPhoto;
  if (e.story) return e.story.images[0]?.url ?? null;
  return null;
}

function EmptyMoments() {
  return (
    <View className="items-center justify-center py-10">
      <Image
        source={Scribbles.yellowOval}
        style={{ width: 220, height: 200 }}
        contentFit="contain"
      />
      <Text className="text-header-4 text-primary absolute text-center px-10">
        Your shared moments live here
      </Text>
    </View>
  );
}

function HubItem({
  entity,
  index,
  width,
  height,
  onPress,
}: {
  entity: HubEntity;
  index: number;
  width: number;
  height: number;
  onPress: () => void;
}) {
  const row = Math.floor(index / 2);
  const rotation = ROTATIONS[row % ROTATIONS.length][index % 2];

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 6) * 45).duration(240)}
      style={{ width: '50%' }}
    >
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 22,
          transform: [{ rotate: `${rotation}deg` }],
        }}
      >
        <PressableScale scaleTo={0.96} onPress={onPress} className="active:opacity-90">
          {entity.entityType === 'note' ? (
            <NoteCard entity={entity} width={width} height={height} />
          ) : entity.entityType === 'moment' ? (
            <MomentCard entity={entity} width={width} height={height} />
          ) : entity.entityType === 'story' ? (
            <StoryCard entity={entity} width={width} height={height} />
          ) : entity.entityType === 'playlist' ? (
            <PlaylistCard entity={entity} width={width} height={height} />
          ) : (
            <SwapCard entity={entity} width={width} height={height} />
          )}
        </PressableScale>
      </View>
    </Animated.View>
  );
}

export function HubTab({ active = false }: { active?: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [view, setView] = useState<'home' | 'journey'>('home');
  const [intentionIdx, setIntentionIdx] = useState(() => new Date().getDay());
  const cycleIntention = () => {
    buzz.tick();
    setIntentionIdx(i => (i + 1) % INTENTIONS.length);
  };
  const [journeyFilter, setJourneyFilter] = useState<'all' | 'moment' | 'note' | 'swap' | 'playlist'>('all');

  // Launcher toggles pick which tool set the Hub offers (mutually exclusive)
  const mentalHealthTools = useScenarioStore(s => s.mentalHealthTools);
  const mentorTools = useScenarioStore(s => s.mentorTools);
  const tools = mentorTools ? MENTOR_TOOLS : mentalHealthTools ? CALM_TOOLS : SELFCARE_TOOLS;

  // Swappable stub — a real recommendation system replaces getRecommendation().
  const [rec, setRec] = useState(() =>
    getRecommendation({
      calmSet: useScenarioStore.getState().mentalHealthTools,
      mentorSet: useScenarioStore.getState().mentorTools,
    }),
  );
  useEffect(() => {
    if (active) setRec(getRecommendation({ calmSet: mentalHealthTools, mentorSet: mentorTools }));
  }, [active, mentalHealthTools, mentorTools]);

  // Pointer/tool-exit visits are tracked by requestHub itself; here we track
  // plain arrivals, skipping activations a fresh request just caused.
  useEffect(() => {
    if (!active) return;
    const req = useNavStore.getState().hubRequest;
    if (!req || Date.now() - req.at > 1500) {
      track('hub_opened', { source: 'home_entry' });
    }
    if (rec) track('recommendation_shown', { tool: rec.tool.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const openTool = (tool: SelfcareTool, wasRecommended: boolean) => {
    if (wasRecommended) track('recommendation_tapped', { tool: tool.id });
    track('hub_tool_opened', { tool: tool.id, was_recommended: wasRecommended });
    router.push(tool.route);
  };
  const hubSwaps = useAppStore(s => s.hubSwaps);
  const swap = useAppStore(s => s.swap);
  const storedEntities = useHubStore(s => s.entities);

  // Real app: base card 140×200 scaled to (screenWidth/2 - 56) / 140.
  const cardWidth = screenWidth / 2 - 56;
  const cardHeight = (cardWidth / 140) * 200;

  // Swaps completed in the prototype's flow, newest first, ahead of fixtures.
  const entities = useMemo<HubEntity[]>(
    () => [
      ...hubSwaps.map<HubEntity>(s => ({
        id: s.id,
        entityType: 'swap',
        owner: { name: mentor.name, avatar: mentor.avatar, role: 'mentor' },
        createdAt: 'Today',
        swap: {
          promptId: 'take-me-back',
          promptTitle: s.promptTitle,
          mentorPhoto: s.mentorPhoto,
          teenPhoto: s.teenPhoto ?? hubPhotos.teenOld,
          revealed: true,
        },
      })),
      ...storedEntities,
    ],
    [hubSwaps, storedEntities],
  );

  const filteredEntities = useMemo(() => {
    if (journeyFilter === 'all') return entities;
    if (journeyFilter === 'moment') return entities.filter(e => e.entityType === 'moment');
    if (journeyFilter === 'note') return entities.filter(e => e.entityType === 'note');
    if (journeyFilter === 'playlist') return entities.filter(e => e.entityType === 'playlist');
    if (journeyFilter === 'swap') return entities.filter(e => e.entityType === 'swap');
    return entities;
  }, [entities, journeyFilter]);

  const openEntity = (entity: HubEntity) => {
    if (entity.entityType === 'note') router.push(`/hub/note/${entity.id}`);
    else if (entity.entityType === 'moment') router.push(`/hub/moment/${entity.id}`);
    else if (entity.entityType === 'story') router.push(`/hub/story/${entity.id}`);
    else if (entity.entityType === 'playlist') router.push(`/hub/playlist/${entity.id}`);
    else if (hubSwaps.some(s => s.id === entity.id)) router.push(`/hub/swap/${entity.id}`);
    else router.push(`/hub/moment/${entity.id}`);
  };

  /* ---------------------- featured carousel (home) ---------------------- */
  const featured = useMemo(() => entities.slice(0, 4), [entities]);
  const [page, setPage] = useState(0);
  const carouselW = screenWidth - 40;
  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (carouselW + 12));
    if (i !== page) setPage(i);
  };
  const featuredCount = featured.length + (rec && rec.tool.id !== 'breathe' ? 1 : 0);

  /* ------------------------- compact tool grid -------------------------- */
  const gridItems = useMemo<GridItem[]>(() => {
    const items: GridItem[] = tools
      .filter(t => t.id !== 'breathe')
      .map(t => ({
        id: t.id,
        label: ACTIVITY_METAS[t.id]?.label ?? (SHORT_LABELS[t.id] ?? t.label),
        sub: ACTIVITY_METAS[t.id]?.sub,
        glyph: t.id,
        onPress: () => openTool(t, false),
      }));
    const push = (item: GridItem) => {
      if (!items.some(i => i.id === item.id)) items.push(item);
    };
    const go = (id: string, route: Parameters<typeof router.push>[0]) => () => {
      track('hub_activity_opened', { activity: id });
      router.push(route);
    };
    push({ id: 'playlist', label: 'Playlists', sub: 'Co-op vinyl', glyph: 'playlist', onPress: go('playlist', '/hub/create-playlist') });
    push({ id: 'questions', label: 'Questions', sub: 'Check-in', glyph: 'questions', onPress: go('questions', '/know/questions') });
    push({ id: 'boards', label: 'Boards', sub: 'Vision pin', glyph: 'boards', onPress: go('boards', '/know/boards') });
    push({ id: 'story', label: 'Story', sub: 'Reel', glyph: 'story', onPress: go('story', '/know/story') });
    push({ id: 'connect', label: 'Cards', sub: 'Deep talks', glyph: 'calm_deck', soon: true });
    push({ id: 'hot_takes', label: 'Hot takes', sub: 'Quick votes', glyph: 'hot_takes', soon: true });
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tools]);

  const ollesVersion = useScenarioStore(s => s.ollesVersion);
  const setOllesVersion = useScenarioStore(s => s.setOllesVersion);

  const switchView = (v: 'home' | 'journey') => {
    if (v === view) return;
    buzz.tick();
    track('hub_view_changed', { view: v });
    setView(v);
  };

  if (!ollesVersion) {
    return (
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 96, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between px-5">
            <HubName />
            <PressableScale
              scaleTo={0.94}
              onPress={() => {
                buzz.tick();
                setOllesVersion(true);
              }}
              className="flex-row items-center rounded-full px-3 py-1.5 border border-[#DED9CE] bg-[#F4F2EE]"
              style={{ gap: 5 }}
            >
              <Sparkles size={11} color="#8A857C" />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'GeistMono-Medium',
                  color: '#6A655F',
                }}
              >
                Olle's version: OFF
              </Text>
            </PressableScale>
          </View>

          {/* Recommended slot — hidden unless getRecommendation() has one */}
          {rec && (
            <View className="px-5 mt-5">
              <PressableScale
                scaleTo={0.97}
                onPress={() => openTool(rec.tool, true)}
                className="rounded-3xl px-5 py-5 overflow-hidden"
                style={{
                  backgroundColor: rec.tool.bg,
                  borderWidth: 1.5,
                  borderColor: rec.tool.scribbleTint,
                }}
              >
                <Image
                  source={rec.tool.scribble}
                  style={{
                    position: 'absolute',
                    right: -34,
                    top: -20,
                    width: 130,
                    height: 130,
                    opacity: 0.3,
                    transform: [{ rotate: '-12deg' }],
                  }}
                  contentFit="contain"
                  tintColor={rec.tool.scribbleTint}
                />
                <View
                  style={{ position: 'absolute', right: 18, top: '50%', marginTop: -4 }}
                  pointerEvents="none"
                >
                  <ToolGlyph id={rec.tool.id} size={44} color={rec.tool.glyphColor} rotate={-9} />
                </View>
                <Text
                  className="text-tertiary"
                  style={{ fontFamily: 'GeistMono-Medium', fontSize: 10, letterSpacing: 1.5 }}
                >
                  FOR RIGHT NOW
                </Text>
                <Text className="font-avantt-bold text-primary mt-1.5" style={{ fontSize: 22, paddingRight: 60 }}>
                  {rec.tool.label}
                </Text>
                <Text className="text-body-3 text-secondary mt-1" style={{ paddingRight: 60 }}>{rec.line}</Text>
              </PressableScale>
            </View>
          )}

          {/* Tools — every tool, always here, ≤2 taps from home */}
          <Text className="font-avantt-bold text-primary px-5 mt-6" style={{ fontSize: 19 }}>
            Tools
          </Text>
          <View className="flex-row flex-wrap px-5 mt-3" style={{ gap: 12 }}>
            {tools.map(tool => (
              <View key={tool.id} style={{ width: '48%' }}>
                <PressableScale
                  scaleTo={0.97}
                  onPress={() => openTool(tool, false)}
                  className="rounded-3xl px-4 py-4 overflow-hidden justify-end"
                  style={{ minHeight: 148, backgroundColor: tool.bg }}
                >
                  <Image
                    source={tool.scribble}
                    style={{
                      position: 'absolute',
                      right: -38,
                      top: -24,
                      width: 120,
                      height: 120,
                      opacity: 0.3,
                      transform: [{ rotate: '-12deg' }],
                    }}
                    contentFit="contain"
                    tintColor={tool.scribbleTint}
                  />
                  <ToolGlyph id={tool.id} size={34} color={tool.glyphColor} />
                  <Text
                    className="font-avantt-bold text-primary mt-1.5"
                    style={{ fontSize: 17, lineHeight: 20 }}
                  >
                    {tool.label}
                  </Text>
                  <Text className="text-secondary mt-1" style={{ fontSize: 12.5, lineHeight: 16 }}>
                    {tool.sub}
                  </Text>
                </PressableScale>
              </View>
            ))}
          </View>

          {/* With {mentor} — future shared activities */}
          <Text className="font-avantt-bold text-primary px-5 mt-7" style={{ fontSize: 19 }}>
            With {mentor.name}
          </Text>
          <View className="flex-row flex-wrap px-5 mt-3" style={{ gap: 10 }}>
            {MENTOR_ACTIVITIES.map(label => (
              <View
                key={label}
                className="rounded-full border px-4 items-center justify-center flex-row"
                style={{
                  minHeight: 44,
                  gap: 8,
                  backgroundColor: '#F7F5F1',
                  borderColor: '#EBE7DF',
                }}
                accessibilityState={{ disabled: true }}
              >
                <Text className="font-avantt-bold" style={{ fontSize: 14, color: '#A9A29A' }}>
                  {label}
                </Text>
                <Text
                  style={{
                    fontFamily: 'GeistMono-Medium',
                    fontSize: 9,
                    letterSpacing: 1,
                    color: '#C0BAB1',
                  }}
                >
                  SOON
                </Text>
              </View>
            ))}
          </View>

          <ForYouCards />

          {swap && swap.status !== 'revealed' && (
            <PressableScale
              scaleTo={0.97}
              onPress={() => router.push(`/hub/swap/${swap.id}`)}
              className="mx-5 mt-6 flex-row items-center justify-between rounded-2xl bg-surfaces-z3 px-5 py-4 active:opacity-70"
            >
              <View>
                <Text className="text-body-2 text-primary">
                  {swap.status === 'ready' ? 'Swap ready' : 'New swap from your mentor'}
                </Text>
                <Text className="text-caption-1 text-tertiary mt-0.5">
                  {swap.promptTitle}
                </Text>
              </View>
              <Image
                source={{ uri: mentor.avatar }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            </PressableScale>
          )}

          {entities.length === 0 ? (
            <EmptyMoments />
          ) : (
            <View className="mt-4 flex-row flex-wrap px-4">
              {entities.map((entity, i) => (
                <HubItem
                  key={entity.id}
                  entity={entity}
                  index={i}
                  width={cardWidth}
                  height={cardHeight}
                  onPress={() => openEntity(entity)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Crisis link */}
        <View className="bg-white" style={{ paddingTop: 6, paddingBottom: Math.max(insets.bottom, 10) }}>
          <TalkNowLink screen="hub" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <LinearGradient
        colors={[...SKY]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {view === 'home' ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 96, paddingBottom: 170 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 flex-row items-start justify-between">
            <View>
              <HubName hero />
              <WeekStrip />
            </View>
            <PressableScale
              scaleTo={0.94}
              onPress={() => {
                buzz.tick();
                setOllesVersion(false);
              }}
              className="flex-row items-center rounded-full px-2.5 py-1 border border-[#1F1E1D] bg-[#1F1E1D] mt-2"
              style={{ gap: 4 }}
            >
              <Sparkles size={10} color="#FDE047" />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'GeistMono-Medium',
                  color: '#FFFFFF',
                }}
              >
                Olle's: ON
              </Text>
            </PressableScale>
          </View>

          <Intention intentionIndex={intentionIdx} onCycle={cycleIntention} />

          {/* Featured — the latest things worth opening, one card at a time */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={carouselW + 12}
            decelerationRate="fast"
            onScroll={onCarouselScroll}
            scrollEventThrottle={16}
            className="mt-7"
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {rec && rec.tool.id !== 'breathe' && (
              <PressableScale
                scaleTo={0.98}
                onPress={() => openTool(rec.tool, true)}
                className="rounded-[28px] bg-white px-6 justify-center"
                style={{
                  width: carouselW,
                  height: 154,
                  borderWidth: 1.5,
                  borderColor: '#E6E9F0',
                  ...CARD_SHADOW,
                }}
              >
                <View className="flex-row items-center" style={{ gap: 18 }}>
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: '#F4FBE8' }}
                  >
                    <ToolGlyph id={rec.tool.id} size={42} color="#1F1E1D" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center" style={{ gap: 6 }}>
                      <View className="bg-[#1F1E1D] px-2 py-0.5 rounded-full">
                        <Text
                          style={{
                            fontFamily: 'GeistMono-Medium',
                            fontSize: 9,
                            letterSpacing: 1.2,
                            color: '#FFFFFF',
                          }}
                        >
                          FOR RIGHT NOW
                        </Text>
                      </View>
                      <Sparkles size={11} color="#C2DF4F" />
                    </View>
                    <Text className="font-avantt-bold text-primary mt-1.5" style={{ fontSize: 21 }}>
                      {rec.tool.label}
                    </Text>
                    <LabelBar />
                  </View>
                </View>
              </PressableScale>
            )}
            {featured.map(e => {
              const thumb = entityThumb(e);
              const isPlaylist = e.entityType === 'playlist';
              const isMoment = e.entityType === 'moment' || e.entityType === 'swap';
              const tag = isPlaylist ? 'SHARED PLAYLIST' : isMoment ? 'PHOTO MOMENT' : 'JOURNAL NOTE';

              return (
                <PressableScale
                  key={e.id}
                  scaleTo={0.98}
                  onPress={() => openEntity(e)}
                  className="rounded-[28px] bg-white px-6 justify-center"
                  style={{
                    width: carouselW,
                    height: 154,
                    borderWidth: 1.5,
                    borderColor: '#EAEBF0',
                    ...CARD_SHADOW,
                  }}
                >
                  <View className="flex-row items-center" style={{ gap: 18 }}>
                    {isPlaylist ? (
                      <VinylOutline size={66} />
                    ) : thumb ? (
                      <Image
                        source={{ uri: thumb }}
                        style={{
                          width: 66,
                          height: 66,
                          borderRadius: 14,
                          borderWidth: 2,
                          borderColor: '#FFFFFF',
                          transform: [{ rotate: '-3deg' }],
                        }}
                        contentFit="cover"
                      />
                    ) : (
                      <View
                        className="w-16 h-16 rounded-2xl items-center justify-center"
                        style={{ backgroundColor: '#FDF7EB' }}
                      >
                        <ToolGlyph id="vent" size={40} color="#1F1E1D" />
                      </View>
                    )}
                    <View className="flex-1">
                      <View className="flex-row items-center" style={{ gap: 6 }}>
                        <Text
                          style={{
                            fontFamily: 'GeistMono-Medium',
                            fontSize: 9.5,
                            letterSpacing: 1.2,
                            color: '#8E8578',
                          }}
                        >
                          {tag}
                        </Text>
                        <Text style={{ fontSize: 9, color: '#C0B8AD' }}>·</Text>
                        <Text
                          style={{
                            fontFamily: 'GeistMono-Medium',
                            fontSize: 9.5,
                            color: '#8E8578',
                          }}
                        >
                          {e.createdAt ?? 'RECENT'}
                        </Text>
                      </View>
                      <Text
                        className="font-avantt-bold text-primary mt-1"
                        style={{ fontSize: 20, lineHeight: 24 }}
                        numberOfLines={2}
                      >
                        {entityTitle(e)}
                      </Text>
                      <LabelBar />
                    </View>
                  </View>
                </PressableScale>
              );
            })}
          </ScrollView>
          <View className="flex-row justify-center mt-4" style={{ gap: 7 }}>
            {Array.from({ length: featuredCount }, (_, i) => (
              <View
                key={i}
                style={{
                  width: i === page ? 10 : 7,
                  height: i === page ? 10 : 7,
                  borderRadius: 5,
                  backgroundColor: i === page ? '#1F1E1D' : 'rgba(31,30,29,0.18)',
                }}
              />
            ))}
          </View>

          {/* Every tool + activity, compact icon-and-label cards */}
          <View className="flex-row flex-wrap px-5 mt-7" style={{ gap: 12 }}>
            {gridItems.map(item => (
              <View key={item.id} style={{ width: '48%' }}>
                <PressableScale
                  scaleTo={0.97}
                  onPress={() => {
                    if (item.soon) return;
                    item.onPress?.();
                  }}
                  className="rounded-[22px] bg-white px-4 py-3.5"
                  style={{
                    minHeight: 80,
                    borderWidth: 1.5,
                    borderColor: 'rgba(43, 58, 85, 0.05)',
                    ...CARD_SHADOW,
                    opacity: item.soon ? 0.55 : 1,
                  }}
                  accessibilityState={item.soon ? { disabled: true } : undefined}
                >
                  <View className="flex-row items-center justify-between">
                    <ToolGlyph id={item.glyph} size={30} color="#1F1E1D" />
                    {item.soon && (
                      <Text
                        style={{
                          fontFamily: 'GeistMono-Medium',
                          fontSize: 8.5,
                          letterSpacing: 1,
                          color: '#A9A29A',
                        }}
                      >
                        SOON
                      </Text>
                    )}
                  </View>
                  <View className="mt-2.5">
                    <Text
                      className="font-avantt-bold text-primary"
                      style={{ fontSize: 16.5, lineHeight: 20 }}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    {item.sub && (
                      <Text
                        className="mt-0.5"
                        style={{
                          fontFamily: 'GeistMono-Medium',
                          fontSize: 10,
                          letterSpacing: 0.2,
                          color: '#928D83',
                        }}
                        numberOfLines={1}
                      >
                        {item.sub}
                      </Text>
                    )}
                  </View>
                </PressableScale>
              </View>
            ))}
          </View>

          {/* With {mentor} — tactile folder peek into Journey */}
          <View className="px-5 mt-9">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-avantt-bold text-primary" style={{ fontSize: 20 }}>
                With {mentor.name}
              </Text>
              <Pressable
                onPress={() => switchView('journey')}
                className="flex-row items-center active:opacity-60"
                hitSlop={8}
              >
                <Text
                  style={{
                    fontFamily: 'GeistMono-Medium',
                    fontSize: 11,
                    letterSpacing: 0.5,
                    color: '#5C5446',
                  }}
                >
                  VIEW ALL
                </Text>
                <ChevronRight size={14} color="#5C5446" strokeWidth={2} />
              </Pressable>
            </View>

            <PressableScale
              scaleTo={0.98}
              onPress={() => switchView('journey')}
              className="rounded-[26px] bg-white px-5 py-4 overflow-visible"
              style={{
                borderWidth: 1.5,
                borderColor: '#E8E2D5',
                backgroundColor: '#FAF7F0',
                ...CARD_SHADOW,
              }}
            >
              {/* Physical folder tab sticking out at the top */}
              <View
                style={{
                  position: 'absolute',
                  top: -11,
                  left: 20,
                  backgroundColor: '#EBE4D5',
                  paddingHorizontal: 12,
                  paddingVertical: 2,
                  borderTopLeftRadius: 7,
                  borderTopRightRadius: 7,
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: '#DDD6C6',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'GeistMono-Medium',
                    fontSize: 9.5,
                    letterSpacing: 1,
                    color: '#6F6759',
                  }}
                >
                  YOUR KEEPSAKES
                </Text>
              </View>

              <View className="flex-row items-center" style={{ gap: 14 }}>
                <View style={{ width: 68, height: 60, justifyContent: 'center' }}>
                  {featured.slice(0, 3).map((e, i) => {
                    const thumb = entityThumb(e);
                    const rotation = i === 0 ? '-7deg' : i === 1 ? '5deg' : '0deg';
                    return thumb ? (
                      <Image
                        key={e.id}
                        source={{ uri: thumb }}
                        style={{
                          position: 'absolute',
                          left: i * 14,
                          top: i * 3,
                          width: 44,
                          height: 50,
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: '#FFFFFF',
                          transform: [{ rotate: rotation }],
                          shadowColor: '#000',
                          shadowOpacity: 0.14,
                          shadowRadius: 4,
                        }}
                        contentFit="cover"
                      />
                    ) : (
                      <View
                        key={e.id}
                        style={{
                          position: 'absolute',
                          left: i * 14,
                          top: i * 3,
                          width: 44,
                          height: 50,
                          borderRadius: 8,
                          backgroundColor: i === 0 ? '#EFE9DC' : '#FAF3E5',
                          borderWidth: 2,
                          borderColor: '#FFFFFF',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: [{ rotate: rotation }],
                          shadowColor: '#000',
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                        }}
                      >
                        <ToolGlyph id="vent" size={20} color="#1F1E1D" />
                      </View>
                    );
                  })}
                </View>
                <View className="flex-1">
                  <Text className="font-avantt-bold text-primary" style={{ fontSize: 16.5 }}>
                    Everything you two made
                  </Text>
                  <Text className="text-body-3 text-secondary mt-0.5">
                    {entities.length} shared memories and counting
                  </Text>
                </View>
                <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#EFE9DB' }}
                >
                  <ChevronRight size={18} color="#1F1E1D" strokeWidth={2.2} />
                </View>
              </View>
            </PressableScale>
          </View>
        </ScrollView>
      ) : (
        /* ------------------------------ journey ----------------------------- */
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 96, paddingBottom: 170 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="font-avantt-bold text-primary px-5" style={{ fontSize: 30 }}>
            Your journey
          </Text>
          <Text className="text-body-2 text-secondary px-5 mt-1">
            Everything you and {mentor.name} have made, in order.
          </Text>

          {/* Category filter pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginTop: 16 }}
          >
            {(
              [
                { id: 'all', label: `All (${entities.length})` },
                { id: 'moment', label: 'Moments' },
                { id: 'note', label: 'Notes' },
                { id: 'playlist', label: 'Playlists' },
                { id: 'swap', label: 'Swaps' },
              ] as const
            ).map(f => {
              const activeFilter = journeyFilter === f.id;
              return (
                <Pressable
                  key={f.id}
                  onPress={() => {
                    buzz.tick();
                    setJourneyFilter(f.id);
                  }}
                  className="rounded-full px-4 py-2"
                  style={{
                    backgroundColor: activeFilter ? '#1F1E1D' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: activeFilter ? '#1F1E1D' : '#E8E2D5',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'GeistMono-Medium',
                      fontSize: 12,
                      color: activeFilter ? '#FFFFFF' : '#6A6356',
                    }}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ForYouCards />

          {swap && swap.status !== 'revealed' && (
            <PressableScale
              scaleTo={0.97}
              onPress={() => router.push(`/hub/swap/${swap.id}`)}
              className="mx-5 mt-6 flex-row items-center justify-between rounded-2xl bg-white px-5 py-4 active:opacity-70"
              style={CARD_SHADOW}
            >
              <View>
                <Text className="text-body-2 text-primary">
                  {swap.status === 'ready' ? 'Swap ready' : 'New swap from your mentor'}
                </Text>
                <Text className="text-caption-1 text-tertiary mt-0.5">
                  {swap.promptTitle}
                </Text>
              </View>
              <Image
                source={{ uri: mentor.avatar }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            </PressableScale>
          )}

          {filteredEntities.length === 0 ? (
            <EmptyMoments />
          ) : (
            <View className="mt-2 flex-row flex-wrap px-4">
              {filteredEntities.map((entity, i) => (
                <HubItem
                  key={entity.id}
                  entity={entity}
                  index={i}
                  width={cardWidth}
                  height={cardHeight}
                  onPress={() => openEntity(entity)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Floating Home | Journey pill + the Hub's pinned crisis link */}
      <View
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' }}
        pointerEvents="box-none"
      >
        {/* fade so the pill + crisis link stay legible over scrolled content */}
        <LinearGradient
          colors={['rgba(247,250,255,0)', '#F7FAFF', '#F7FAFF']}
          style={{ position: 'absolute', left: 0, right: 0, top: -24, bottom: 0 }}
          pointerEvents="none"
        />
        <Animated.View
          entering={FadeIn.duration(300)}
          className="flex-row rounded-full"
          style={{
            backgroundColor: '#F3EFE4',
            padding: 5,
            gap: 4,
            shadowColor: '#2B3A55',
            shadowOpacity: 0.14,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          {(
            [
              { key: 'home', label: 'Home', Icon: SquarePen },
              { key: 'journey', label: 'Journey', Icon: Moon },
            ] as const
          ).map(({ key, label, Icon }) => {
            const activeTab = view === key;
            return (
              <Pressable
                key={key}
                onPress={() => switchView(key)}
                className="items-center justify-center rounded-full"
                style={{
                  minWidth: 92,
                  minHeight: 54,
                  backgroundColor: activeTab ? '#E5DFCE' : 'transparent',
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab }}
              >
                <Icon size={19} color={activeTab ? '#1F1E1D' : '#8E8578'} strokeWidth={2} />
                <Text
                  className="font-avantt-bold"
                  style={{ fontSize: 12.5, marginTop: 2, color: activeTab ? '#1F1E1D' : '#8E8578' }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
        <View
          style={{
            alignSelf: 'stretch',
            paddingTop: 4,
            paddingBottom: Math.max(insets.bottom, 10),
          }}
        >
          <TalkNowLink screen="hub" />
        </View>
      </View>
    </View>
  );
}
