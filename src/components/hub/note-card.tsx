import type { HubEntity } from '@/data/hub-entities';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';
import { Text, View } from 'react-native';

/**
 * Paper-textured note card, mirroring mono/link-v2
 * src/components/hub/note-card.tsx (gradient #F7F5F1 → #EAE6DC, owner
 * avatar, up to 8 lines, lock footer when private).
 */
export function NoteCard({
  entity,
  width,
  height,
}: {
  entity: HubEntity;
  width: number;
  height: number;
}) {
  return (
    <LinearGradient
      colors={['#F7F5F1', '#EAE6DC']}
      style={{
        width,
        height,
        borderRadius: 10,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <Image
        source={{ uri: entity.owner.avatar }}
        style={{ width: 22, height: 22, borderRadius: 11 }}
      />
      <Text
        className="text-primary mt-2 flex-1"
        style={{ fontSize: 11, lineHeight: 15 }}
        numberOfLines={8}
      >
        {entity.note?.content}
      </Text>
      {entity.isPrivate ? (
        <View className="flex-row items-center mt-1.5">
          <Lock size={9} color="#8A857C" strokeWidth={2.4} />
          <Text className="text-tertiary ml-1" style={{ fontSize: 9 }}>
            This is private.
          </Text>
        </View>
      ) : (
        <Text className="text-tertiary mt-1.5" style={{ fontSize: 9 }}>
          {entity.createdAt}
        </Text>
      )}
    </LinearGradient>
  );
}
