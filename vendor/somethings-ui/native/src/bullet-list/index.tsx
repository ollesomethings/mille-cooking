import { cn } from '@somethings-ui/core';
import React from 'react';
import { View, Text } from 'react-native';

export interface BulletListProps {
  items: string[];
  bulletSize?: number;
  containerClassName?: string;
  itemContainerClassName?: string;
  bulletClassName?: string;
  textClassName?: string;
}

export const BulletList: React.FC<BulletListProps> = ({
  items,
  bulletSize = 4,
  containerClassName,
  itemContainerClassName,
  bulletClassName,
  textClassName,
}) => {
  return (
    <View className={cn('space-y-3', containerClassName)}>
      {items.map((item, index) => (
        <View
          key={index}
          className={cn(
            'flex-row items-center',
            index !== items.length - 1 && 'mb-3',
            itemContainerClassName,
          )}
        >
          <View
            className={cn('bg-gray-600 mr-2 rounded-full', bulletClassName)}
            style={{
              width: bulletSize,
              height: bulletSize,
            }}
          />
          <Text className={cn('flex-1 text-base text-gray-600', textClassName)}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default BulletList;
