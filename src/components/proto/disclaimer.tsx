import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { Scribbles } from '@/lib/scribbles';
import { useScenarioStore } from '@/stores/scenario-store';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

/**
 * One-time (per session) demo disclaimer, shown over whatever screen the
 * session opens on — the launcher or a preset tester link. Honest framing:
 * nothing here is the live app.
 */
export function Disclaimer() {
  const seen = useScenarioStore(s => s.disclaimerSeen);
  const setSeen = useScenarioStore(s => s.setDisclaimerSeen);

  if (seen) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(220)}
      className="absolute inset-0 items-center justify-center px-7"
      style={{ backgroundColor: 'rgba(31,30,29,0.5)', zIndex: 1000 }}
    >
      <Animated.View
        entering={FadeInDown.delay(120).duration(380).easing(EASE_STANDARD)}
        className="w-full rounded-3xl bg-white px-6 py-6 overflow-hidden"
        style={{ maxWidth: 360 }}
      >
        <Image
          source={Scribbles.purpleSwoosh}
          style={{
            position: 'absolute',
            top: -30,
            right: -26,
            width: 110,
            height: 110,
            opacity: 0.35,
            transform: [{ rotate: '-14deg' }],
          }}
          contentFit="contain"
        />
        <Text
          className="text-tertiary"
          style={{ fontFamily: 'GeistMono-Medium', fontSize: 10, letterSpacing: 1.5 }}
        >
          PROTOTYPE
        </Text>
        <Text className="font-avantt-bold text-primary mt-2" style={{ fontSize: 24, lineHeight: 28 }}>
          This is a demo.
        </Text>
        <Text className="text-body-2 text-secondary mt-3" style={{ lineHeight: 22 }}>
          You&apos;re looking at a working prototype of what we&apos;re
          building and testing — some things here might not be live in the
          app just yet, and the data is mock.
        </Text>
        <Pressable
          onPress={() => {
            buzz.tick();
            setSeen(true);
          }}
          className="mt-5 h-12 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
        >
          <Text className="text-body-2 text-white">Got it</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
