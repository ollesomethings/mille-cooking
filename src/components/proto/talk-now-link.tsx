import { track } from '@/lib/analytics';
import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

/**
 * The persistent crisis-resources link required on every screen of the
 * offline self-care flow — one tap, never buried, never gated.
 */
export function TalkNowLink({
  screen,
  label = 'Talk to someone now',
  light = false,
}: {
  screen: string;
  label?: string;
  /** White text for dark screens */
  light?: boolean;
}) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        track('crisis_resources_clicked', { screen });
        router.push('/resources');
      }}
      className="items-center justify-center active:opacity-60"
      style={{ minHeight: 44 }}
      hitSlop={8}
      accessibilityRole="link"
    >
      <Text
        className="underline"
        style={{
          fontFamily: 'TWKLausanne-400',
          fontSize: 15,
          color: light ? '#FFFFFF' : '#1F1E1D',
          textShadowColor: light ? 'rgba(0,0,0,0.5)' : undefined,
          textShadowRadius: light ? 6 : undefined,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
