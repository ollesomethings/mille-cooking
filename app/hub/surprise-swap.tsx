import { useAppStore } from '@/stores/app-store';
import { getRandomPrompt, type SwapPrompt } from '@somethings-ui/core/swap-prompts';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

export default function SurpriseSwap() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const startTeenSwap = useAppStore(s => s.startTeenSwap);
  const [prompt, setPrompt] = useState<SwapPrompt>(() => getRandomPrompt());

  const cardWidth = Math.min(width - 80, 320);

  const handleChoose = () => {
    startTeenSwap(prompt.title, prompt.subtitle ?? '');
    router.replace('/hub/swap/active');
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">Surprise me</Text>
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Animated.View
          key={prompt.id}
          entering={ZoomIn.springify().damping(16).duration(320)}
          className="items-center justify-center rounded-3xl p-8"
          style={{
            width: cardWidth,
            height: cardWidth * 1.35,
            backgroundColor: prompt.backgroundColor,
          }}
        >
          <Image
            source={prompt.scribble}
            style={{ position: 'absolute', width: cardWidth * 0.85, height: cardWidth * 0.85, opacity: 0.9 }}
            contentFit="contain"
          />
          <Text
            className="text-geist text-primary absolute top-7"
            style={{ fontSize: 11, letterSpacing: 1.4 }}
          >
            PHOTO SWAP
          </Text>
          <Text
            className="font-avantt-bold text-primary text-center"
            style={{ fontSize: 30, lineHeight: 35 }}
          >
            {prompt.title}
          </Text>
        </Animated.View>

        <Pressable
          onPress={() => setPrompt(p => getRandomPrompt(p))}
          className="mt-7 active:opacity-60"
          hitSlop={8}
        >
          <Text className="text-body-2 text-primary underline">Try another</Text>
        </Pressable>
      </View>

      <View className="px-5 pb-safe-or-6 items-center">
        <Text className="text-caption-1 text-tertiary mb-4 text-center">
          Your photos will reveal once you both share.
        </Text>
        <Pressable
          onPress={handleChoose}
          className="h-14 w-full items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
        >
          <Text className="text-body-2 text-white">Choose</Text>
        </Pressable>
      </View>
    </View>
  );
}
