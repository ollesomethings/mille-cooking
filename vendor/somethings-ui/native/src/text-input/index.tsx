import * as React from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { cn, colorsV2 } from '@somethings-ui/core';
import type { BaseTextInputProps } from '@somethings-ui/core';
import {
  containerStyles,
  inputStyles,
  labelStyles,
  errorStyles,
  helperTextStyles,
  iconContainerStyles,
} from '@somethings-ui/core';

export interface TextInputProps
  extends
    Omit<RNTextInputProps, keyof BaseTextInputProps>,
    BaseTextInputProps {}

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (
    {
      className,
      inputClassName,
      labelClassName,
      errorClassName,
      helperTextClassName,
      label,
      error,
      helperText,
      leadingIcon,
      trailingIcon,
      variant = 'default',
      placeholderTextColor,
      ...props
    },
    ref,
  ) => {
    return (
      <View className={cn(containerStyles({ variant }), className)}>
        {label && (
          <Text
            className={cn(labelStyles({ error: !!error }), labelClassName)}
            nativeID={props.id}
          >
            {label}
          </Text>
        )}
        <View className="relative">
          {leadingIcon && (
            <View className={cn(iconContainerStyles({ position: 'left' }))}>
              {leadingIcon}
            </View>
          )}
          <RNTextInput
            ref={ref}
            className={cn(
              inputStyles({
                variant,
                error: !!error,
              }),
              leadingIcon && 'pl-10',
              trailingIcon && 'pr-10',
              inputClassName,
            )}
            placeholderTextColor={
              placeholderTextColor || colorsV2.text.placeholder
            }
            {...props}
          />
          {trailingIcon && (
            <View className={cn(iconContainerStyles({ position: 'right' }))}>
              {trailingIcon}
            </View>
          )}
        </View>
        {error && (
          <Text className={cn(errorStyles(), errorClassName)}>{error}</Text>
        )}
        {helperText && !error && (
          <Text className={cn(helperTextStyles(), helperTextClassName)}>
            {helperText}
          </Text>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';
