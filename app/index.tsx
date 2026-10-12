import { ChatTab } from '@/components/chat-tab';
import { CornerTab } from '@/components/corner-tab';
import { FabMenu } from '@/components/fab-menu';
import { HubTab } from '@/components/hub-tab';
import { TopHeader } from '@/components/top-header';
import { FlightOverlay } from '@/components/proto/flight-overlay';
import { HubCoachmark } from '@/components/proto/hub-coachmark';
import { ScenarioPicker } from '@/components/proto/scenario-picker';
import { WallNudge } from '@/components/wall/wall-nudge';
import { scenario } from '@/data/scenario';
import { useNavStore } from '@/stores/nav-store';
import { useScenarioStore, type ScenarioMode } from '@/stores/scenario-store';
import { useHorizontalDragScroll } from '@/web/use-drag-scroll';
import { WallOverlay } from '@/components/wall/wall-overlay';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

// Pager order: Corner (left) · Chat (home) · Hub (right).
const CORNER = 0;
const CHAT = 1;
const HUB = 2;

export default function Home() {
  const router = useRouter();
  const scenarioMode = useScenarioStore(s => s.mode);
  const chooseScenario = useScenarioStore(s => s.chooseScenario);
  const [flight, setFlight] = useState<ScenarioMode | null>(null);

  return (
    <View className="flex-1 bg-[#FDFCF9]">
      {scenarioMode ? (
        <HomePager />
      ) : (
        <ScenarioPicker
          onPick={setFlight}
          hidePhone={flight ? (flight === 'new' ? 'welcome' : 'chat') : null}
        />
      )}
      {flight && (
        <FlightOverlay
          mode={flight}
          onLand={() => {
            (window as unknown as { __setPhoneFrame?: (on: boolean) => void })
              .__setPhoneFrame?.(true);
            chooseScenario(flight);
            if (flight === 'new') {
              // "Skip onboarding" launcher toggle: land in chat as a fresh
              // account that just finished signup (default name + mentor).
              const { skipOnboarding, completeOnboarding } = useScenarioStore.getState();
              if (skipOnboarding) completeOnboarding('John');
              else router.push('/onboarding');
            }
          }}
          onDone={() => setFlight(null)}
        />
      )}
    </View>
  );
}

function HomePager() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ollesVersion = useScenarioStore(s => s.ollesVersion);
  const [index, setIndex] = useState(CHAT);
  const pagerRef = useRef<ScrollView>(null);
  // Coach-mark anchors: the pager root and the header's "Your space" pill
  const rootRef = useRef<View>(null);
  const spacePillRef = useRef<View>(null);

  // Desktop reviewers navigate the pager by mouse click-and-drag
  useHorizontalDragScroll(pagerRef, node => node.clientWidth);

  // Open directly on Chat even though it's the middle pane. On web the
  // pager isn't scrollable until content lays out, so a mount-time
  // useEffect scroll gets clamped to 0 — scroll once content has size.
  const openedOnChat = useRef(false);
  const handleContentSizeChange = useCallback(
    (contentWidth: number) => {
      if (openedOnChat.current || contentWidth <= width) return;
      openedOnChat.current = true;
      pagerRef.current?.scrollTo({ x: CHAT * width, animated: false });
    },
    [width],
  );

  const goTo = useCallback(
    (i: number) => {
      pagerRef.current?.scrollTo({ x: i * width, animated: true });
      setIndex(i);
    },
    [width],
  );

  // Offline pointer and tool exits ask for the Hub through the nav store —
  // the Hub is a pager pane, not a route.
  const hubRequest = useNavStore(s => s.hubRequest);
  useEffect(() => {
    if (hubRequest) goTo(HUB);
  }, [hubRequest, goTo]);

  // Playlist "say it in chat" jumps land on the chat pane
  const chatRequest = useNavStore(s => s.chatRequest);
  useEffect(() => {
    if (chatRequest) goTo(CHAT);
  }, [chatRequest, goTo]);

  // react-native-web never fires onMomentumScrollEnd (ScrollViewBase only
  // forwards onScroll), so track the page from scroll position instead —
  // works on native too.
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const i = Math.min(
        HUB,
        Math.max(CORNER, Math.round(e.nativeEvent.contentOffset.x / width)),
      );
      if (i !== index) setIndex(i);
    },
    [width, index],
  );

  return (
    <View ref={rootRef} className="flex-1 bg-white">
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width, height: '100%' }}>
          <CornerTab />
        </View>
        <View style={{ width, height: '100%' }}>
          <ChatTab onOpenHub={() => goTo(HUB)} />
        </View>
        <View style={{ width, height: '100%' }}>
          <HubTab active={index === HUB} />
        </View>
      </ScrollView>

      <View
        className="absolute left-0 right-0 top-0"
        // Masks scrolled content behind the header — matches each pane's canvas
        style={{ backgroundColor: index === HUB ? '#EAF1FC' : '#FFFFFF' }}
        pointerEvents="box-none"
      >
        <TopHeader
          tab={index === CORNER ? 'corner' : index === HUB ? 'hub' : 'chat'}
          onOpenSpace={() => goTo(HUB)}
          onPressLeft={() => {
            // Real app: the shield on chat opens /resources (crisis help)
            if (index !== CHAT) goTo(CHAT);
            else router.push('/resources');
          }}
          spacePillRef={spacePillRef}
        />
      </View>

      <HubCoachmark
        chatActive={index === CHAT}
        hubActive={index === HUB}
        rootRef={rootRef}
        pillRef={spacePillRef}
      />

      {index === HUB && !ollesVersion && <FabMenu />}

      {index === CHAT && scenario.showWallNudge && <WallNudge />}
      <WallOverlay />
    </View>
  );
}
