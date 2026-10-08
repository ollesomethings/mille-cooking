import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeftIcon } from 'lucide-react-native';
import { cn } from '@somethings-ui/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  titleComponent?: React.ReactNode;
  containerClassName?: string;
  titleClassName?: string;
  backIconColor?: string;
  backIconSize?: number;
  useSafeArea?: boolean;
}

export function LegacyHeader({
  title = 'SOMETHINGS',
  showBack = true,
  onBack,
  rightComponent,
  leftComponent,
  titleComponent,
  containerClassName,
  titleClassName,
  backIconColor = '#000',
  backIconSize = 24,
  useSafeArea = true,
}: HeaderProps) {
  const { top } = useSafeAreaInsets();

  const renderLeft = () => {
    if (leftComponent) return leftComponent;
    if (!showBack) return <View className="w-10" />;

    return (
      <TouchableOpacity
        onPress={onBack}
        className="w-10 h-10 justify-center"
        disabled={!onBack}
      >
        <ArrowLeftIcon color={backIconColor} size={backIconSize} />
      </TouchableOpacity>
    );
  };

  const renderTitle = () => {
    if (titleComponent) return titleComponent;

    return (
      <Text
        className={cn(
          'flex-1 text-center font-avantt text-2xl text-black',
          titleClassName,
        )}
        numberOfLines={1}
      >
        {title}
      </Text>
    );
  };

  const renderRight = () => {
    if (rightComponent) return rightComponent;
    return <View className="w-10" />;
  };

  return (
    <View
      className={cn('flex-row items-center px-4', containerClassName)}
      style={useSafeArea ? { paddingTop: top } : undefined}
    >
      {renderLeft()}
      {renderTitle()}
      {renderRight()}
    </View>
  );
}
