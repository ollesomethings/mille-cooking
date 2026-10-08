import { hub } from '@/data/mock';
import { useHubStore } from '@/stores/hub-store';
import { Pencil } from 'lucide-react-native';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const MAX_NAME_LENGTH = 16;

export function HubName() {
  const name = useHubStore(s => s.name);
  const setName = useHubStore(s => s.setName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const openEditor = () => {
    setDraft(name);
    setEditing(true);
  };

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed) setName(trimmed);
    setEditing(false);
  };

  return (
    <View className="items-center">
      <Pressable
        onPress={openEditor}
        className="flex-row items-center active:opacity-60"
        hitSlop={8}
      >
        <Text className="text-header-3 text-primary text-center">
          {name || 'Your hub'}
        </Text>
        <Pencil size={14} color="#8A857C" strokeWidth={2} style={{ marginLeft: 6 }} />
      </Pressable>
      <Text className="text-caption-1 text-tertiary mt-1">{hub.since}</Text>

      <Modal visible={editing} transparent animationType="fade">
        <Pressable
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: 'rgba(253,252,249,0.96)' }}
          onPress={() => setEditing(false)}
        >
          <Animated.View entering={FadeInDown.duration(200)} className="w-full">
          <Pressable className="w-full items-center px-8" onPress={() => {}}>
            <Text className="text-caption-1 text-tertiary mb-4">
              Name your hub
            </Text>
            <TextInput
              value={draft}
              onChangeText={t => setDraft(t.slice(0, MAX_NAME_LENGTH))}
              placeholder="Your hub"
              placeholderTextColor="#B8B2A7"
              maxLength={MAX_NAME_LENGTH}
              autoFocus
              className="text-header-2 text-primary text-center w-full"
              onSubmitEditing={commit}
            />
            <Text className="text-caption-1 text-tertiary mt-3">
              {draft.length} / {MAX_NAME_LENGTH}
            </Text>
            <Pressable
              onPress={commit}
              className="mt-6 rounded-full bg-brand-trueBlack px-10 py-3.5 active:opacity-85"
            >
              <Text className="text-body-2 text-white">Done</Text>
            </Pressable>
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}
