import { useWallStore } from '@/stores/wall-store';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function WallNudge() {
  const prompt = useWallStore(s => s.prompt);
  const panelOpen = useWallStore(s => s.panelOpen);
  const wallDone = useWallStore(s => s.wallDone);
  const expandPrompt = useWallStore(s => s.expandPrompt);
  const dismissPrompt = useWallStore(s => s.dismissPrompt);
  const openPanel = useWallStore(s => s.openPanel);

  if (panelOpen || wallDone) return null;

  if (prompt === 'tiny') return <TinyNudge onPress={expandPrompt} />;
  if (prompt === 'full') return <FullPrompt onDismiss={dismissPrompt} onGo={openPanel} />;
  if (prompt === 'resume') return <ResumePill onPress={openPanel} />;
  return null;
}

function TinyNudge({ onPress }: { onPress: () => void }) {
  const bob = useSharedValue(0);
  useEffect(() => {
    bob.set(
      withDelay(
        1200,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false,
        ),
      ),
    );
  }, [bob]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: bob.get() * 2 }] }));

  return (
    <View style={{ position: 'absolute', top: 96, left: 0, right: 0, alignItems: 'center', zIndex: 15 }} pointerEvents="box-none">
      <Animated.View style={style}>
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            onPress();
          }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#fff', borderRadius: 999, paddingVertical: 8, paddingLeft: 10, paddingRight: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12 }}
        >
          <Text style={{ fontSize: 16 }}>💌</Text>
          <Text className="text-geist" style={{ fontSize: 10, color: '#58534B', letterSpacing: 1.4 }}>PSST</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function FullPrompt({ onDismiss, onGo }: { onDismiss: () => void; onGo: () => void }) {
  return (
    <View style={{ position: 'absolute', top: 100, left: 0, right: 0, alignItems: 'center', zIndex: 15 }} pointerEvents="box-none">
      <Animated.View
        entering={FadeIn.duration(220)}
        style={{ width: 236, backgroundColor: '#fff', borderRadius: 20, padding: 18, paddingTop: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20 }}
      >
        <Text style={{ fontSize: 40 }}>💌</Text>
        <Text className="text-geist" style={{ fontSize: 9, color: '#A0998D', letterSpacing: 1.4, marginTop: 8 }}>SOMETHINGS · PROFILE</Text>
        <Text className="font-avantt-bold" style={{ fontSize: 18, color: '#1E1E1E', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
          wanna create your wall?
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <Pressable onPress={onDismiss} hitSlop={8}>
            <Text style={{ fontSize: 13, color: '#A0998D' }}>not now</Text>
          </Pressable>
          <Pressable onPress={onGo} style={{ backgroundColor: '#4D55FD', borderRadius: 999, paddingHorizontal: 22, paddingVertical: 11 }}>
            <Text className="font-avantt-bold" style={{ fontSize: 13.5, color: '#fff' }}>let&apos;s go</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

function ResumePill({ onPress }: { onPress: () => void }) {
  return (
    <View style={{ position: 'absolute', top: 96, left: 0, right: 0, alignItems: 'center', zIndex: 15 }} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 999, paddingVertical: 8, paddingLeft: 10, paddingRight: 13, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12 }}
      >
        <Text style={{ fontSize: 16 }}>💌</Text>
        <Text className="text-geist" style={{ fontSize: 10, color: '#58534B', letterSpacing: 0.8 }}>FINISH YOUR WALL</Text>
        <ChevronRight size={11} color="#A0998D" strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}
