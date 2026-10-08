import { useAppStore } from '@/stores/app-store';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

const MAX_PROMPT_LENGTH = 100;

export default function CustomSwap() {
  const router = useRouter();
  const startTeenSwap = useAppStore(s => s.startTeenSwap);
  const [prompt, setPrompt] = useState('');

  const handleStart = () => {
    const title = prompt.trim();
    if (!title) return;
    startTeenSwap(title, '');
    router.replace('/hub/swap/active');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">Create your own</Text>
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <TextInput
          value={prompt}
          onChangeText={t => setPrompt(t.slice(0, MAX_PROMPT_LENGTH))}
          placeholder="Add a prompt"
          placeholderTextColor="#B8B2A7"
          multiline
          autoFocus
          maxLength={MAX_PROMPT_LENGTH}
          className="text-header-2 text-primary text-center w-full"
          style={{ lineHeight: 38 }}
        />
        <Text className="text-caption-1 text-tertiary mt-4">
          {prompt.length} / {MAX_PROMPT_LENGTH}
        </Text>
      </View>

      <View className="px-5 pb-safe-or-6 items-center">
        <Text className="text-caption-1 text-tertiary mb-4 text-center">
          Your photos will reveal once you both share.
        </Text>
        <Pressable
          onPress={handleStart}
          disabled={!prompt.trim()}
          className="h-14 w-full items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          style={!prompt.trim() ? { opacity: 0.35 } : undefined}
        >
          <Text className="text-body-2 text-white">Start swap</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
