import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import {
  getInitials,
  getAvatarBackgroundColor,
  getAvatarSizeValue,
  calculateOverlap,
  type BaseAvatarProps,
  type AvatarStackProps,
  DEFAULT_AVATAR_SIZE,
  DEFAULT_STACK_SIZE,
  DEFAULT_OVERLAP_PERCENTAGE,
  AVATAR_FONT_SIZE_RATIO,
  AVATAR_IMAGE_BACKGROUND,
} from '@somethings-ui/core';
import { cn } from '@somethings-ui/core';

export interface AvatarProps extends BaseAvatarProps {
  onPress?: () => void;
}

export const Avatar = ({
  onPress,
  imageUrl,
  size = DEFAULT_AVATAR_SIZE,
  variant = 'default',
  className,
  name,
}: AvatarProps) => {
  const sizeValue = getAvatarSizeValue(size, DEFAULT_AVATAR_SIZE);
  const initials = getInitials(name);
  const backgroundColor = getAvatarBackgroundColor(name);

  const picture = (
    <View
      className={cn(
        'justify-center items-center overflow-hidden',
        variant === 'glass' && 'bg-white/20',
        className,
      )}
      style={{
        width: sizeValue,
        height: sizeValue,
        borderRadius: sizeValue / 2,
        backgroundColor: imageUrl
          ? AVATAR_IMAGE_BACKGROUND
          : variant === 'glass'
            ? 'rgba(255, 255, 255, 0.15)'
            : backgroundColor,
      }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: sizeValue,
            height: sizeValue,
            borderRadius: sizeValue / 2,
          }}
          contentFit="cover"
        />
      ) : (
        <Text
          className="font-avantt text-primary"
          style={{
            fontSize: sizeValue * AVATAR_FONT_SIZE_RATIO,
            color: variant === 'glass' ? 'white' : undefined,
          }}
        >
          {initials}
        </Text>
      )}
    </View>
  );

  if (onPress)
    return <TouchableOpacity onPress={onPress}>{picture}</TouchableOpacity>;

  return picture;
};

export const AvatarStack = ({
  avatars,
  size = DEFAULT_STACK_SIZE,
  overlapPercentage = DEFAULT_OVERLAP_PERCENTAGE,
  className,
  showBorder = true,
  reverse = false,
}: AvatarStackProps) => {
  const sizeValue = getAvatarSizeValue(size, DEFAULT_STACK_SIZE);
  const overlap = overlapPercentage ?? DEFAULT_OVERLAP_PERCENTAGE;

  return (
    <View className={cn('flex-row', className)}>
      {avatars.map((avatar, i) => {
        const overlapAmount = calculateOverlap(sizeValue, overlap, i);
        return (
          <View
            key={avatar.imageUrl || `fallback-${i}`}
            className={cn('bg-white', showBorder && 'border-2 border-white')}
            style={{
              marginLeft: overlapAmount > 0 ? -overlapAmount : 0,
              borderRadius: sizeValue / 2,
              zIndex: reverse ? avatars.length - i : i,
            }}
          >
            <Avatar
              imageUrl={avatar.imageUrl}
              size={sizeValue}
              name={avatar.name}
              variant="default"
            />
          </View>
        );
      })}
    </View>
  );
};
