import { TalkNowLink } from '@/components/proto/talk-now-link';
import { PressableScale } from '@/components/ui/pressable-scale';
import { mentor } from '@/data/mock';
import { holdingMessage, mentorReturnCountdown } from '@/data/offline';
import { track } from '@/lib/analytics';
import { EASE_STANDARD } from '@/lib/motion';
import { useNavStore } from '@/stores/nav-store';
import { useSelfcareStore } from '@/stores/selfcare-store';
import { Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { ChevronRight, MoonStar, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

/**
 * What the chat shows while the mentor is offline — the mentor's absence
 * is honest, not an error state, and never a takeover:
 *
 * 1. Live countdown to their return ("back in 9h 24m")
 * 2. The mentor's automated holding message (labeled — we never simulate
 *    a live person)
 * 3. A gentle, dismissible pointer to the Hub (the teen's space). A heads-up,
 *    not a flow: no modal, no auto-launch.
 * 4. The crisis-resources link, same reach as everywhere else
 */
const enter = (delay: number) =>
  FadeInDown.delay(delay).duration(420).easing(EASE_STANDARD);

export function MentorOfflineBlock() {
  const pointerDismissed = useSelfcareStore(s => s.spacePointerDismissed);
  const dismissPointer = useSelfcareStore(s => s.setSpacePointerDismissed);

  // Live countdown, refreshed every 30s
  const [countdown, setCountdown] = useState(() => mentorReturnCountdown());
  useEffect(() => {
    track('offline_countdown_seen', {});
    const id = setInterval(() => setCountdown(mentorReturnCountdown()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <View className="mt-4">
      {/* 1 — live countdown */}
      <Animated.View
        entering={FadeIn.delay(80).duration(500)}
        className="flex-row items-center justify-center"
        style={{ gap: 5 }}
      >
        <MoonStar size={13} color="#8E8578" strokeWidth={2} />
        <Text className="text-caption-1 text-tertiary text-center">
          {mentor.name} is back in {countdown}
        </Text>
      </Animated.View>

      {/* 2 — automated holding message */}
      <Animated.View entering={enter(260)} className="flex-row items-end mt-4">
        <Image
          source={{ uri: mentor.avatar }}
          style={{ width: 26, height: 26, borderRadius: 13, marginRight: 8 }}
        />
        <View style={{ maxWidth: '80%' }}>
          <Text
            className="text-tertiary mb-1"
            style={{ fontFamily: 'GeistMono-Medium', fontSize: 10, letterSpacing: 1 }}
          >
            AUTO-MESSAGE
          </Text>
          <View className="rounded-[20px] bg-surfaces-z3 px-4 py-2.5">
            <Text className="text-body-2 text-primary">{holdingMessage()}</Text>
          </View>
        </View>
      </Animated.View>

      {/* 3 — gentle pointer to Your space (dismissible, never a takeover) */}
      {!pointerDismissed && (
        <Animated.View entering={enter(480)} exiting={FadeOut.duration(200)}>
          <PressableScale
            scaleTo={0.98}
            onPress={() => useNavStore.getState().requestHub('offline_pointer')}
            className="mt-6 rounded-3xl px-5 py-4 overflow-hidden flex-row items-center"
            style={{ backgroundColor: '#F4F1FF', gap: 10 }}
          >
            <Image
              source={Scribbles.purpleSwoosh}
              style={{
                position: 'absolute',
                top: -30,
                right: 14,
                width: 100,
                height: 100,
                opacity: 0.25,
                transform: [{ rotate: '-16deg' }],
              }}
              contentFit="contain"
            />
            <Text
              className="flex-1 text-body-2 text-primary"
              style={{ lineHeight: 21, paddingRight: 20 }}
            >
              In the meantime — your space has things that can help right now
            </Text>
            <ChevronRight size={18} color="#1F1E1D" strokeWidth={2} />
          </PressableScale>
          {/* Sibling, not nested — a nested pressable would also fire the card */}
          <Pressable
            onPress={() => dismissPointer(true)}
            className="absolute items-center justify-center active:opacity-60"
            style={{ top: 26, right: 4, width: 32, height: 32 }}
            hitSlop={6}
            accessibilityLabel="Dismiss"
          >
            <X size={14} color="#8E8578" strokeWidth={2} />
          </Pressable>
        </Animated.View>
      )}

      {/* 4 — crisis resources, never buried */}
      <Animated.View entering={FadeIn.delay(650).duration(450)} className="mt-3 mb-2">
        <TalkNowLink screen="chat_offline" label="Need to talk to someone tonight?" />
      </Animated.View>
    </View>
  );
}
