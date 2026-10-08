import { PressableScale } from '@/components/ui/pressable-scale';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { Scribbles } from '@/lib/scribbles';
import { useNavStore } from '@/stores/nav-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Image } from 'expo-image';
import { ChevronRight, X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

/**
 * One-off chat pointer to the Hub, shown for preset tester links (/calm).
 * Same gentle-heads-up contract as the offline pointer: dismissible, never
 * a modal, never auto-launches anything.
 */
export function HubHintCard() {
  const setHubHint = useScenarioStore(s => s.setHubHint);

  const open = () => {
    buzz.light();
    setHubHint(false);
    useNavStore.getState().requestHub('chat_hint');
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(350).duration(420).easing(EASE_STANDARD)}
      exiting={FadeOut.duration(200)}
      className="mt-4"
    >
      <PressableScale
        scaleTo={0.98}
        onPress={open}
        className="rounded-3xl px-5 py-4 overflow-hidden flex-row items-center"
        style={{ backgroundColor: '#F4FBE8', gap: 10 }}
      >
        <Image
          source={Scribbles.greenSwoosh}
          style={{
            position: 'absolute',
            top: -28,
            right: 12,
            width: 100,
            height: 100,
            opacity: 0.3,
            transform: [{ rotate: '-14deg' }],
          }}
          contentFit="contain"
          tintColor="#5FA74B"
        />
        <Text className="flex-1 text-body-2 text-primary" style={{ lineHeight: 21, paddingRight: 20 }}>
          Psst — your space has calming tools now. Go take a look
        </Text>
        <ChevronRight size={18} color="#1F1E1D" strokeWidth={2} />
      </PressableScale>
      {/* Sibling, not nested — a nested pressable would also fire the card */}
      <Pressable
        onPress={() => {
          buzz.tick();
          setHubHint(false);
        }}
        className="absolute items-center justify-center active:opacity-60"
        style={{ top: 18, right: 4, width: 32, height: 32 }}
        hitSlop={6}
        accessibilityLabel="Dismiss"
      >
        <X size={14} color="#8E8578" strokeWidth={2} />
      </Pressable>
    </Animated.View>
  );
}
