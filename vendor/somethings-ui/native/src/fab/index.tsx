import { Portal, PortalHost } from '@gorhom/portal';
import {
  BaseFABProps,
  FABOption,
  cn,
  fabContainerStyles,
  fabOptionLabelStyles,
  fabOptionStyles,
} from '@somethings-ui/core';
import * as Haptics from 'expo-haptics';
import { Plus } from 'lucide-react-native';
import * as React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Extrapolation,
  ReduceMotion,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { IconButton, IconButtonProps } from '../icon-button';

const FAB_PORTAL_HOST_NAME = 'FABPortalHost';

export const FABPortal = () => <PortalHost name={FAB_PORTAL_HOST_NAME} />;

FABPortal.displayName = 'FABPortal';

const OPTION_SPACING = 72;

export interface FABProps
  extends BaseFABProps, Omit<IconButtonProps, 'icon' | 'onPress'> {
  style?: ViewStyle;
  animatedStyle?: ReturnType<typeof useAnimatedStyle>;
}

export interface FABRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const SPRING_CONFIG = {
  stiffness: 500,
  damping: 25,
  mass: 0.3,
  reduceMotion: ReduceMotion.System,
};

const FABOptionItem = ({
  option,
  index,
  progress,
  totalOptions,
  position,
  onPress,
}: {
  option: FABOption;
  index: number;
  progress: SharedValue<number>;
  totalOptions: number;
  position: 'bottom-left' | 'bottom-right';
  onPress: (event: GestureResponderEvent) => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const delay = (totalOptions - 1 - index) * 0.1;
    const adjustedProgress = Math.max(
      0,
      Math.min(1, (progress.get() - delay) / (1 - delay)),
    );

    const translateY = interpolate(
      adjustedProgress,
      [0, 1],
      [50, -(index + 1) * OPTION_SPACING],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      adjustedProgress,
      [0, 0.5, 1],
      [0.3, 0.8, 1],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      adjustedProgress,
      [0, 0.3, 1],
      [0, 0.5, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  const {
    id: _id,
    label,
    subLabel,
    icon,
    variant = 'primary',
    size = 'xl',
    className: optionClassName,
    disabled,
    ...iconButtonProps
  } = option;

  return (
    <Animated.View
      style={[
        styles.optionItem,
        position === 'bottom-left'
          ? styles.optionItemLeft
          : styles.optionItemRight,
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={disabled ? undefined : onPress}
        className={cn(fabOptionStyles({ position }))}
      >
        <View
          style={
            position === 'bottom-right'
              ? styles.labelContainerRight
              : styles.labelContainerLeft
          }
        >
          <Text className={cn(fabOptionLabelStyles({ position }))}>
            {label}
          </Text>
          {subLabel && (
            <Text
              style={[
                styles.subLabel,
                position === 'bottom-right'
                  ? styles.subLabelRight
                  : styles.subLabelLeft,
              ]}
            >
              {subLabel}
            </Text>
          )}
        </View>
        <IconButton
          icon={icon}
          variant={variant}
          size={size}
          className={optionClassName}
          onPress={disabled ? undefined : onPress}
          enableHaptics={false}
          {...iconButtonProps}
        />
      </Pressable>
    </Animated.View>
  );
};

export const FAB = React.forwardRef<FABRef, FABProps>(
  (
    {
      options,
      position = 'bottom-right',
      bottomOffset,
      horizontalOffset,
      onOpenChange,
      className,
      style,
      animatedStyle,
      // IconButton props for trigger
      variant = 'primary',
      size = 'xl',
      shape,
      disabled,
      enableHaptics = true,
      hapticIntensity = Haptics.ImpactFeedbackStyle.Medium,
      ...props
    },
    ref,
  ) => {
    const fabRef = React.useRef<View>(null);
    const isOpenValue = useSharedValue(0);
    const progress = useSharedValue(0);

    const handleOpen = React.useCallback(() => {
      scheduleOnUI(() => {
        'worklet';
        isOpenValue.set(withSpring(1, SPRING_CONFIG));
        progress.set(withSpring(1, SPRING_CONFIG));
      });
      onOpenChange?.(true);
    }, [isOpenValue, progress, onOpenChange]);

    const handleClose = React.useCallback(() => {
      scheduleOnUI(() => {
        'worklet';
        isOpenValue.set(withSpring(0, SPRING_CONFIG));
        progress.set(withSpring(0, SPRING_CONFIG));
      });
      onOpenChange?.(false);
    }, [isOpenValue, progress, onOpenChange]);

    const handleToggle = React.useCallback(() => {
      const targetValue = isOpenValue.get() === 0 ? 1 : 0;

      if (enableHaptics) {
        Haptics.impactAsync(hapticIntensity);
      }

      scheduleOnUI(() => {
        'worklet';
        isOpenValue.set(withSpring(targetValue, SPRING_CONFIG));
        progress.set(withSpring(targetValue, SPRING_CONFIG));
      });
      onOpenChange?.(targetValue === 1);
    }, [enableHaptics, hapticIntensity, isOpenValue, progress, onOpenChange]);

    const handleOptionPress = React.useCallback(
      (option: FABOption, event: GestureResponderEvent) => {
        if (enableHaptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        option.onPress?.(event);

        scheduleOnUI(() => {
          'worklet';
          isOpenValue.set(withSpring(0, SPRING_CONFIG));
          progress.set(withSpring(0, SPRING_CONFIG));
        });
        onOpenChange?.(false);
      },
      [enableHaptics, isOpenValue, progress, onOpenChange],
    );

    const handleBackdropPress = React.useCallback(() => {
      if (enableHaptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      scheduleOnUI(() => {
        'worklet';
        isOpenValue.set(withSpring(0, SPRING_CONFIG));
        progress.set(withSpring(0, SPRING_CONFIG));
      });
      onOpenChange?.(false);
    }, [enableHaptics, isOpenValue, progress, onOpenChange]);

    const iconRotationStyle = useAnimatedStyle(() => {
      const rotation = interpolate(
        isOpenValue.get(),
        [0, 1],
        [0, 45],
        Extrapolation.CLAMP,
      );
      return {
        transform: [{ rotate: `${rotation}deg` }],
      };
    });

    const backdropStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        progress.get(),
        [0, 1],
        [0, 1],
        Extrapolation.CLAMP,
      );
      return {
        opacity,
        pointerEvents: progress.get() > 0.1 ? 'auto' : 'none',
      };
    });

    const positionStyle = React.useMemo(() => {
      const positionStyles: {
        bottom?: number;
        left?: number;
        right?: number;
      } = {};

      if (bottomOffset !== undefined) {
        positionStyles.bottom = bottomOffset;
      }
      if (horizontalOffset !== undefined) {
        if (position === 'bottom-left') {
          positionStyles.left = horizontalOffset;
        } else {
          positionStyles.right = horizontalOffset;
        }
      }

      return positionStyles;
    }, [bottomOffset, horizontalOffset, position]);

    React.useImperativeHandle(
      ref,
      () => ({
        open: handleOpen,
        close: handleClose,
        toggle: handleToggle,
        isOpen: isOpenValue.get() === 1,
      }),
      [isOpenValue],
    );

    return (
      <Portal hostName={FAB_PORTAL_HOST_NAME}>
        <Animated.View
          style={[StyleSheet.absoluteFill, backdropStyle]}
          pointerEvents="box-none"
        >
          <Svg style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient
                id="fabBackdropGradient"
                cx="63.39%"
                cy="73.24%"
                rx="56.37%"
                ry="67.17%"
              >
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.7} />
              </RadialGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#fabBackdropGradient)"
            />
          </Svg>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleBackdropPress}
          />
        </Animated.View>

        <Animated.View
          ref={fabRef}
          className={cn(fabContainerStyles({ position }))}
          // Local change vs upstream somethings-ui: reanimated 4's stricter
          // style types reject the possibly-undefined `style` prop in an array
          style={[positionStyle, style as object, animatedStyle]}
        >
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <FABOptionItem
                key={option.id}
                option={option}
                index={index}
                progress={progress}
                totalOptions={options.length}
                position={position}
                onPress={event => handleOptionPress(option, event)}
              />
            ))}
          </View>

          <View style={styles.fabButton}>
            <IconButton
              icon={
                <Animated.View style={iconRotationStyle}>
                  <Plus size={28} color="white" strokeWidth={2.5} />
                </Animated.View>
              }
              variant={variant}
              size={size}
              shape={shape}
              disabled={disabled}
              onPress={handleToggle}
              enableHaptics={false}
              className={cn('bg-orange-500 border-0', className)}
              {...props}
            />
          </View>
        </Animated.View>
      </Portal>
    );
  },
);

FAB.displayName = 'FAB';

const styles = StyleSheet.create({
  optionsContainer: {
    position: 'absolute',
    bottom: 0,
    // left: 0,
    right: 0,
  },
  optionItem: {
    position: 'absolute',
    bottom: 0,
  },
  optionItemRight: {
    right: 0,
    alignItems: 'flex-end',
  },
  optionItemLeft: {
    left: 0,
    alignItems: 'flex-start',
  },
  fabButton: {
    zIndex: 10,
  },
  labelContainerRight: {
    alignItems: 'flex-end',
  },
  labelContainerLeft: {
    alignItems: 'flex-start',
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  subLabelRight: {
    color: '#6B7280',
    textAlign: 'right',
  },
  subLabelLeft: {
    color: '#6B7280',
    textAlign: 'left',
  },
});
