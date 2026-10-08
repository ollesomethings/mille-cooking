import * as React from 'react';
import { View, Text, Pressable, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { cn } from '@somethings-ui/core';
import { Assets } from '@somethings-ui/core/src/assets';

export interface ForYouCardProps {
  smallTitle?: string;
  mainTitle?: string;
  ctaText?: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
  className?: string;
  smallTitleClassName?: string;
  mainTitleClassName?: string;
  ctaClassName?: string;
}

export const ForYouCard = React.forwardRef<View, ForYouCardProps>(
  (
    {
      smallTitle = 'Personalize',
      mainTitle = 'See photo drops from your mentor on your home screen.',
      ctaText = 'Add widget →',
      imageSource = Assets.forYouCard4,
      onPress,
      className,
      smallTitleClassName,
      mainTitleClassName,
      ctaClassName,
      ...props
    },
    ref,
  ) => {
    const cardContent = (
      <View
        ref={ref}
        className={cn('relative w-full h-48 rounded-3xl', className)}
        {...props}
      >
        <View className="absolute inset-0 rounded-3xl overflow-hidden">
          {imageSource && (
            <Image
              source={imageSource}
              className="absolute inset-0"
              style={{
                width: '100%',
                height: '100%',
              }}
              contentFit="cover"
            />
          )}
        </View>
        <View className="absolute inset-0 p-5 flex-col items-start justify-between">
          <View className="flex-col items-start gap-3">
            <Text
              className={cn('text-primary text-body-3 ', smallTitleClassName)}
            >
              {smallTitle}
            </Text>
            <Text
              className={cn(
                'text-primary text-base text-body-1 max-w-64',
                mainTitleClassName,
              )}
            >
              {mainTitle}
            </Text>
          </View>
          <Text
            className={cn(
              'text-primary text-base text-button-1 ',
              ctaClassName,
            )}
          >
            {ctaText}
          </Text>
        </View>
      </View>
    );

    if (onPress) {
      return <Pressable onPress={onPress}>{cardContent}</Pressable>;
    }

    return cardContent;
  },
);

ForYouCard.displayName = 'ForYouCard';
