import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import type { BaseModalProps } from '@somethings-ui/core';
import {
  cn,
  modalContainerStyles,
  modalContentStyles,
} from '@somethings-ui/core';
import * as Haptics from 'expo-haptics';
import { ContentBlock } from '../content-block';

export interface ModalProps
  extends
    Omit<
      React.ComponentProps<typeof GorhomBottomSheetModal>,
      keyof BaseModalProps
    >,
    BaseModalProps {
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  descriptionClassName?: string;
  enableHaptics?: boolean;
  hapticIntensity?: Haptics.ImpactFeedbackStyle;
}

export const BottomSheetModal = React.forwardRef<
  GorhomBottomSheetModal,
  ModalProps
>(
  (
    {
      visible = false,
      children,
      title,
      dismissible = true,
      className,
      description,
      contentClassName,
      enableHaptics = true,
      hapticIntensity = Haptics.ImpactFeedbackStyle.Light,
      onDismiss,
      onClose,
      ...props
    },
    ref,
  ) => {
    const bottomSheetRef = React.useRef<GorhomBottomSheetModal>(null);
    const [contentHeight, setContentHeight] = React.useState(200); // Default fallback
    const { height } = useWindowDimensions();
    const snapPoints = React.useMemo(() => {
      const heightPercentage = Math.min((contentHeight / height) * 100, 90);
      return [`${heightPercentage}%`];
    }, [contentHeight]);

    React.useImperativeHandle(ref, () => bottomSheetRef.current!);

    React.useEffect(() => {
      if (visible) {
        bottomSheetRef.current?.present();
        if (enableHaptics) {
          Haptics.impactAsync(hapticIntensity);
        }
      } else {
        bottomSheetRef.current?.dismiss();
      }
    }, [visible, enableHaptics]);

    const handleContentLayout = React.useCallback((event: any) => {
      const { height } = event.nativeEvent.layout;
      setContentHeight(height + 40); // Add some padding
    }, []);

    const handleSheetChanges = React.useCallback(
      (index: number) => {
        if (index === -1) {
          // Bottom sheet was closed
          onDismiss?.();
          onClose?.();
        }
      },
      [onDismiss, onClose],
    );

    const renderBackdrop = React.useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          enableTouchThrough={!dismissible}
        />
      ),
      [dismissible],
    );

    return (
      <GorhomBottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={dismissible}
        enableDynamicSizing={false}
        onDismiss={() => {
          onDismiss?.();
        }}
        {...props}
      >
        <BottomSheetView
          className={cn(modalContainerStyles({ visible }), className)}
          onLayout={handleContentLayout}
        >
          {/* Header */}
          <ContentBlock
            header={title}
            body={description}
            className="mb-[32px]"
            alignment="left"
            size="m"
          />

          {/* Content */}
          <View className={cn(modalContentStyles(), contentClassName)}>
            {children}
          </View>
        </BottomSheetView>
      </GorhomBottomSheetModal>
    );
  },
);

BottomSheetModal.displayName = 'BottomSheetModal';
