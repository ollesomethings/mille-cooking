import { cn } from '@somethings-ui/core';
import { ReactNode } from 'react';
import { Animated, Text, View } from 'react-native';
import { Button } from '../button';

export interface ToastProps {
  title: string;
  description?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  primaryButton?: {
    text: string;
    onPress: () => void;
    buttonProps?: React.ComponentProps<typeof Button>;
  };
  secondaryButton?: {
    text: string;
    onPress: () => void;
    buttonProps?: React.ComponentProps<typeof Button>;
  };
  showProgressBar?: boolean;
  duration?: number;
  floatingRightIcon?: boolean;
}

export const Toast = ({
  title,
  description,
  leftIcon,
  rightIcon,
  primaryButton,
  secondaryButton,
  showProgressBar = false,
  duration = 3000,
  floatingRightIcon = false,
}: ToastProps) => {
  const progressAnimation = new Animated.Value(0);

  const { className: primaryButtonClassName, ...primaryButtonProps } =
    primaryButton?.buttonProps || {};
  const { className: secondaryButtonClassName, ...secondaryButtonProps } =
    secondaryButton?.buttonProps || {};

  if (showProgressBar) {
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }

  return (
    <View
      className="rounded-lg bg-white p-4 m-2 w-[95%]"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 4,
      }}
    >
      <View className="flex-row w-full">
        {/* Left Icon */}
        {leftIcon && <View className="mr-3 w-14 h-14">{leftIcon}</View>}

        {/* Content */}
        <View className="flex-1 z-20">
          <Text
            className={cn(
              'text-header-5 font-avantt text-primary mb-1.5',
              floatingRightIcon && rightIcon && 'mr-24',
            )}
          >
            {title}
          </Text>
          {description && (
            <Text
              className={cn(
                'text-body-2 font-twk text-secondary mb-2',
                floatingRightIcon && rightIcon && 'mr-24',
              )}
            >
              {description}
            </Text>
          )}
        </View>

        {/* Right Icon */}
        {rightIcon && (
          <View
            className={cn(
              'w-24 h-24',
              floatingRightIcon
                ? 'absolute -top-4 -right-4 z-10'
                : 'ml-3 self-start',
            )}
          >
            {rightIcon}
          </View>
        )}
      </View>

      {/* Progress Bar */}
      {showProgressBar && (
        <View className="h-2 rounded-full w-full mt-2 mb-1 bg-blue-100 overflow-hidden">
          <Animated.View
            className="h-full bg-blue-500 absolute top-0 left-0 right-0"
            style={{
              width: progressAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
        </View>
      )}

      {/* Buttons */}
      {(primaryButton || secondaryButton) && (
        <View className="flex-row gap-2 mt-3 w-full">
          {secondaryButton && (
            <Button
              variant="secondary"
              onPress={secondaryButton.onPress}
              shape="pill"
              size="md"
              style={{ flex: 1 }}
              className={secondaryButtonClassName}
              {...secondaryButtonProps}
            >
              {secondaryButton.text}
            </Button>
          )}
          {primaryButton && (
            <Button
              variant="primary"
              onPress={primaryButton.onPress}
              shape="pill"
              size="md"
              style={{ flex: 1 }}
              className={primaryButtonClassName}
              {...primaryButtonProps}
            >
              {primaryButton.text}
            </Button>
          )}
        </View>
      )}
    </View>
  );
};
