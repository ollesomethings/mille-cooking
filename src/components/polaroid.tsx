import { Image } from 'expo-image';
import { Text, View, ViewStyle } from 'react-native';
import type { SwapPrompt } from '@somethings-ui/core/swap-prompts';

export function Polaroid({
  photo,
  rotation = 0,
  width = 150,
  caption,
  style,
}: {
  photo: string | number;
  rotation?: number;
  width?: number;
  caption?: string;
  style?: ViewStyle;
}) {
  const imageSize = width - 16;
  return (
    <View
      className="bg-white rounded-md"
      style={[
        {
          width,
          padding: 8,
          paddingBottom: caption ? 8 : 28,
          transform: [{ rotate: `${rotation}deg` }],
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        },
        style,
      ]}
    >
      <Image
        source={typeof photo === 'string' ? { uri: photo } : photo}
        style={{ width: imageSize, height: imageSize * 1.25, borderRadius: 2 }}
        contentFit="cover"
      />
      {caption ? (
        <Text
          className="text-primary text-center mt-2"
          style={{ fontFamily: 'CedarvilleCursive-Regular', fontSize: 13 }}
          numberOfLines={1}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

export function SwapFaceCard({
  prompt,
  avatar,
  rotation = 0,
  width = 150,
  style,
}: {
  prompt: Pick<SwapPrompt, 'scribble'>;
  avatar?: string;
  rotation?: number;
  width?: number;
  style?: ViewStyle;
}) {
  const inner = width - 16;
  return (
    <View
      className="bg-white rounded-md"
      style={[
        {
          width,
          padding: 8,
          paddingBottom: 28,
          transform: [{ rotate: `${rotation}deg` }],
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        },
        style,
      ]}
    >
      <View
        className="items-center justify-center rounded-[2px] bg-surfaces-z4"
        style={{ width: inner, height: inner * 1.25 }}
      >
        <Image
          source={prompt.scribble}
          style={{ width: inner * 0.85, height: inner * 0.85 }}
          contentFit="contain"
        />
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: '#FFFFFF',
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
