import * as React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Portal, PortalHost } from '@gorhom/portal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type {
  BasePingProps,
  PingConfig,
  PingPosition,
} from '@somethings-ui/core';
import { cn, pingContainerStyles, pingTextStyles } from '@somethings-ui/core';

const PING_PORTAL_NAME = 'ping-host';
const DEFAULT_DURATION = 2000;

type PingEventListener = (config: PingConfig) => void;

class PingEventEmitter {
  private listeners: Set<PingEventListener> = new Set();

  subscribe(listener: PingEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(config: PingConfig): void {
    this.listeners.forEach(listener => listener(config));
  }
}

const globalPingEmitter = new PingEventEmitter();

export function globalPing(config: PingConfig): void {
  globalPingEmitter.emit(config);
}

type PingState = {
  visible: boolean;
  message: string;
  position: PingPosition;
  onDismiss?: () => void;
};

type PingContextType = {
  ping: (config: PingConfig) => void;
  dismiss: () => void;
};

const PingContext = React.createContext<PingContextType | null>(null);

export const usePing = () => {
  const context = React.useContext(PingContext);
  if (!context) {
    throw new Error('usePing must be used within a PingProvider');
  }
  return context;
};

interface PingProps extends BasePingProps {
  visible: boolean;
  onHide: () => void;
}

const Ping = ({
  message,
  visible,
  position = 'center',
  duration = DEFAULT_DURATION,
  onDismiss,
  onHide,
  className,
}: PingProps) => {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHide = React.useCallback(() => {
    onDismiss?.();
    onHide();
  }, [onDismiss, onHide]);

  const animateOut = React.useCallback(() => {
    opacity.set(
      withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) }),
    );
    scale.set(
      withTiming(
        0.95,
        { duration: 300, easing: Easing.out(Easing.ease) },
        () => {
          'worklet';
          scheduleOnRN(handleHide);
        },
      ),
    );
  }, [opacity, scale, handleHide]);

  React.useEffect(() => {
    if (visible) {
      opacity.set(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
      );
      scale.set(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
      );

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        animateOut();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration, opacity, scale, animateOut]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.get(),
      transform: [{ scale: scale.get() }],
    };
  }, [opacity, scale]);

  const positionStyle = React.useMemo(() => {
    switch (position) {
      case 'top':
        return {
          justifyContent: 'flex-start' as const,
          paddingTop: insets.top + 16,
        };
      case 'bottom':
        return {
          justifyContent: 'flex-end' as const,
          paddingBottom: insets.bottom + 16,
        };
      default:
        return { justifyContent: 'center' as const };
    }
  }, [position, insets]);

  if (!visible && opacity.get() === 0) return null;

  return (
    <Portal hostName={PING_PORTAL_NAME}>
      <Pressable
        style={[styles.overlay, positionStyle]}
        onPress={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          animateOut();
        }}
      >
        <Animated.View
          style={animatedStyle}
          className={cn(pingContainerStyles({ position }), className)}
        >
          <Text className={cn(pingTextStyles())}>{message}</Text>
        </Animated.View>
      </Pressable>
    </Portal>
  );
};

interface PingProviderProps {
  children: React.ReactNode;
  listenToGlobal?: boolean;
}

export const PingProvider = ({
  children,
  listenToGlobal = false,
}: PingProviderProps) => {
  const [state, setState] = React.useState<PingState>({
    visible: false,
    message: '',
    position: 'center',
  });

  const ping = React.useCallback((config: PingConfig) => {
    setState({
      visible: true,
      message: config.message,
      position: config.position ?? 'center',
    });
  }, []);

  const dismiss = React.useCallback(() => {
    setState(prev => ({ ...prev, visible: false }));
  }, []);

  const handleHide = React.useCallback(() => {
    setState(prev => ({ ...prev, visible: false }));
  }, []);

  React.useEffect(() => {
    if (!listenToGlobal) return;
    return globalPingEmitter.subscribe(ping);
  }, [listenToGlobal, ping]);

  return (
    <PingContext.Provider value={{ ping, dismiss }}>
      {children}
      <PortalHost name={PING_PORTAL_NAME} />
      <Ping
        visible={state.visible}
        message={state.message}
        position={state.position}
        onDismiss={state.onDismiss}
        onHide={handleHide}
      />
    </PingContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    zIndex: 9999,
  },
});

export type { PingConfig, PingPosition };
