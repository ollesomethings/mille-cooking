import { assetUri } from '@/lib/scribbles';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { mentor } from '@/data/mock';
import { MENTOR_BACK_AT } from '@/data/offline';
import { track } from '@/lib/analytics';
import { useNavStore } from '@/stores/nav-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { useSelfcareStore } from '@/stores/selfcare-store';
import { EASE_STANDARD } from '@/lib/motion';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BellRing, Check, X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

const SPRAY = assetUri(require('@assets/illustrations/spray.png'));
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * The exit / tie-back screen: warm acknowledgment, the honest loop back to
 * the real mentor, and one CTA — a reminder for when they're online again.
 * If the teen shared their vent, confirm it here.
 */
export default function SelfcareDone() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tool, shared } = useLocalSearchParams<{ tool?: string; shared?: string }>();
  const mentorOffline = useScenarioStore(s => s.mentorOffline);
  const reminderSet = useSelfcareStore(s => s.reminderSet);
  const setReminderSet = useSelfcareStore(s => s.setReminderSet);

  const backToChat = () => {
    if (router.canGoBack()) router.dismissAll();
    else router.replace('/');
  };

  // HubTab tracks hub_opened{source: tool_exit} when the pane becomes active
  const backToSpace = () => {
    useNavStore.getState().requestHub('tool_exit');
    backToChat();
  };

  const setReminder = () => {
    // Prototype: the push is faked — a real build schedules it for session
    // start.
    track('offline_reminder_set', { back_at: MENTOR_BACK_AT });
    console.log('[push stub] reminder scheduled for', MENTOR_BACK_AT);
    setReminderSet(true);
  };

  return (
    <View
      className="flex-1 bg-white px-6"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <View className="flex-row justify-end" style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          onPress={backToChat}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center">
        <View className="items-center justify-center">
          <Animated.View
            entering={FadeIn.delay(200).duration(700)}
            style={{ position: 'absolute', width: 240, height: 240 }}
          >
            <Image
              source={SPRAY}
              style={{ width: '100%', height: '100%', opacity: 0.3 }}
              contentFit="contain"
              tintColor="#C2DF4F"
            />
          </Animated.View>
          <Animated.View entering={ZoomIn.springify().damping(14)} className="items-center">
            <View
              className="items-center justify-center rounded-full"
              style={{ width: 72, height: 72, backgroundColor: '#F4FBE8' }}
            >
              <Check size={34} color="#5FA74B" strokeWidth={2.4} />
            </View>
          </Animated.View>
        </View>

        <Animated.Text
          entering={FadeInDown.delay(160).duration(400).easing(EASE_STANDARD)}
          className="font-avantt-bold text-primary text-center mt-6"
          style={{ fontSize: 32, lineHeight: 36 }}
        >
          You got through that.
        </Animated.Text>

        {tool === 'not_alone' && (
          <Animated.Text
            entering={FadeInDown.delay(220).duration(400).easing(EASE_STANDARD)}
            className="text-body-2 text-secondary text-center mt-2"
            style={{ lineHeight: 21 }}
          >
            Talking to someone who gets it is the next step.
          </Animated.Text>
        )}

        <Animated.View
          entering={FadeInDown.delay(280).springify().damping(18)}
          className="flex-row items-center mt-6 rounded-3xl bg-surfaces-z2 border border-surfaces-divider px-4 py-4"
          style={{ gap: 12 }}
        >
          <Image
            source={{ uri: mentor.avatar }}
            style={{ width: 44, height: 44, borderRadius: 22 }}
          />
          <Text
            className="flex-1 text-body-2 text-primary"
            style={{ lineHeight: 21 }}
          >
            This is the kind of thing {mentor.name} can help you get ahead of —
            they&apos;re back at {MENTOR_BACK_AT}.
          </Text>
        </Animated.View>

        {shared === '1' && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(360).easing(EASE_STANDARD)}
            className="flex-row items-center mt-3"
            style={{ gap: 6 }}
          >
            <Check size={15} color="#5FA74B" strokeWidth={2.4} />
            <Text className="text-body-3 text-secondary">
              Saved for {mentor.name}
            </Text>
          </Animated.View>
        )}
      </View>

      <Animated.View entering={FadeInDown.delay(480).duration(400).easing(EASE_STANDARD)} style={{ gap: 12 }}>
        {/* Primary CTA is context-aware: offline → reminder, online → chat */}
        {mentorOffline ? (
          reminderSet ? (
            <View
              className="h-14 flex-row items-center justify-center rounded-full bg-surfaces-z2 border border-surfaces-divider"
              style={{ gap: 8 }}
            >
              <BellRing size={18} color="#1F1E1D" strokeWidth={1.8} />
              <Text className="text-body-2 text-primary">
                We&apos;ll remind you at {MENTOR_BACK_AT}
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={setReminder}
              className="h-14 flex-row items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
              style={{ gap: 8 }}
            >
              <BellRing size={18} color="#fff" strokeWidth={1.8} />
              <Text className="text-body-2 text-white">
                Remind me when {mentor.name} is on
              </Text>
            </Pressable>
          )
        ) : (
          <Pressable
            onPress={backToChat}
            className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          >
            <Text className="text-body-2 text-white">Go to your chat</Text>
          </Pressable>
        )}
        <Pressable
          onPress={backToSpace}
          className="h-12 items-center justify-center active:opacity-60"
        >
          <Text className="text-body-2 text-primary underline">Back to your space</Text>
        </Pressable>
        <TalkNowLink screen="selfcare_done" />
      </Animated.View>
    </View>
  );
}
