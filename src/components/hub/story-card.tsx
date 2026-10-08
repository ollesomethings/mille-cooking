import type { HubEntity } from '@/data/hub-entities';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

/**
 * Mentor story card, mirroring mono/link-v2 StoryCard → StackedImageCard
 * (purple placeholder, stacked images).
 */
export function StoryCard({
  entity,
  width,
  height,
}: {
  entity: HubEntity;
  width: number;
  height: number;
}) {
  const images = entity.story?.images ?? [];

  return (
    <View style={{ width, height }}>
      {images.slice(1, 3).map((img, i) => (
        <Image
          key={img.url}
          source={{ uri: img.url }}
          style={{
            position: 'absolute',
            top: 4,
            left: 0,
            width,
            height: height - 4,
            borderRadius: 10,
            transform: [{ rotate: `${i === 0 ? 4 : -3}deg` }],
          }}
          contentFit="cover"
        />
      ))}
      <View
        style={{
          width,
          height: height - 4,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: '#B164FF',
          shadowColor: '#000',
          shadowOpacity: 0.14,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        {images[0] ? (
          <Image
            source={{ uri: images[0].url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : null}
        <View
          className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5 pt-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.001)' }}
        >
          <Text
            className="text-white"
            style={{
              fontSize: 11,
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowRadius: 6,
            }}
            numberOfLines={2}
          >
            {images[0]?.header}
          </Text>
        </View>
        <Image
          source={{ uri: entity.owner.avatar }}
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: '#B164FF',
          }}
        />
      </View>
    </View>
  );
}
