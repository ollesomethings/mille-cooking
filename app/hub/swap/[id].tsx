import { Polaroid, SwapFaceCard } from '@/components/polaroid';
import { hubPhotos, mentor, teen } from '@/data/mock';
import { useAppStore } from '@/stores/app-store';
import { SWAP_PROMPTS } from '@somethings-ui/core/swap-prompts';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Smile, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

export default function SwapDetail() {
  const router = useRouter();
  const swap = useAppStore(s => s.swap);
  const addTeenPhoto = useAppStore(s => s.addTeenPhoto);
  const revealSwap = useAppStore(s => s.revealSwap);
  const sendMessage = useAppStore(s => s.sendMessage);
  const [response, setResponse] = useState('');

  const close = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (!swap) {
    close();
    return null;
  }

  const facePrompt =
    SWAP_PROMPTS.find(p => p.title === swap.promptTitle) ??
    SWAP_PROMPTS.find(p => p.id === 'me-when-little') ??
    SWAP_PROMPTS[0];

  const handleAddPhoto = async () => {
    let uri = hubPhotos.baby;
    if (Platform.OS !== 'web') {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.8,
        });
        if (!result.canceled && result.assets[0]?.uri) {
          uri = result.assets[0].uri;
        }
      } catch {
        // fall back to the sample photo
      }
    }
    addTeenPhoto(uri);
  };

  const handleReveal = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    revealSwap();
  };

  const handleRespond = () => {
    const text = response.trim();
    if (!text) return;
    sendMessage(text);
    setResponse('');
    close();
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">
          {swap.status === 'mentor_shared'
            ? 'New Swap'
            : swap.status === 'ready'
              ? 'Swap ready'
              : ''}
        </Text>
        <Pressable
          onPress={close}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      {swap.status === 'mentor_shared' && (
        <>
          <View className="flex-1 items-center justify-center">
            <View className="items-center justify-center" style={{ height: 320 }}>
              <SwapFaceCard
                prompt={facePrompt}
                rotation={-8}
                width={210}
                style={{ position: 'absolute', top: 10, left: -120 }}
              />
              <SwapFaceCard
                prompt={facePrompt}
                avatar={mentor.avatar}
                rotation={6}
                width={210}
                style={{ position: 'absolute', top: -10, left: -90 }}
              />
            </View>
            <Text className="text-caption-1 text-tertiary mt-8">
              Your mentor shared first
            </Text>
            <Text className="text-header-3 text-primary mt-2">
              {swap.promptTitle}
            </Text>
            <Text className="text-body-2 text-secondary mt-2 px-12 text-center">
              {swap.promptSubtitle}
            </Text>
          </View>
          <View className="px-5 pb-safe-or-6">
            <Pressable
              onPress={handleAddPhoto}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
            >
              <Text className="text-body-2 text-white">Add your photo</Text>
            </Pressable>
          </View>
        </>
      )}

      {swap.status === 'ready' && (
        <>
          <View className="flex-1 items-center justify-center">
            <Pressable onPress={handleReveal} className="active:opacity-90">
              <View className="items-center justify-center" style={{ height: 320, width: 260 }}>
                <SwapFaceCard
                  prompt={facePrompt}
                  rotation={-8}
                  width={210}
                  style={{ position: 'absolute', top: 20, left: 10 }}
                />
                <SwapFaceCard
                  prompt={facePrompt}
                  avatar={mentor.avatar}
                  rotation={6}
                  width={210}
                  style={{ position: 'absolute', top: 0, left: 30 }}
                />
              </View>
            </Pressable>
            <Text className="text-header-3 text-primary mt-8">
              {swap.promptTitle}
            </Text>
            <Text className="text-body-2 text-secondary mt-3 px-12 text-center">
              You and your mentor both added a photo
            </Text>
          </View>
          <View className="px-5 pb-safe-or-6">
            <Pressable
              onPress={handleReveal}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
            >
              <Text className="text-body-2 text-white">Tap to reveal</Text>
            </Pressable>
          </View>
        </>
      )}

      {swap.status === 'revealed' && (
        <>
          <View className="flex-1 items-center justify-center">
            <View className="flex-row items-center justify-center">
              <Animated.View entering={ZoomIn.duration(260)}>
                <Polaroid
                  photo={swap.mentorPhoto}
                  rotation={-6}
                  width={170}
                  style={{ marginRight: -24, zIndex: 1 }}
                />
              </Animated.View>
              <Animated.View entering={ZoomIn.delay(150).duration(260)}>
                <Polaroid
                  photo={swap.teenPhoto ?? hubPhotos.baby}
                  rotation={7}
                  width={170}
                />
              </Animated.View>
            </View>
            <Animated.View entering={FadeIn.delay(350)}>
              <Text className="text-header-3 text-primary mt-10">
                {swap.promptTitle}
              </Text>
            </Animated.View>
          </View>
          <View className="flex-row items-center px-5 pb-safe-or-6">
            <View className="flex-1 flex-row items-center rounded-full border border-surfaces-z5 bg-white pl-4 pr-2 h-12 mr-3">
              <TextInput
                className="flex-1 text-body-2 text-primary"
                placeholder="Respond..."
                placeholderTextColor="#B8B2A9"
                value={response}
                onChangeText={setResponse}
                onSubmitEditing={handleRespond}
                returnKeyType="send"
                style={{ fontFamily: 'TWKLausanne-400' }}
              />
              <Pressable className="h-9 w-9 items-center justify-center">
                <Smile size={20} color="#999388" strokeWidth={1.8} />
              </Pressable>
            </View>
            <Pressable
              onPress={handleRespond}
              className="h-12 px-5 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
            >
              <Text className="text-body-3 text-white">Send</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
