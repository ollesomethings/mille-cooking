import { Polaroid } from '@/components/polaroid';
import { useHubStore } from '@/stores/hub-store';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/**
 * Viewer for moments — and for fixture swaps that were seeded in mock data
 * rather than created through the swap flow (those have no app-store state
 * for the swap screens to read).
 */
export default function MomentView() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entity = useHubStore(s => s.entities.find(e => e.id === id));

  const photos =
    entity?.entityType === 'swap' && entity.swap
      ? [entity.swap.mentorPhoto, entity.swap.teenPhoto]
      : entity?.moment?.images ?? [];
  const caption =
    entity?.entityType === 'swap'
      ? entity.swap?.promptTitle
      : entity?.moment?.caption;
  const title = entity?.entityType === 'swap' ? 'Swap' : 'Moment';

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">{title}</Text>
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      {entity ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 80, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center self-start px-6 mb-4">
            <Image
              source={{ uri: entity.owner.avatar }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
            <View className="ml-3">
              <Text className="text-body-3 text-primary">{entity.owner.name}</Text>
              <Text className="text-caption-1 text-tertiary">{entity.createdAt}</Text>
            </View>
          </View>

          {photos.map((photo, i) => (
            <Animated.View
              key={photo}
              entering={FadeInDown.delay(i * 80).duration(260)}
            >
              <Polaroid
                photo={photo}
                rotation={i % 2 === 0 ? -2 : 2}
                width={Math.min(width - 80, 300)}
                caption={i === photos.length - 1 ? caption ?? undefined : undefined}
                style={{ marginVertical: 10 }}
              />
            </Animated.View>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-header-4 text-primary text-center">
            Oh no! Something went wrong
          </Text>
          <Text className="text-body-2 text-tertiary text-center mt-2">
            We couldn&apos;t find the moment you&apos;re looking for.
          </Text>
        </View>
      )}
    </View>
  );
}
