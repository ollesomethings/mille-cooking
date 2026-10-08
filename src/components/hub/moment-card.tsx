import type { HubEntity } from '@/data/hub-entities';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

/**
 * Fanned photo stack, mirroring mono/link-v2 MomentCard → StackedImageCard
 * (up to 3 photos, back photos rotated behind the front one).
 */
export function MomentCard({
  entity,
  width,
  height,
}: {
  entity: HubEntity;
  width: number;
  height: number;
}) {
  const images = entity.moment?.images ?? [];
  const back = images.slice(1, 3);

  return (
    <View style={{ width, height }}>
      {back.map((uri, i) => (
        <Image
          key={uri}
          source={{ uri }}
          style={{
            position: 'absolute',
            top: 4,
            left: 0,
            width,
            height: height - 26,
            borderRadius: 10,
            transform: [{ rotate: `${i === 0 ? 5 : -4}deg` }],
          }}
          contentFit="cover"
        />
      ))}
      <View
        style={{
          width,
          height: height - 26,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: '#EAE6DC',
          shadowColor: '#000',
          shadowOpacity: 0.14,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        {images[0] ? (
          <Image source={{ uri: images[0] }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : null}
        <Image
          source={{ uri: entity.owner.avatar }}
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 1.5,
            borderColor: '#FFFFFF',
          }}
        />
      </View>
      {entity.moment?.caption ? (
        <Text
          className="text-primary mt-1.5"
          style={{ fontFamily: 'CedarvilleCursive-Regular', fontSize: 12 }}
          numberOfLines={1}
        >
          {entity.moment.caption}
        </Text>
      ) : null}
    </View>
  );
}
