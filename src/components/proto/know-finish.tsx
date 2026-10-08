import { ConfettiBurst } from '@/components/proto/bursts';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { useNavStore } from '@/stores/nav-store';
import { EASE_STANDARD } from '@/lib/motion';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Shared exit stage for the know-your-mentor tools — a light landing, not
 * the self-care tie-back. One way out: back to the Hub.
 */
export function KnowFinish({ title, sub }: { title: string; sub: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const backToSpace = () => {
    useNavStore.getState().requestHub('tool_exit');
    if (router.canGoBack()) router.dismissAll();
    else router.replace('/');
  };

  return (
    <View className="flex-1 bg-white px-6" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      <View className="flex-1 items-center justify-center">
        <View pointerEvents="none" style={{ position: 'absolute' }}>
          <ConfettiBurst count={14} spread={170} duration={900} />
        </View>
        <Animated.Text
          entering={ZoomIn.springify().damping(13)}
          className="font-avantt-bold text-primary text-center"
          style={{ fontSize: 30, lineHeight: 35 }}
        >
          {title}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(400).easing(EASE_STANDARD)}
          className="text-secondary text-center mt-3"
          style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 21 }}
        >
          {sub}
        </Animated.Text>
      </View>
      <Animated.View entering={FadeInDown.delay(350).duration(360).easing(EASE_STANDARD)} style={{ gap: 12 }}>
        <Pressable
          onPress={backToSpace}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
        >
          <Text className="text-body-2 text-white">Back to your space</Text>
        </Pressable>
        <TalkNowLink screen="know_finish" />
      </Animated.View>
    </View>
  );
}
