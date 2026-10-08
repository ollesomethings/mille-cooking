import { teen } from '@/data/mock';
import { useHubStore } from '@/stores/hub-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

export default function ComposeMoment() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const images = useHubStore(s => s.draftImages);
  const caption = useHubStore(s => s.draftCaption);
  const setDraftCaption = useHubStore(s => s.setDraftCaption);
  const addEntity = useHubStore(s => s.addEntity);
  const clearDrafts = useHubStore(s => s.clearDrafts);

  const heroWidth = Math.min(width - 80, 300);

  const shareToHub = () => {
    addEntity({
      entityType: 'moment',
      owner: { name: teen.name, avatar: teen.avatar, role: 'teen' },
      moment: { caption: caption.trim() || null, images },
    });
    clearDrafts();
    // Real app pops the whole flow (StackActions.pop(3)) and toasts
    // "Your moment is now live."
    if (router.canDismiss()) router.dismissAll();
    else router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <ChevronLeft size={24} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
        <Text className="text-body-3 text-primary">New moment</Text>
        <View className="w-11" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', paddingTop: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: heroWidth, height: heroWidth * 1.15 }}>
          {images.slice(1, 3).map((uri, i) => (
            <Image
              key={uri}
              source={{ uri }}
              style={{
                position: 'absolute',
                top: 6,
                left: 0,
                width: heroWidth,
                height: heroWidth * 1.1,
                borderRadius: 14,
                transform: [{ rotate: `${i === 0 ? 4 : -3}deg` }],
              }}
              contentFit="cover"
            />
          ))}
          <Image
            source={{ uri: images[0] }}
            style={{
              width: heroWidth,
              height: heroWidth * 1.1,
              borderRadius: 14,
            }}
            contentFit="cover"
          />
          {images.length > 1 && (
            <View className="absolute right-3 top-3 rounded-full bg-brand-trueBlack/70 px-2.5 py-1">
              <Text className="text-white" style={{ fontSize: 11 }}>
                {images.length} photos
              </Text>
            </View>
          )}
        </View>

        <TextInput
          value={caption}
          onChangeText={setDraftCaption}
          placeholder="Share a little about this moment..."
          placeholderTextColor="#B8B2A7"
          multiline
          className="text-body-1 text-primary mt-6 px-8 w-full text-center"
          style={{ minHeight: 60, fontFamily: 'TWKLausanne-400' }}
        />
      </ScrollView>

      <View className="px-5 pb-safe-or-6">
        <Pressable
          onPress={shareToHub}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
        >
          <Text className="text-body-2 text-white">Share to Hub</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
