import type { HubEntity } from '@/data/hub-entities';
import { Moodies } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

/**
 * Hub grid card for a shared playlist: cover-art square (tint + moodie +
 * grooves), title, owner, song count. Same footprint as the other cards.
 */
export function PlaylistCard({
  entity,
  width,
  height,
}: {
  entity: HubEntity;
  width: number;
  height: number;
}) {
  const pl = entity.playlist;
  if (!pl) return null;
  const coverSize = width - 24;

  return (
    <View
      style={{
        width,
        height,
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <View
        style={{
          width: coverSize,
          height: coverSize,
          borderRadius: 8,
          backgroundColor: pl.cover.bg,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* vinyl grooves behind the moodie */}
        {[0.82, 0.58, 0.34].map(f => (
          <View
            key={f}
            style={{
              position: 'absolute',
              width: coverSize * f,
              height: coverSize * f,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: 'rgba(31,30,29,0.08)',
            }}
          />
        ))}
        <Image
          source={Moodies[pl.cover.moodie]}
          style={{ width: coverSize * 0.46, height: coverSize * 0.46 }}
          contentFit="contain"
        />
      </View>
      <Text
        className="font-avantt-bold text-primary mt-2"
        style={{ fontSize: 12, lineHeight: 14 }}
        numberOfLines={1}
      >
        {pl.title}
      </Text>
      <View className="flex-row items-center mt-1 flex-1" style={{ gap: 4 }}>
        <Image
          source={{ uri: entity.owner.avatar }}
          style={{ width: 14, height: 14, borderRadius: 7 }}
        />
        <Text className="text-tertiary" style={{ fontSize: 9 }} numberOfLines={1}>
          {pl.songs.length} songs · {entity.createdAt}
        </Text>
      </View>
    </View>
  );
}
