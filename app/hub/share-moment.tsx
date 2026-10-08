import { pickPhotos } from '@/lib/pick-photos';
import { hubPhotos } from '@/data/mock';
import { useHubStore } from '@/stores/hub-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Plus, X } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

const MAX_PHOTOS = 6;
const SAMPLE_PHOTOS = [hubPhotos.park, hubPhotos.food, hubPhotos.ski];

export default function ShareMoment() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const images = useHubStore(s => s.draftImages);
  const setDraftImages = useHubStore(s => s.setDraftImages);

  const cell = (width - 40 - 16) / 3;

  const addPhotos = async () => {
    const picked = await pickPhotos(MAX_PHOTOS - images.length);
    if (picked.length) setDraftImages([...images, ...picked].slice(0, MAX_PHOTOS));
  };

  const addSamples = () => {
    const remaining = SAMPLE_PHOTOS.filter(p => !images.includes(p));
    setDraftImages([...images, ...remaining].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (uri: string) => {
    setDraftImages(images.filter(i => i !== uri));
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">Share a moment</Text>
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-header-3 text-primary">Add your photos</Text>
        <Text className="text-caption-1 text-tertiary mt-1">
          {images.length} of {MAX_PHOTOS}
        </Text>

        <View className="flex-row flex-wrap mt-5" style={{ gap: 8 }}>
          {images.map(uri => (
            <View key={uri}>
              <Image
                source={{ uri }}
                style={{ width: cell, height: cell * 1.25, borderRadius: 10 }}
                contentFit="cover"
              />
              <Pressable
                onPress={() => removePhoto(uri)}
                className="absolute -right-1.5 -top-1.5 h-6 w-6 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-80"
                hitSlop={6}
              >
                <X size={13} color="#FFFFFF" strokeWidth={2.4} />
              </Pressable>
            </View>
          ))}
          {images.length < MAX_PHOTOS && (
            <Pressable
              onPress={addPhotos}
              className="items-center justify-center rounded-[10px] border border-dashed border-surfaces-z5 bg-surfaces-z2 active:opacity-70"
              style={{ width: cell, height: cell * 1.25 }}
            >
              <Plus size={24} color="#8A857C" strokeWidth={1.8} />
            </Pressable>
          )}
        </View>

        {images.length < MAX_PHOTOS && (
          <Pressable onPress={addSamples} className="mt-6 active:opacity-60">
            <Text className="text-caption-1 text-tertiary underline">
              or use sample photos
            </Text>
          </Pressable>
        )}
      </ScrollView>

      <View className="px-5 pb-safe-or-6">
        <Pressable
          onPress={() => router.push('/hub/compose-moment')}
          disabled={images.length === 0}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          style={images.length === 0 ? { opacity: 0.35 } : undefined}
        >
          <Text className="text-body-2 text-white">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
