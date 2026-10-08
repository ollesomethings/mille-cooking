import { useHubStore } from '@/stores/hub-store';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Full-screen story viewer: tap right to advance, left to go back,
 * progress segments up top (real app: /story-viewer?entityId=…).
 */
export default function StoryViewer() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entity = useHubStore(s => s.entities.find(e => e.id === id));
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const topOffset = Math.max(insets.top, 16);

  const images = entity?.story?.images ?? [];
  const image = images[index];

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const advance = () => {
    if (index < images.length - 1) setIndex(index + 1);
    else close();
  };

  const rewind = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!image) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-trueBlack px-10">
        <Text className="text-header-4 text-white text-center">
          Oh no! Something went wrong
        </Text>
        <Text className="text-body-2 text-center mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
          We couldn&apos;t find the story you&apos;re looking for.
        </Text>
        <Pressable onPress={close} className="mt-6 rounded-full bg-white px-7 py-3 active:opacity-85">
          <Text className="text-body-2 text-primary">Close</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brand-trueBlack">
      <Animated.View key={image.url} entering={FadeIn.duration(180)} style={{ flex: 1 }}>
        <Image source={{ uri: image.url }} style={{ flex: 1 }} contentFit="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'transparent']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 140 }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180 }}
        />
      </Animated.View>

      {/* Tap zones */}
      <Pressable className="absolute inset-y-0 left-0 w-1/3" onPress={rewind} />
      <Pressable className="absolute inset-y-0 right-0 w-2/3" onPress={advance} />

      {/* Progress segments */}
      <View
        className="absolute left-4 right-4 flex-row"
        style={{ top: topOffset, gap: 4 }}
      >
        {images.map((img, i) => (
          <View
            key={img.url}
            className="h-0.5 flex-1 rounded-full"
            style={{ backgroundColor: i <= index ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }}
          />
        ))}
      </View>

      <View className="absolute left-4 flex-row items-center" style={{ top: topOffset + 12 }}>
        <Image
          source={{ uri: entity!.owner.avatar }}
          style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: '#FFF' }}
        />
        <Text className="text-body-3 text-white ml-2">{entity!.owner.name}</Text>
      </View>
      <Pressable
        onPress={close}
        className="absolute right-3 h-11 w-11 items-center justify-center active:opacity-60"
        style={{ top: topOffset + 6 }}
        hitSlop={8}
      >
        <X size={24} color="#FFFFFF" strokeWidth={2} />
      </Pressable>

      <Animated.View
        key={`caption-${image.url}`}
        entering={FadeInDown.delay(80).duration(260)}
        className="absolute bottom-0 left-0 right-0 px-6 pb-safe-or-6"
      >
        {image.eyebrow ? (
          <Text className="text-geist text-white mb-2" style={{ fontSize: 10, letterSpacing: 1.4, opacity: 0.8 }}>
            {image.eyebrow}
          </Text>
        ) : null}
        {image.header ? (
          <Text className="font-avantt-bold text-white" style={{ fontSize: 26, lineHeight: 31 }}>
            {image.header}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
}
