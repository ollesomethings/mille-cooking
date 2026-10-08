import { ForYouCards } from '@/components/hub/for-you-cards';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { HubName } from '@/components/hub/hub-name';
import { MomentCard } from '@/components/hub/moment-card';
import { NoteCard } from '@/components/hub/note-card';
import { StoryCard } from '@/components/hub/story-card';
import { SwapCard } from '@/components/hub/swap-card';
import { PressableScale } from '@/components/ui/pressable-scale';
import { type HubEntity } from '@/data/hub-entities';
import { hubPhotos, mentor } from '@/data/mock';
import { CALM_TOOLS, MENTOR_TOOLS, SELFCARE_TOOLS, type SelfcareTool } from '@/data/selfcare-tools';
import { ToolGlyph } from '@/components/proto/tool-glyphs';
import { track } from '@/lib/analytics';
import { getRecommendation } from '@/lib/recommendation';
import { useNavStore } from '@/stores/nav-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { useAppStore } from '@/stores/app-store';
import { useHubStore } from '@/stores/hub-store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Card rotation pattern by grid position, from mono/link-v2
// src/components/shared/grid/index.tsx — cycles per row.
const ROTATIONS: [number, number][] = [
  [-4, 2],
  [3, -2],
  [-2, 4],
];

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
          ) : (
            <SwapCard entity={entity} width={width} height={height} />
          )}
        </PressableScale>
      </View>
    </Animated.View>
  );
}

const MENTOR_ACTIVITIES = ['Swaps', 'Hot Takes', 'Notes', 'Deep Thoughts', 'Connect'];

export function HubTab({ active = false }: { active?: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  // Launcher toggles pick which tool set the Hub offers (mutually exclusive)
  const mentalHealthTools = useScenarioStore(s => s.mentalHealthTools);
  const mentorTools = useScenarioStore(s => s.mentorTools);
  const tools = mentorTools ? MENTOR_TOOLS : mentalHealthTools ? CALM_TOOLS : SELFCARE_TOOLS;

  // Swappable stub — a real recommendation system replaces getRecommendation().
  // Set-aware, and recomputed on every visit: the pane stays mounted for the
  // whole session, and the midnight–6am rule must kick in without a reload.
  const [rec, setRec] = useState(() =>
    getRecommendation({
      calmSet: useScenarioStore.getState().mentalHealthTools,
      mentorSet: useScenarioStore.getState().mentorTools,
    }),
  );
  useEffect(() => {
    if (active) setRec(getRecommendation({ calmSet: mentalHealthTools, mentorSet: mentorTools }));
  }, [active, mentalHealthTools, mentorTools]);

  // The Hub lives inside the home pager, so "opened" = the pane became
  // visible. Pointer/tool-exit visits are tracked by requestHub itself;
  // here we track plain arrivals (pill tap, swipe) — skipping activations
  // that a fresh request just caused.
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

  const openEntity = (entity: HubEntity) => {
    if (entity.entityType === 'note') router.push(`/hub/note/${entity.id}`);
    else if (entity.entityType === 'moment') router.push(`/hub/moment/${entity.id}`);
    else if (entity.entityType === 'story') router.push(`/hub/story/${entity.id}`);
    else if (hubSwaps.some(s => s.id === entity.id)) router.push(`/hub/swap/${entity.id}`);
    else router.push(`/hub/moment/${entity.id}`);
  };

  return (
    <View className="flex-1 bg-white">
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingTop: 96, paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      <HubName />

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

      {/* With {mentor} — future shared activities, then everything the pair
          has actually done (the Hub's original content) */}
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

    {/* Crisis link — the Hub's single instance, visible without scrolling */}
    <View className="bg-white" style={{ paddingTop: 6, paddingBottom: Math.max(insets.bottom, 10) }}>
      <TalkNowLink screen="hub" />
    </View>
    </View>
  );
}
