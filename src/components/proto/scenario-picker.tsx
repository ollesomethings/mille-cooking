import {
  ChatScreenArt,
  HubScreenArt,
  PhoneFrame,
  WelcomeScreenArt,
} from '@/components/proto/phone-mockups';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ToggleRow } from '@/components/proto/toggle-switch';
import { useScenarioStore, type ScenarioMode } from '@/stores/scenario-store';
import { Scribbles } from '@/lib/scribbles';
import { Logo } from '@somethings-ui/native';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  SlideInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Prototype launcher — a branded splash that picks which user scenario the
 * session runs as. Somethings wordmark, two flow buttons, and a fan of
 * floating phone mockups teasing the app. Reload the page to come back.
 */

/** Gentle endless bob so the phones feel alive after they land. */
function Floating({
  children,
  amplitude = 4,
  duration = 3400,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  style?: object;
}) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(-amplitude, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(amplitude, { duration, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [amplitude, duration, y]);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));
  return (
    <Animated.View
      entering={SlideInDown.springify().damping(17).delay(delay)}
      style={style}
    >
      <Animated.View style={animStyle}>{children}</Animated.View>
    </Animated.View>
  );
}

const SCENARIOS: { mode: ScenarioMode; title: string; sub: string }[] = [
  {
    mode: 'new',
    title: 'New teen',
    sub: 'Sign up and get matched',
  },
  {
    mode: 'existing',
    title: 'Existing teen',
    sub: 'Three weeks in, with history',
  },
];

export function ScenarioPicker({
  onPick,
  hidePhone,
}: {
  onPick: (mode: ScenarioMode) => void;
  /** Fan phone hidden while the flight overlay animates its twin */
  hidePhone: 'welcome' | 'chat' | null;
}) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const mentorOffline = useScenarioStore(s => s.mentorOffline);
  const setMentorOffline = useScenarioStore(s => s.setMentorOffline);
  const skipOnboarding = useScenarioStore(s => s.skipOnboarding);
  const setSkipOnboarding = useScenarioStore(s => s.setSkipOnboarding);
  const mentalHealthTools = useScenarioStore(s => s.mentalHealthTools);
  const setMentalHealthTools = useScenarioStore(s => s.setMentalHealthTools);
  const mentorTools = useScenarioStore(s => s.mentorTools);
  const setMentorTools = useScenarioStore(s => s.setMentorTools);

  // The splash renders full-bleed — dock back into the frame on pick.
  useEffect(() => {
    (window as unknown as { __setPhoneFrame?: (on: boolean) => void }).__setPhoneFrame?.(false);
  }, []);

  // Everything but the flying phone melts back while the flight plays
  const dim = useSharedValue(1);
  useEffect(() => {
    dim.value = withTiming(hidePhone ? 0 : 1, {
      duration: 350,
      easing: Easing.out(Easing.quad),
    });
  }, [hidePhone, dim]);
  const dimStyle = useAnimatedStyle(() => ({ opacity: dim.value }));

  // Scale with BOTH axes: short laptop windows and small phones get a
  // smaller fan (or none), and the content column scrolls when it must.
  const phoneW = Math.min(width * 0.5, 205, height * 0.28);
  const phoneH = phoneW * 2.05;
  const showFan = height >= 680;
  const logoW = Math.max(1, Math.min(width - 64, 330));
  const topPad = insets.top + Math.min(height * 0.09, 64);

  return (
    <View className="flex-1 bg-[#FDFCF9] overflow-hidden">
      <Animated.View className="flex-1" style={dimStyle}>

      {/* Phone fan — painted behind the content, skipped on short screens */}
      {showFan && (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none">
          {hidePhone !== 'welcome' && (
            <Floating
              delay={520}
              duration={3600}
              style={{ position: 'absolute', bottom: -phoneH * 0.3, left: width / 2 - phoneW * 1.26, transform: [{ rotate: '-10deg' }] }}
            >
              <PhoneFrame width={phoneW} height={phoneH}>
                <WelcomeScreenArt />
              </PhoneFrame>
            </Floating>
          )}
          <Floating
            delay={760}
            duration={4200}
            style={{ position: 'absolute', bottom: -phoneH * 0.3, left: width / 2 + phoneW * 0.26, transform: [{ rotate: '10deg' }] }}
          >
            <PhoneFrame width={phoneW} height={phoneH}>
              <HubScreenArt height={phoneH} />
            </PhoneFrame>
          </Floating>
          {hidePhone !== 'chat' && (
            <Floating
              delay={640}
              duration={3900}
              amplitude={6}
              style={{ position: 'absolute', bottom: -phoneH * 0.16, left: width / 2 - phoneW / 2, zIndex: 2 }}
            >
              <PhoneFrame width={phoneW} height={phoneH}>
                <ChatScreenArt width={phoneW} />
              </PhoneFrame>
            </Floating>
          )}
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: showFan ? phoneH * 0.58 : 28,
        }}
      >
      {/* Wordmark + scribble accent */}
      <View className="items-center" style={{ paddingTop: topPad }}>
        <Animated.View entering={FadeIn.duration(500)}>
          <Logo color="#1F1E1D" width={logoW} height={(logoW / 161) * 21} viewBox="0 0 161 21" />
        </Animated.View>
        <Animated.View
          entering={ZoomIn.springify().damping(12).delay(250)}
          style={{ position: 'absolute', top: topPad - logoW * 0.115, left: (width - logoW) / 2 + logoW * 0.105 }}
        >
          <Image
            source={Scribbles.purpleSwoosh}
            style={{ width: logoW * 0.2, height: logoW * 0.2, transform: [{ rotate: '-12deg' }] }}
            contentFit="contain"
          />
        </Animated.View>
      </View>

      {/* Scenario cards — each one says what session it launches */}
      <View className="flex-row px-5 mt-7" style={{ gap: 12, alignSelf: 'center', maxWidth: 430, width: '100%' }}>
        {SCENARIOS.map((sc, i) => (
          <Animated.View
            key={sc.mode}
            entering={FadeInDown.delay(360 + i * 90).duration(300)}
            className="flex-1"
          >
            <PressableScale
              scaleTo={0.96}
              onPress={() => onPick(sc.mode)}
              className="rounded-3xl border border-[#DCD7CD] bg-white px-4 justify-center active:opacity-90"
              style={{ minHeight: 88 }}
            >
              <Text className="font-avantt-bold text-primary" style={{ fontSize: 18 }}>
                {sc.title}
              </Text>
              <Text className="text-secondary" style={{ fontSize: 13, lineHeight: 18, marginTop: 3 }}>
                {sc.sub}
              </Text>
            </PressableScale>
          </Animated.View>
        ))}
      </View>

      {/* Session options — apply to whichever scenario is launched */}
      <View className="px-5 mt-3" style={{ alignSelf: 'center', maxWidth: 430, width: '100%' }}>
        <Animated.View
          entering={FadeInDown.delay(560).duration(300)}
          className="rounded-3xl border border-[#DCD7CD] bg-white overflow-hidden"
        >
          <ToggleRow
            label="Mentor offline"
            sub="Late night, no live replies"
            value={mentorOffline}
            onToggle={setMentorOffline}
          />
          <View style={{ height: 1, backgroundColor: '#EFEBE4', marginLeft: 16 }} />
          <ToggleRow
            label="Skip onboarding"
            sub="New teen: jump straight to chat"
            value={skipOnboarding}
            onToggle={setSkipOnboarding}
          />
          <View style={{ height: 1, backgroundColor: '#EFEBE4', marginLeft: 16 }} />
          <ToggleRow
            label="Mental health tools"
            sub="Calming tool set on the hub"
            value={mentalHealthTools}
            onToggle={setMentalHealthTools}
          />
        </Animated.View>
        {/* "Know your mentor" toggle hidden — the /know tools and
            scenario-store.mentorTools stay wired; re-add a ToggleRow here
            (value={mentorTools} onToggle={setMentorTools}) to restore. */}
      </View>

      <Animated.Text
        entering={FadeIn.delay(680).duration(280)}
        className="text-tertiary text-center px-8"
        style={{ fontFamily: 'TWKLausanne-400', fontSize: 12.5, marginTop: 14 }}
      >
        Reload the page to start over
      </Animated.Text>

      </ScrollView>
      </Animated.View>
    </View>
  );
}
