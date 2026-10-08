import { PressableScale } from '@/components/ui/pressable-scale';
import { mentor, teen } from '@/data/mock';
import { useWallStore } from '@/stores/wall-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Settings, ShieldCheck, Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

export function TopHeader({
  tab,
  onPressLeft,
  onOpenSpace,
}: {
  tab: 'corner' | 'chat' | 'hub';
  onPressLeft: () => void;
  onOpenSpace: () => void;
}) {
  const router = useRouter();
  const openPanel = useWallStore(s => s.openPanel);

  return (
    <View className="flex-row items-center justify-between px-5 pt-safe-or-2 bg-transparent">
      <PressableScale
        onPress={onPressLeft}
        className="h-11 w-11 items-center justify-center rounded-full"
        hitSlop={8}
      >
        {tab === 'chat' ? (
          <ShieldCheck size={22} color="#1F1E1D" strokeWidth={1.8} />
        ) : tab === 'hub' ? (
          <ArrowLeft size={22} color="#1F1E1D" strokeWidth={1.8} />
        ) : (
          <ArrowRight size={22} color="#1F1E1D" strokeWidth={1.8} />
        )}
      </PressableScale>

      {tab === 'chat' ? (
        <Pressable
          onPress={openPanel}
          className="items-center active:opacity-70"
        >
          <View className="flex-row">
            <Image
              source={{ uri: teen.avatar }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                borderWidth: 2,
                borderColor: '#FFFFFF',
              }}
            />
            <Image
              source={{ uri: mentor.avatar }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                borderWidth: 2,
                borderColor: '#FFFFFF',
                marginLeft: -10,
              }}
            />
          </View>
        </Pressable>
      ) : (
        <View />
      )}

      <View className="flex-row items-center" style={{ gap: 4 }}>
        {/* Entry into the Hub (the teen's space) — hidden while already there */}
        {tab !== 'hub' && (
          <PressableScale
            onPress={onOpenSpace}
            className="flex-row items-center rounded-full border border-[#E5E0D8] bg-white px-3"
            style={{ height: 40, gap: 6 }}
            hitSlop={6}
          >
            <Sparkles size={15} color="#1F1E1D" strokeWidth={1.8} />
            <Text className="font-avantt-bold text-primary" style={{ fontSize: 13 }}>
              Your space
            </Text>
          </PressableScale>
        )}
        <PressableScale
          onPress={() => router.push('/profile')}
          className="h-11 w-11 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <Settings size={22} color="#1F1E1D" strokeWidth={1.8} />
        </PressableScale>
      </View>
    </View>
  );
}
