import { Moodies } from '@/lib/scribbles';
import { accentFor, useWallStore } from '@/stores/wall-store';
import { Image } from 'expo-image';
import { ChevronUp, Lock, X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function WallCompact({
  onClose,
  onExpand,
}: {
  onClose: () => void;
  onExpand: () => void;
}) {
  const insets = useSafeAreaInsets();
  const accent = useWallStore(s => s.accent);
  const name = useWallStore(s => s.name);
  const photo = useWallStore(s => s.photo);
  const acc = accentFor(accent);

  return (
    <Pressable
      onPress={onExpand}
      style={{ flex: 1, backgroundColor: acc.hl }}
    >
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: acc.full, opacity: 0.12 }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: insets.top + 10,
        }}
      >
        <Pressable
          onPress={onClose}
          hitSlop={8}
          style={{ width: 36, height: 36, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.7)', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={16} color="#1E1E1E" strokeWidth={2.4} />
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,.65)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Lock size={11} color="#58534B" strokeWidth={2} />
          <Text className="text-geist" style={{ fontSize: 10.5, color: '#58534B' }}>only your mentor sees this</Text>
        </View>
        <Pressable
          onPress={onExpand}
          hitSlop={8}
          style={{ width: 36, height: 36, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.7)', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronUp size={18} color="#1E1E1E" strokeWidth={2.4} />
        </Pressable>
      </View>

      <View style={{ alignItems: 'center', marginTop: 22 }}>
        <View style={{ width: 92, height: 92, borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 14 }}>
          {photo ? (
            <Image source={{ uri: photo }} style={{ width: 92, height: 92, borderRadius: 999 }} contentFit="cover" />
          ) : (
            <Image source={Moodies.happy} style={{ width: 58, height: 58 }} contentFit="contain" />
          )}
        </View>
        <Text className="font-avantt-bold" style={{ fontSize: 22, color: '#1E1E1E', marginTop: 10, letterSpacing: -0.4 }}>
          {name}
        </Text>
        <Text className="text-geist" style={{ fontSize: 10.5, color: '#A0998D', marginTop: 6 }}>
          photos, songs + more on the full wall
        </Text>
      </View>
    </Pressable>
  );
}
