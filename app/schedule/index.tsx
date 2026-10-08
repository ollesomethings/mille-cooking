import { scheduleDays, scheduleMentor, timeSlots } from '@/data/mock';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function Schedule() {
  const router = useRouter();
  const [dayId, setDayId] = useState('d3');
  const [slotId, setSlotId] = useState<string | null>(null);

  const selectedDay = scheduleDays.find(d => d.id === dayId);
  const selectedSlot = timeSlots.find(s => s.id === slotId);

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
        <Text className="text-body-3 text-primary">Schedule Video Chat</Text>
        <View className="w-11" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-6">
          <Image
            source={{ uri: scheduleMentor.avatar }}
            style={{ width: 96, height: 96, borderRadius: 48 }}
          />
          <Text className="text-header-4 text-primary mt-4">
            {scheduleMentor.name}
          </Text>
          <Text className="text-caption-1 text-tertiary mt-1">
            {scheduleMentor.role}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-8"
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {scheduleDays.map(d => {
            const selected = d.id === dayId;
            return (
              <Pressable
                key={d.id}
                disabled={d.disabled}
                onPress={() => setDayId(d.id)}
                className={`mr-3 items-center rounded-xl px-4 py-2.5 ${
                  selected ? 'bg-brand-sky' : 'bg-transparent'
                } ${d.disabled ? 'opacity-40' : 'active:opacity-70'}`}
              >
                <Text className="text-body-3 text-primary">{d.day}</Text>
                <Text className="text-caption-1 text-secondary mt-0.5">
                  {d.date}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="px-5 mt-6">
          {timeSlots.map(s => {
            const selected = s.id === slotId;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSlotId(s.id)}
                className={`mb-3 flex-row items-center justify-between rounded-2xl border px-5 py-4 ${
                  selected
                    ? 'border-brand-sky bg-brand-sky/10'
                    : 'border-surfaces-divider bg-white'
                } active:opacity-70`}
              >
                <Text className="text-body-2 text-primary">{s.label}</Text>
                <View className="flex-row items-center">
                  <Text className="text-body-2 text-primary mr-3">{s.time}</Text>
                  <View className="rounded-full bg-surfaces-z3 px-2.5 py-1">
                    <Text className="text-caption-2 text-secondary">
                      {s.duration}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
          <Pressable className="items-center py-3 active:opacity-60">
            <Text className="text-body-3 text-primary underline">
              Show more times
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View className="px-5 pb-safe-or-6">
        <Pressable
          disabled={!selectedSlot}
          onPress={() =>
            router.push({
              pathname: '/schedule/confirm',
              params: {
                time: selectedSlot?.time ?? '',
                day: `${selectedDay?.day} ${selectedDay?.date}`,
              },
            })
          }
          className={`h-14 items-center justify-center rounded-full ${
            selectedSlot ? 'bg-brand-trueBlack' : 'bg-surfaces-z5'
          } active:opacity-85`}
        >
          <Text className="text-body-2 text-white">Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}
