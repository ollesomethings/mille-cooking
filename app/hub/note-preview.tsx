import { teen } from '@/data/mock';
import { useHubStore } from '@/stores/hub-store';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

export default function NotePreview() {
  const router = useRouter();
  const draft = useHubStore(s => s.draftNote);
  const addEntity = useHubStore(s => s.addEntity);
  const clearDrafts = useHubStore(s => s.clearDrafts);
  const [isPrivate, setIsPrivate] = useState(false);

  const save = () => {
    addEntity({
      entityType: 'note',
      owner: { name: teen.name, avatar: teen.avatar, role: 'teen' },
      isPrivate,
      note: { content: draft.trim() },
    });
    clearDrafts();
    if (router.canDismiss()) router.dismissAll();
    else router.replace('/');
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <ChevronLeft size={24} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
        <Text className="text-body-3 text-primary">Preview</Text>
        <View className="w-11" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#F7F5F1', '#EAE6DC']}
          style={{ borderRadius: 18, padding: 24, minHeight: 320 }}
        >
          <View className="flex-row items-center mb-5">
            <Image
              source={{ uri: teen.avatar }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
            <Text className="text-body-3 text-primary ml-3">{teen.name}</Text>
          </View>
          <Text className="text-body-1 text-primary" style={{ lineHeight: 24 }}>
            {draft}
          </Text>
          {isPrivate ? (
            <View className="flex-row items-center mt-6">
              <Lock size={12} color="#8A857C" strokeWidth={2.2} />
              <Text className="text-caption-1 text-tertiary ml-1.5">
                This is private.
              </Text>
            </View>
          ) : null}
        </LinearGradient>

        <View className="flex-row items-center justify-between mt-6 px-1">
          <Text className="text-body-2 text-primary">
            {isPrivate ? 'This note is private' : 'Make this note private'}
          </Text>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: '#E5E1D8', true: '#1F1E1D' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>

      <View className="px-5 pb-safe-or-6">
        <Pressable
          onPress={save}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
        >
          <Text className="text-body-2 text-white">
            {isPrivate ? 'Save note' : 'Share to Hub'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
