import { CRISIS_RESOURCES } from '@/data/offline';
import { track } from '@/lib/analytics';
import { useRouter } from 'expo-router';
import { MessageCircle, MoveUpRight, Phone, X } from 'lucide-react-native';
import { Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';

/**
 * Off-platform crisis resources, mirroring mono/link-v2's mentor-offline
 * sheet (reach-out-options.tsx): real numbers, tel:/sms: deep links, same
 * copy. This screen must never get harder to reach — it is one tap from
 * chat and from every screen of the self-care flow.
 */
export default function Resources() {
  const router = useRouter();

  const open = (kind: 'phone' | 'text', number: string, label: string) => {
    track('crisis_resources_clicked', { screen: 'resources', option: label });
    if (kind === 'phone') {
      Linking.openURL(`tel:${number}`);
    } else {
      const body = Platform.OS === 'ios' ? `&body=Hi%2C%20I'd%20like%20to%20talk` : `?body=Hi, I'd like to talk`;
      Linking.openURL(`sms://${number}/${body}`);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">Reach out 24/7</Text>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="font-avantt-bold text-primary mt-2"
          style={{ fontSize: 28, lineHeight: 32 }}
        >
          Help is still available
        </Text>
        <Text
          className="text-sm leading-6 text-gray-500 mt-2"
          style={{ fontFamily: 'TWKLausanne-400' }}
        >
          You&apos;re not alone — and this isn&apos;t something you have to handle by
          yourself. If you&apos;re feeling unsafe or overwhelmed use the following
          resources
        </Text>

        {CRISIS_RESOURCES.map(r => (
          <View key={r.label}>
            <Text
              className="text-primary mt-6 mb-2"
              style={{ fontFamily: 'GeistMono-Medium', fontSize: 13 }}
            >
              {r.section}
            </Text>
            <Pressable
              onPress={() => open(r.kind, r.number, r.label)}
              className="flex-row items-center rounded-2xl border border-surfaces-divider bg-white px-4 active:opacity-70"
              style={{ minHeight: 56, gap: 12 }}
            >
              {r.kind === 'phone' ? (
                <Phone size={22} color="#1F1E1D" strokeWidth={1.8} />
              ) : (
                <MessageCircle size={22} color="#1F1E1D" strokeWidth={1.8} />
              )}
              <Text
                className="flex-1 text-primary"
                style={{ fontFamily: 'TWKLausanne-400', fontSize: 16 }}
              >
                {r.label}
              </Text>
              <MoveUpRight size={17} color="#1F1E1D" strokeWidth={1.8} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
