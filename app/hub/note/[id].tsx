import { useHubStore } from '@/stores/hub-store';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Lock, X } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function NoteView() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entity = useHubStore(s =>
    s.entities.find(e => e.id === id && e.entityType === 'note'),
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">Note</Text>
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      {entity?.note ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(240)}>
          <LinearGradient
            colors={['#F7F5F1', '#EAE6DC']}
            style={{ borderRadius: 18, padding: 24, minHeight: 420 }}
          >
            <View className="flex-row items-center mb-5">
              <Image
                source={{ uri: entity.owner.avatar }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
              <View className="ml-3">
                <Text className="text-body-3 text-primary">{entity.owner.name}</Text>
                <Text className="text-caption-1 text-tertiary">{entity.createdAt}</Text>
              </View>
            </View>
            <Text className="text-body-1 text-primary" style={{ lineHeight: 24 }}>
              {entity.note.content}
            </Text>
            {entity.isPrivate ? (
              <View className="flex-row items-center mt-6">
                <Lock size={12} color="#8A857C" strokeWidth={2.2} />
                <Text className="text-caption-1 text-tertiary ml-1.5">
                  This note is private
                </Text>
              </View>
            ) : null}
          </LinearGradient>
          </Animated.View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-header-4 text-primary text-center">
            Oh no! Something went wrong
          </Text>
          <Text className="text-body-2 text-tertiary text-center mt-2">
            We couldn&apos;t find the note you&apos;re looking for.
          </Text>
        </View>
      )}
    </View>
  );
}
