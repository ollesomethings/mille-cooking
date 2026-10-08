import React from 'react';
import { Text, View } from 'react-native';
import { ArrowLeftIcon, XIcon } from 'lucide-react-native';
import { cn } from '@somethings-ui/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '../icon-button';

export interface HeaderRootProps {
  children: React.ReactNode;
  className?: string;
  useSafeArea?: boolean;
}

function HeaderRoot({
  children,
  className,
  useSafeArea = true,
}: HeaderRootProps) {
  const { top } = useSafeAreaInsets();
  return (
    <View
      className={cn('relative min-h-14', className)}
      style={useSafeArea ? { paddingTop: top } : undefined}
    >
      <View className="flex-row items-center justify-between px-4 min-h-14">
        {children}
      </View>
    </View>
  );
}

export interface HeaderLeftProps {
  children?: React.ReactNode;
  className?: string;
}

function HeaderLeft({ children, className }: HeaderLeftProps) {
  return (
    <View className={cn('min-w-12 items-start', className)}>{children}</View>
  );
}

export interface HeaderCenterProps {
  children?: React.ReactNode;
  className?: string;
}

function HeaderCenter({ children, className }: HeaderCenterProps) {
  return (
    <View className={cn('flex-1 items-center px-12', className)}>
      {children}
    </View>
  );
}

export interface HeaderRightProps {
  children?: React.ReactNode;
  className?: string;
}

function HeaderRight({ children, className }: HeaderRightProps) {
  return (
    <View
      className={cn(
        'min-w-12 flex-row items-center justify-end gap-1',
        className,
      )}
    >
      {children}
    </View>
  );
}

export interface HeaderTitleProps {
  children?: React.ReactNode;
  className?: string;
}

function HeaderTitle({ children, className }: HeaderTitleProps) {
  return (
    <View
      className="absolute left-0 right-0 items-center justify-center min-h-14"
      pointerEvents="none"
    >
      <Text
        className={cn(
          'font-avantt text-xl text-primary text-center',
          className,
        )}
        numberOfLines={1}
      >
        {children}
      </Text>
    </View>
  );
}

export interface HeaderBackButtonProps {
  onPress?: () => void;
  variant?: 'header-ghost' | 'header-glass' | 'header-elevated';
  iconColor?: string;
  iconSize?: number;
}

function HeaderBackButton({
  onPress,
  variant = 'header-ghost',
  iconColor = '#000',
  iconSize = 24,
}: HeaderBackButtonProps) {
  return (
    <IconButton
      icon={<ArrowLeftIcon size={iconSize} color={iconColor} />}
      variant={variant}
      onPress={onPress}
      size="lg"
    />
  );
}

export interface HeaderCloseButtonProps {
  onPress?: () => void;
  variant?: 'header-ghost' | 'header-glass' | 'header-elevated';
  iconColor?: string;
  iconSize?: number;
}

function HeaderCloseButton({
  onPress,
  variant = 'header-ghost',
  iconColor = '#000',
  iconSize = 24,
}: HeaderCloseButtonProps) {
  return (
    <IconButton
      icon={<XIcon size={iconSize} color={iconColor} />}
      variant={variant}
      onPress={onPress}
      size="lg"
    />
  );
}

export const Header = Object.assign(HeaderRoot, {
  Left: HeaderLeft,
  Center: HeaderCenter,
  Right: HeaderRight,
  Title: HeaderTitle,
  BackButton: HeaderBackButton,
  CloseButton: HeaderCloseButton,
});

export type { HeaderProps } from './legacy';
export { LegacyHeader } from './legacy';
export default Header;
