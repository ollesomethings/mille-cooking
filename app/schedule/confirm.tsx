import { mentor, scheduleMentor, teen } from '@/data/mock';
import { useAppStore } from '@/stores/app-store';
import { Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, ChevronLeft, Globe, User } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

function DetailRow({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <View className="flex-row items-center py-2.5">
      <View className="w-9">{icon}</View>
      <Text className="text-body-2 text-primary">{label}</Text>
    </View>
  );
}

export default function ScheduleConfirm() {
  const router = useRouter();
  const { time, day } = useLocalSearchParams<{ time?: string; day?: string }>();
  const addSystemMessage = useAppStore(s => s.addSystemMessage);
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    addSystemMessage(
      `Video chat with ${scheduleMentor.name} scheduled — ${time}, ${day} 🎉`,
      'swap-event',
    );
    router.dismissAll();
    router.replace('/');
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
        <Text className="text-body-3 text-primary">Video chat details</Text>
        <View className="w-11" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5 mt-4">
          <View className="flex-row">
            <Image
              source={{ uri: scheduleMentor.avatar }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: 2,
                borderColor: '#FFFFFF',
              }}
            />
            <Image
              source={{ uri: teen.avatar }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: 2,
                borderColor: '#FFFFFF',
                marginLeft: -12,
              }}
            />
          </View>

          <View className="mt-4">
            <View className="self-start">
              <Image
                source={Scribbles.limeHighlight}
                style={{
                  position: 'absolute',
                  left: -8,
                  right: -8,
                  top: 6,
                  bottom: -6,
                  width: 300,
                  height: 40,
                }}
                contentFit="fill"
              />
              <Text className="text-header-3 text-primary">
                You're almost there
              </Text>
            </View>
            <Text className="text-body-2 text-secondary mt-2">
              Just confirm and you're good to go.
            </Text>
          </View>

          <View className="mt-6 border-t border-surfaces-divider pt-4">
            <DetailRow
              icon={<User size={18} color="#1F1E1D" strokeWidth={1.8} />}
              label={`Video chat with ${scheduleMentor.name}`}
            />
            <DetailRow
              icon={<Calendar size={18} color="#1F1E1D" strokeWidth={1.8} />}
              label={`${time ?? '7:00 PM'}, ${day ?? 'Fri Sep 26, 2025'}`}
            />
            <DetailRow
              icon={<Globe size={18} color="#1F1E1D" strokeWidth={1.8} />}
              label="Local Time EST"
            />
          </View>

          <View className="mt-6 border-t border-surfaces-divider pt-5">
            <Text className="text-body-3 text-primary mb-3">Leave a note</Text>
            <TextInput
              className="min-h-[96px] rounded-2xl border border-surfaces-divider px-4 py-3 text-body-2 text-primary"
              placeholder={`Anything you want to share with ${scheduleMentor.name} ahead of time?`}
              placeholderTextColor="#B8B2A9"
              multiline
              value={note}
              onChangeText={setNote}
              style={{ fontFamily: 'TWKLausanne-400', textAlignVertical: 'top' }}
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pb-safe-or-6">
        <Pressable
          onPress={handleConfirm}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
        >
          <Text className="text-body-2 text-white">Confirm</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
