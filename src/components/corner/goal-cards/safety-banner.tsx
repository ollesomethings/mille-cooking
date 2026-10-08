import * as Linking from 'expo-linking';
import { LifeBuoy, ShieldCheck } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

/**
 * Always-visible override for safety-adjacent goals — crisis resources and a
 * mentor-visibility indicator. This never lives inside the collapsible body:
 * it renders above it and can't be hidden away with the rest of the card,
 * regardless of which tracking pattern the goal otherwise uses.
 */
export function SafetyBanner() {
  return (
    <View
      className="mx-4 mb-3 rounded-xl px-4 py-3"
      style={{ backgroundColor: 'rgba(228,104,101,0.10)' }}
    >
      <View className="flex-row items-center" style={{ gap: 8 }}>
        <ShieldCheck size={16} color="rgb(228,104,101)" strokeWidth={2} />
        <Text className="text-body-3 text-primary flex-1">
          Your mentor can see this goal, always.
        </Text>
      </View>
      <Pressable
        onPress={() => Linking.openURL('https://988lifeline.org')}
        className="flex-row items-center mt-2 active:opacity-70"
        style={{ gap: 8 }}
      >
        <LifeBuoy size={16} color="rgb(228,104,101)" strokeWidth={2} />
        <Text className="text-body-3 underline" style={{ color: 'rgb(228,104,101)' }}>
          Talk to someone now · 988 Suicide & Crisis Lifeline
        </Text>
      </Pressable>
    </View>
  );
}
