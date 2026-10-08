import { hub, mentor, teen } from '@/data/mock';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Calendar,
  ChevronRight,
  Heart,
  MessageCircle,
  Settings,
  Video,
  X,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 items-center rounded-2xl border border-surfaces-divider bg-white py-4">
      <Text className="text-header-4 text-primary">{value}</Text>
      <Text className="text-caption-1 text-tertiary mt-0.5">{label}</Text>
    </View>
  );
}

function ActionCard({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center rounded-2xl border border-surfaces-divider bg-white py-4 active:bg-surfaces-z3"
    >
      {icon}
      <Text className="text-caption-1 text-primary mt-1.5">{label}</Text>
    </Pressable>
  );
}

function ProfileCard({
  label,
  avatar,
}: {
  label: string;
  avatar: string;
}) {
  return (
    <View className="flex-1 rounded-2xl border border-surfaces-divider bg-white p-4">
      <Text className="text-caption-1 text-secondary">{label}</Text>
      <View className="items-center py-4">
        <Image
          source={{ uri: avatar }}
          style={{ width: 64, height: 64, borderRadius: 32 }}
        />
      </View>
    </View>
  );
}

function MenuRow({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Pressable className="flex-row items-center py-4 active:opacity-60">
      <View className="w-9">{icon}</View>
      <Text className="text-body-2 text-primary flex-1">{label}</Text>
      <ChevronRight size={18} color="#999388" strokeWidth={1.8} />
    </Pressable>
  );
}

export default function Profile() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-end px-5 pt-safe-or-4">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <View className="flex-row items-center px-5 mt-2">
        <View className="flex-row mr-4">
          <Image
            source={{ uri: teen.avatar }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: '#FFFFFF',
            }}
          />
          <Image
            source={{ uri: mentor.avatar }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: '#FFFFFF',
              marginLeft: -14,
            }}
          />
        </View>
        <View>
          <Text className="text-header-4 text-primary">{hub.name}</Text>
          <Text className="text-caption-1 text-tertiary mt-0.5">
            {hub.since}
          </Text>
        </View>
      </View>

      <View className="flex-row px-5 mt-6" style={{ gap: 12 }}>
        <StatCard value={String(hub.stats.days)} label="Days" />
        <StatCard value={String(hub.stats.messages)} label="Messages" />
      </View>

      <View className="flex-row px-5 mt-3" style={{ gap: 12 }}>
        <ActionCard
          icon={<Video size={20} color="#1F1E1D" strokeWidth={1.8} />}
          label="Plan a hang"
          onPress={() => router.push('/schedule')}
        />
        <ActionCard
          icon={<Calendar size={20} color="#1F1E1D" strokeWidth={1.8} />}
          label="See Schedule"
          onPress={() => router.push('/schedule')}
        />
      </View>

      <View className="flex-row px-5 mt-3" style={{ gap: 12 }}>
        <ProfileCard label="Your Profile" avatar={teen.avatar} />
        <ProfileCard label="Your Mentor" avatar={mentor.avatar} />
      </View>

      <View className="px-5 mt-8">
        <MenuRow
          icon={<Settings size={20} color="#1F1E1D" strokeWidth={1.8} />}
          label="Manage your mentorship"
        />
        <MenuRow
          icon={<Heart size={20} color="#1F1E1D" strokeWidth={1.8} />}
          label="Tell us how it's been"
        />
        <MenuRow
          icon={<MessageCircle size={20} color="#1F1E1D" strokeWidth={1.8} />}
          label="Talk to support"
        />
      </View>
    </ScrollView>
  );
}
