import { useHubStore } from '@/stores/hub-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function CreateNote() {
  const router = useRouter();
  const draft = useHubStore(s => s.draftNote);
  const setDraftNote = useHubStore(s => s.setDraftNote);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">New note</Text>
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <View className="flex-1 px-5 pt-3">
        <LinearGradient
          colors={['#F7F5F1', '#EAE6DC']}
          style={{ flex: 1, borderRadius: 18, padding: 22 }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraftNote}
            placeholder="Write freely, no rules."
            placeholderTextColor="#B8B2A7"
            multiline
            autoFocus
            className="flex-1 text-body-1 text-primary"
            style={{
              lineHeight: 24,
              textAlignVertical: 'top',
              fontFamily: 'TWKLausanne-400',
            }}
          />
        </LinearGradient>
      </View>

      <View className="px-5 pb-safe-or-6 pt-4">
        <Pressable
          onPress={() => router.push('/hub/note-preview')}
          disabled={!draft.trim()}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          style={!draft.trim() ? { opacity: 0.35 } : undefined}
        >
          <Text className="text-body-2 text-white">Next</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
