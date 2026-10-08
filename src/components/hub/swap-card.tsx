import type { HubEntity } from '@/data/hub-entities';
import { SWAP_PROMPTS } from '@somethings-ui/core/swap-prompts';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

/**
 * Two mini polaroids over the prompt's color, mirroring mono/link-v2
 * SwapCard → SwapCardListing.
 */
function MiniPolaroid({
  photo,
  rotation,
  width,
  style,
}: {
  photo: string;
  rotation: number;
  width: number;
  style?: object;
}) {
  const inner = width - 10;
  return (
    <View
      className="bg-white rounded-[4px]"
      style={[
        {
          width,
          padding: 5,
          paddingBottom: 14,
          transform: [{ rotate: `${rotation}deg` }],
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 4,
        },
        style,
      ]}
    >
      <Image
        source={{ uri: photo }}
        style={{ width: inner, height: inner * 1.2, borderRadius: 2 }}
        contentFit="cover"
      />
    </View>
  );
}

export function SwapCard({
  entity,
  width,
  height,
}: {
  entity: HubEntity;
  width: number;
  height: number;
}) {
  const swap = entity.swap;
  const prompt = SWAP_PROMPTS.find(p => p.id === swap?.promptId);
  const bg = prompt?.backgroundColor ?? '#FFE81F';
  const polaroidW = width * 0.52;

  return (
    <View
      style={{
        width,
        height,
        borderRadius: 10,
        backgroundColor: bg,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      {swap ? (
        <View style={{ width: polaroidW * 1.5, height: polaroidW * 1.75 }}>
          <MiniPolaroid
            photo={swap.mentorPhoto}
            rotation={-7}
            width={polaroidW}
            style={{ position: 'absolute', top: 4, left: 0 }}
          />
          <MiniPolaroid
            photo={swap.teenPhoto}
            rotation={5}
            width={polaroidW}
            style={{ position: 'absolute', top: 16, left: polaroidW * 0.45 }}
          />
        </View>
      ) : null}
      <Text
        className="text-primary absolute bottom-2.5"
        style={{ fontFamily: 'CedarvilleCursive-Regular', fontSize: 13 }}
        numberOfLines={1}
      >
        {swap?.promptTitle}
      </Text>
    </View>
  );
}
