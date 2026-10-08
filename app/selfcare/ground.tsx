import { ConfettiBurst } from '@/components/proto/bursts';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { PressableScale } from '@/components/ui/pressable-scale';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { EASE_STANDARD } from '@/lib/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedEntrance = ({ children }: { children: React.ReactNode }) => (
  <Animated.View entering={FadeInDown.delay(200).springify().damping(18)}>
    {children}
  </Animated.View>
);

/**
 * 5-4-3-2-1 sensory grounding as a camera scavenger hunt. The camera is a
 * live LOCAL preview only — nothing is captured, recorded, or uploaded,
 * and the screen says so. "Found one" grabs the current frame just long
 * enough to blow it up: a polaroid pops in, then explodes into confetti.
 * The frame lives in memory for ~a second and is thrown away.
 * If the camera is unavailable or denied, the exercise still works.
 */
const STEPS = [
  { count: 5, line: 'Point your camera at 5 things you can see' },
  { count: 4, line: 'Find 4 things you can touch' },
  { count: 3, line: 'Listen for 3 things you can hear' },
  { count: 2, line: 'Find 2 things you can smell' },
  { count: 1, line: 'Find 1 thing you can taste' },
] as const;

/** Web-only live camera preview via getUserMedia — purely local. */
function LocalCameraPreview({
  onUnavailable,
  videoElRef,
}: {
  onUnavailable: () => void;
  videoElRef: React.MutableRefObject<HTMLVideoElement | null>;
}) {
  useEffect(() => {
    if (Platform.OS !== 'web' || !navigator.mediaDevices?.getUserMedia) {
      onUnavailable();
      return;
    }
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(s => {
        stream = s;
        if (videoElRef.current) {
          videoElRef.current.srcObject = s;
          videoElRef.current.play().catch(() => {});
        }
      })
      .catch(() => onUnavailable());
    return () => stream?.getTracks().forEach(t => t.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Platform.OS !== 'web') return null;
  return React.createElement('video', {
    ref: (el: HTMLVideoElement | null) => {
      videoElRef.current = el;
    },
    autoPlay: true,
    muted: true,
    playsInline: true,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  });
}

/** Grab the current video frame as a small in-memory data URI (cover crop). */
function captureFrame(video: HTMLVideoElement | null): string | null {
  if (!video || !video.videoWidth) return null;
  try {
    const W = 240;
    const H = 300;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const scale = Math.max(W / video.videoWidth, H / video.videoHeight);
    const sw = W / scale;
    const sh = H / scale;
    ctx.drawImage(
      video,
      (video.videoWidth - sw) / 2,
      (video.videoHeight - sh) / 2,
      sw,
      sh,
      0,
      0,
      W,
      H,
    );
    return canvas.toDataURL('image/jpeg', 0.7);
  } catch {
    return null;
  }
}

/** Snapshot pops in as a polaroid, then detonates into confetti. */
function SnapExplosion({ uri }: { uri: string | null }) {
  const [boom, setBoom] = useState(false);
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      520,
      withTiming(1, { duration: 260, easing: Easing.in(Easing.quad) }),
    );
    const id = setTimeout(() => {
      buzz.heavy();
      setBoom(true);
    }, 540);
    return () => clearTimeout(id);
  }, [t]);

  const polaroid = useAnimatedStyle(() => ({
    opacity: 1 - t.value,
    transform: [{ rotate: '-5deg' }, { scale: 1 + t.value * 0.5 }],
  }));
  const rot = useMemo(() => -6 + Math.random() * 12, []);

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 items-center justify-center"
    >
      {uri && (
        <Animated.View
          entering={ZoomIn.springify().damping(12)}
          style={[
            {
              padding: 8,
              paddingBottom: 26,
              backgroundColor: '#FFFFFF',
              borderRadius: 6,
              transform: [{ rotate: `${rot}deg` }],
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            },
            polaroid,
          ]}
        >
          {React.createElement('img', {
            src: uri,
            style: { width: 150, height: 190, borderRadius: 2, objectFit: 'cover' },
          })}
        </Animated.View>
      )}
      {boom && <ConfettiBurst count={16} spread={170} duration={850} />}
    </View>
  );
}

export default function Ground() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(0);
  const [found, setFound] = useState(0);
  const [cameraOff, setCameraOff] = useState(false);
  const [snap, setSnap] = useState<{ id: number; uri: string | null } | null>(null);
  const startedAt = useRef(Date.now());
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const snapId = useRef(1);

  const step = STEPS[stepIndex];
  const remaining = step.count - found;

  const foundOne = () => {
    buzz.medium();
    // Blow up what the camera sees right now (transient, in-memory only)
    const uri = Platform.OS === 'web' && !cameraOff ? captureFrame(videoElRef.current) : null;
    const id = snapId.current++;
    setSnap({ id, uri });
    setTimeout(() => setSnap(s => (s && s.id === id ? null : s)), 1400);

    if (found + 1 < step.count) {
      setFound(found + 1);
      return;
    }
    if (stepIndex + 1 < STEPS.length) {
      buzz.success();
      setStepIndex(stepIndex + 1);
      setFound(0);
      return;
    }
    track('offline_tool_completed', {
      tool: 'ground',
      duration_s: Math.round((Date.now() - startedAt.current) / 1000),
    });
    router.replace('/selfcare/done?tool=ground');
  };

  return (
    <View className="flex-1 bg-brand-trueBlack">
      {!cameraOff && (
        <LocalCameraPreview
          onUnavailable={() => setCameraOff(true)}
          videoElRef={videoElRef}
        />
      )}
      {/* scrims so text stays readable over any camera feed */}
      <View
        className="absolute inset-x-0 top-0"
        style={{ height: 220, backgroundColor: 'rgba(0,0,0,0.45)' }}
      />
      <View
        className="absolute inset-x-0 bottom-0"
        style={{ height: 300, backgroundColor: 'rgba(0,0,0,0.45)' }}
      />

      <View className="flex-1 px-6" style={{ paddingTop: insets.top + 16 }}>
        <Animated.View
          entering={FadeInDown.duration(420).easing(EASE_STANDARD)}
          className="self-center flex-row items-center rounded-full px-4 py-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', gap: 6 }}
        >
          <Camera size={13} color="#FFFFFF" strokeWidth={2} />
          <Text className="text-white text-center" style={{ fontSize: 12, fontFamily: 'TWKLausanne-400' }}>
            Nothing is recorded or uploaded — this stays on your phone.
          </Text>
        </Animated.View>

        <Animated.Text
          key={`line-${stepIndex}`}
          entering={FadeInDown.delay(120).duration(380).easing(EASE_STANDARD)}
          className="font-avantt-bold text-white mt-6"
          style={{ fontSize: 28, lineHeight: 33, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 8 }}
        >
          {cameraOff && stepIndex === 0
            ? 'Look around for 5 things you can see'
            : step.line}
        </Animated.Text>

        <View className="flex-1" />

        <Animated.Text
          key={`count-${stepIndex}-${found}`}
          entering={ZoomIn.springify().damping(13)}
          className="font-avantt-bold text-white text-center"
          style={{ fontSize: 64, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 10 }}
        >
          {remaining}
        </Animated.Text>
        <Text className="text-white text-center mb-4" style={{ fontFamily: 'TWKLausanne-400', fontSize: 14, opacity: 0.85 }}>
          to go
        </Text>

        <AnimatedEntrance>
        <PressableScale
          scaleTo={0.97}
          onPress={foundOne}
          className="h-16 items-center justify-center rounded-full bg-white active:opacity-90"
        >
          <Text className="font-avantt-bold text-primary" style={{ fontSize: 19 }}>
            Found one
          </Text>
        </PressableScale>
        </AnimatedEntrance>

        <View style={{ paddingBottom: Math.max(insets.bottom, 16), paddingTop: 8 }}>
          <TalkNowLink screen="selfcare_ground" light />
        </View>
      </View>

      {snap && <SnapExplosion key={snap.id} uri={snap.uri} />}
    </View>
  );
}
