import {
  BaseSelectGroupProps,
  cn,
  SelectGroupItemProps,
  SelectGroupOption,
  selectGroupStyles,
  selectItemStyles,
  selectGroupLabelStyles,
} from '@somethings-ui/core';
import * as Haptics from 'expo-haptics';
import { Circle } from 'lucide-react-native';
import React, { useCallback, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Svg, {
  Path,
  Circle as SvgCircle,
  G,
  Defs,
  ClipPath,
  Rect,
} from 'react-native-svg';
import Animated, {
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Checkbox_base.svg component - for radio button selected state
const CheckboxBase = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <SvgCircle
      cx="8"
      cy="8"
      r="7"
      stroke="#1F1E1D"
      strokeWidth="1.5"
      fill="none"
    />
    <SvgCircle cx="8" cy="8" r="4" fill="#1F1E1D" />
  </Svg>
);

// Check_Icon.svg component - for multi-select selected state
const CheckIcon = ({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    className={className}
  >
    <SvgCircle cx="6" cy="6" r="6" fill="#2F2B26" />
    <G clipPath="url(#clip0_49_4602)">
      <Path
        d="M8.5 4L5.5 7.5L3.5 5.5"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_49_4602">
        <Rect
          width="10.6667"
          height="10.6667"
          fill="white"
          transform="translate(0.166748 0.33374)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);

const SelectGroupItem = React.forwardRef<
  View,
  SelectGroupItemProps & { multiple?: boolean }
>(
  (
    {
      option,
      isSelected,
      onClick,
      variant,
      className,
      selectedItemClassName,
      iconClassName,
      checkmarkClassName,
      textAlign = 'left',
      textClassName,
      selectedTextClassName,
      height,
      disabled,
      description,
      multiple = false,
      ...props
    },
    ref,
  ) => {
    // Animation for option icon scaling
    const iconScale = useSharedValue(1);

    useEffect(() => {
      scheduleOnUI(() => {
        'worklet';
        iconScale.value = withSpring(isSelected ? 0.8 : 1, {
          damping: 20,
          stiffness: 350,
          mass: 0.8,
        });
      });
    }, [isSelected, iconScale]);

    // Animation for checkmark/radio button scaling
    const checkmarkScale = useSharedValue(0);

    useEffect(() => {
      scheduleOnUI(() => {
        'worklet';
        if (isSelected) {
          checkmarkScale.value = withSpring(1, {
            damping: 22,
            stiffness: 350,
            mass: 0.8,
          });
        } else {
          checkmarkScale.value = withTiming(0, {
            duration: 100,
          });
        }
      });
    }, [isSelected, checkmarkScale]);

    const animatedCheckmarkStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: checkmarkScale.value }],
      };
    });

    return (
      <AnimatedPressable
        ref={ref}
        onPress={onClick}
        className={cn(
          selectItemStyles({
            variant,
            selected: isSelected,
            disabled,
            height: height as 'tall' | 'short' | undefined,
            hasIcon: !!option.icon,
          }),
          className,
          isSelected && selectedItemClassName,
        )}
        layout={LinearTransition.springify()}
        disabled={disabled}
        {...props}
      >
        <View>
          <View
            className={cn(
              'flex-row items-center min-w-0',
              textAlign === 'left' && 'justify-start',
              textAlign === 'center' && 'justify-center',
              textAlign === 'right' && 'justify-end flex-row-reverse',
            )}
          >
            {option.icon && (
              <View
                className={cn(
                  'mr-[8px] flex-shrink-0 self-center',
                  iconClassName,
                )}
              >
                {option.icon}
              </View>
            )}
            <View
              className={cn(
                'min-w-0',
                variant !== 'inline' ? 'flex-[3]' : 'flex-initial',
              )}
            >
              <Animated.Text
                numberOfLines={3}
                className={cn(
                  selectGroupLabelStyles({
                    variant,
                    selected: isSelected,
                    textAlign,
                  }),
                  textClassName,
                  isSelected && selectedTextClassName,
                )}
                layout={LinearTransition.springify()}
              >
                {option.label}
              </Animated.Text>
              {description && (
                <Animated.Text
                  numberOfLines={3}
                  className={cn(
                    'text-[14px] text-brand-trueBlack mt-1',
                    textClassName,
                  )}
                  layout={LinearTransition.springify()}
                >
                  {description}
                </Animated.Text>
              )}
            </View>
            {textAlign !== 'center' && variant === 'stacked' && (
              <View className="flex-1" />
            )}
            <Animated.View
              className={'ml-2 self-center'}
              layout={LinearTransition.springify()}
            >
              {isSelected ? (
                <Animated.View style={animatedCheckmarkStyle}>
                  {multiple ? (
                    <CheckIcon
                      size={16}
                      className={cn('flex-shrink-0', checkmarkClassName)}
                    />
                  ) : (
                    <CheckboxBase size={height === 'tall' ? 20 : 16} />
                  )}
                </Animated.View>
              ) : (
                <Circle
                  className={cn('flex-shrink-0', checkmarkClassName)}
                  size={height === 'tall' ? 20 : 16}
                  color="#DFDAD3"
                  strokeWidth={2}
                />
              )}
            </Animated.View>
          </View>
        </View>
      </AnimatedPressable>
    );
  },
);

SelectGroupItem.displayName = 'SelectGroupItem';

export interface SelectGroupProps
  extends
    Omit<React.ComponentProps<typeof View>, keyof BaseSelectGroupProps>,
    BaseSelectGroupProps {
  enableHaptics?: boolean;
  hapticIntensity?: Haptics.ImpactFeedbackStyle;
  height?: 'tall' | 'short';
  itemStyle?: string;
}

export const SelectGroup = React.forwardRef<View, SelectGroupProps>(
  (
    {
      options,
      value,
      onChange,
      variant = 'stacked',
      multiple = false,
      enableHaptics = true,
      hapticIntensity = Haptics.ImpactFeedbackStyle.Light,
      className,
      itemClassName,
      selectedItemClassName,
      iconClassName,
      checkmarkClassName,
      textClassName,
      selectedTextClassName,
      textAlign = 'left',
      maxSelected = undefined,
      height = 'tall',
      itemStyle,
      ...props
    },
    ref,
  ) => {
    const selectedCount = multiple ? (value as string[])?.length || 0 : 0;

    const shouldShowNumber = multiple && maxSelected !== undefined;

    const handleSelect = useCallback(
      async (option: SelectGroupOption) => {
        if (enableHaptics) {
          Haptics.impactAsync(hapticIntensity);
        }

        const isAlreadySelected =
          multiple && value && (value as string[]).indexOf(option.value) !== -1;

        if (
          shouldShowNumber &&
          selectedCount >= maxSelected &&
          !isAlreadySelected
        ) {
          return;
        }

        if (multiple) {
          const currentValue = (value as string[]) || [];
          const newValue = currentValue.includes(option.value)
            ? currentValue.filter(v => v !== option.value)
            : [...currentValue, option.value];
          onChange(newValue);
        } else {
          onChange(option.value);
        }
      },
      [
        enableHaptics,
        hapticIntensity,
        maxSelected,
        multiple,
        onChange,
        selectedCount,
        shouldShowNumber,
      ],
    );

    const isSelected = useCallback(
      (optionValue: string) => {
        if (multiple) {
          return (
            (value as string[] | undefined)?.includes(optionValue) || false
          );
        }
        return value === optionValue;
      },
      [multiple, value],
    );

    return (
      <View
        ref={ref}
        className={cn(selectGroupStyles({ variant }), className)}
        {...props}
      >
        {options.map((option: SelectGroupOption, _index: number) => {
          const count = multiple
            ? (value as string[])?.indexOf(option.value) + 1
            : 0;

          return (
            <SelectGroupItem
              key={option.value}
              option={option}
              isSelected={isSelected(option.value)}
              onClick={() => handleSelect(option)}
              variant={variant}
              className={cn(itemClassName, itemStyle)}
              selectedItemClassName={selectedItemClassName}
              iconClassName={iconClassName}
              checkmarkClassName={checkmarkClassName}
              textClassName={textClassName}
              selectedTextClassName={selectedTextClassName}
              textAlign={textAlign}
              count={shouldShowNumber ? count : undefined}
              multiple={multiple}
              height={height}
              description={option.description}
              disabled={
                shouldShowNumber &&
                selectedCount >= maxSelected &&
                !isSelected(option.value)
              }
            />
          );
        })}
      </View>
    );
  },
);

SelectGroup.displayName = 'SelectGroup';
