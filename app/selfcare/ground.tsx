import { ConfettiBurst } from '@/components/proto/bursts';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { PressableScale } from '@/components/ui/pressable-scale';
import { mentor, teen } from '@/data/mock';
import { MENTOR_BACK_AT } from '@/data/offline';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { Moodies, assetUri } from '@/lib/scribbles';
import { useAppStore } from '@/stores/app-store';
import { useNavStore } from '@/stores/nav-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Camera, Check, Heart, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { EASE_STANDARD } from '@/lib/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SPRAY = assetUri(require('@assets/illustrations/spray.png'));

const AnimatedEntrance = ({ children }: { children: React.ReactNode }) => (
  <Animated.View entering={FadeInDown.delay(200).springify().damping(18)}>
    {children}
  </Animated.View>
);

/**
 * "Back to your senses" — 5-4-3-2-1 sensory grounding. Tap-based by
 * default; the camera is OPT-IN, for the "see" step only, so no browser
 * permission prompt ever fires mid-crisis uninvited. When on, it's a live
 * LOCAL preview — nothing captured, recorded, or uploaded, and the screen
 * says so. "I see one" grabs the current frame just long enough to blow it
 * up (polaroid → confetti, in memory ~a second, then thrown away).
 *
 * Every step has a no-fail skip ("still counts"). The ending is a one-tap
 * check-in that branches: feeling better gets the hope-loop back to the
 * mentor (plus opt-in "let them know" — teen-controlled, labeled, never a
 * simulated reply); feeling the same gets "go again," a slower tool, and
 * the crisis line up front.
 */
const STEPS = [
  { count: 5, sense: 'see', line: 'Find 5 things you can see', cta: 'I see one' },
  { count: 4, sense: 'touch', line: 'Find 4 things you can touch', cta: 'I can feel it' },
  { count: 3, sense: 'hear', line: 'Listen for 3 things you can hear', cta: 'I hear one' },
  { count: 2, sense: 'smell', line: 'Find 2 things you can smell', cta: 'Got one' },
  { count: 1, sense: 'taste', line: 'Find 1 thing you can taste', cta: 'Found it' },
] as const;

type Stage = 'steps' | 'checkin' | 'better' | 'same';

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
  const mentorOffline = useScenarioStore(s => s.mentorOffline);
  const [stage, setStage] = useState<Stage>('steps');
  const [stepIndex, setStepIndex] = useState(0);
  const [found, setFound] = useState(0);
  // Camera: opt-in, "see" step only. 'off' until the teen asks for it.
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraFailed, setCameraFailed] = useState(false);
  const [snap, setSnap] = useState<{ id: number; uri: string | null } | null>(null);
  const [sharedWithMentor, setSharedWithMentor] = useState(false);
  const startedAt = useRef(Date.now());
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const snapId = useRef(1);

  const step = STEPS[stepIndex];
  const remaining = step.count - found;
  const seeStep = stepIndex === 0;
  const cameraLive = cameraOn && !cameraFailed && seeStep;

  const finishSteps = () => {
    track('offline_tool_completed', {
      tool: 'ground',
      duration_s: Math.round((Date.now() - startedAt.current) / 1000),
    });
    buzz.success();
    setStage('checkin');
  };

  const nextStep = () => {
    if (stepIndex + 1 < STEPS.length) {
      buzz.success();
      setStepIndex(stepIndex + 1);
      setFound(0);
    } else {
      finishSteps();
    }
  };

  const foundOne = () => {
    buzz.medium();
    // "See" step with camera on: blow up what it sees right now
    // (transient, in-memory only)
    if (cameraLive && Platform.OS === 'web') {
      const uri = captureFrame(videoElRef.current);
      const id = snapId.current++;
      setSnap({ id, uri });
      setTimeout(() => setSnap(s => (s && s.id === id ? null : s)), 1400);
    }
    if (found + 1 < step.count) setFound(found + 1);
    else nextStep();
  };

  const skipSense = () => {
    buzz.tick();
    track('ground_sense_skipped', { sense: step.sense });
    nextStep();
  };

  const leaveEarly = () => {
    track('ground_exit_early', { step: step.sense, found });
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const checkIn = (feeling: 'better' | 'same') => {
    buzz.light();
    track('ground_checkin', { feeling });
    setStage(feeling);
  };

  const goAgain = () => {
    buzz.medium();
    track('ground_restart', {});
    startedAt.current = Date.now();
    setStepIndex(0);
    setFound(0);
    setCameraOn(false);
    setStage('steps');
  };

  const shareWithMentor = () => {
    if (sharedWithMentor) return;
    buzz.success();
    track('ground_shared_with_mentor', {});
    // A labeled event line in chat — the teen chose to disclose; the mentor
    // never "replies" to it (we never simulate a live person).
    useAppStore
      .getState()
      .addSystemMessage(`${teen.name} did Back to your senses`, 'swap-event');
    setSharedWithMentor(true);
  };

  const backToSpace = () => {
    useNavStore.getState().requestHub('tool_exit');
    if (router.canGoBack()) router.dismissAll();
    else router.replace('/');
  };

  /* ------------------------------ check-in ------------------------------ */
  if (stage === 'checkin') {
    return (
      <View
        className="flex-1 bg-white px-6"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <View className="flex-1 items-center justify-center">
          <Animated.Text
            entering={FadeInDown.duration(420).easing(EASE_STANDARD)}
            className="font-avantt-bold text-primary text-center"
            style={{ fontSize: 30, lineHeight: 35 }}
          >
            How&apos;s your head now?
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(120).duration(380).easing(EASE_STANDARD)}
            className="text-body-2 text-secondary text-center mt-2"
          >
            No wrong answer.
          </Animated.Text>
          <View className="flex-row mt-8" style={{ gap: 12, width: '100%' }}>
            {(
              [
                { key: 'better', label: 'A little better', moodie: Moodies.pleased, bg: '#F4FBE8' },
                { key: 'same', label: 'About the same', moodie: Moodies.tired, bg: '#EEF0FF' },
              ] as const
            ).map((opt, i) => (
              <Animated.View
                key={opt.key}
                entering={FadeInDown.delay(240 + i * 110).springify().damping(16)}
                style={{ flex: 1 }}
              >
                <PressableScale
                  scaleTo={0.96}
                  onPress={() => checkIn(opt.key)}
                  className="items-center rounded-3xl px-4 py-6"
                  style={{ backgroundColor: opt.bg }}
                >
                  <Image
                    source={opt.moodie}
                    style={{ width: 64, height: 64 }}
                    contentFit="contain"
                  />
                  <Text
                    className="font-avantt-bold text-primary text-center mt-3"
                    style={{ fontSize: 16 }}
                  >
                    {opt.label}
                  </Text>
                </PressableScale>
              </Animated.View>
            ))}
          </View>
        </View>
        <TalkNowLink screen="selfcare_ground_checkin" />
      </View>
    );
  }

  /* --------------------------- feeling better --------------------------- */
  if (stage === 'better') {
    return (
      <View
        className="flex-1 bg-white px-6"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <View className="flex-1 items-center justify-center">
          <View className="items-center justify-center">
            <Animated.View
              entering={FadeIn.delay(200).duration(700)}
              style={{ position: 'absolute', width: 230, height: 230 }}
            >
              <Image
                source={SPRAY}
                style={{ width: '100%', height: '100%', opacity: 0.3 }}
                contentFit="contain"
                tintColor="#C2DF4F"
              />
            </Animated.View>
            <Animated.View entering={ZoomIn.springify().damping(14)}>
              <Image
                source={Moodies.pleased}
                style={{ width: 88, height: 88 }}
                contentFit="contain"
              />
            </Animated.View>
          </View>
          <Animated.Text
            entering={FadeInDown.delay(160).duration(400).easing(EASE_STANDARD)}
            className="font-avantt-bold text-primary text-center mt-6"
            style={{ fontSize: 30, lineHeight: 35 }}
          >
            That&apos;s a skill, not luck.
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(240).duration(400).easing(EASE_STANDARD)}
            className="text-body-2 text-secondary text-center mt-3"
            style={{ lineHeight: 22, maxWidth: 320 }}
          >
            You pulled yourself back with your own five senses. {mentor.name}{' '}
            can help you build more moves like this — so these moments hit
            softer.
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(360).springify().damping(18)}
            className="w-full mt-7"
          >
            {sharedWithMentor ? (
              <View
                className="h-14 flex-row items-center justify-center rounded-full bg-surfaces-z2 border border-surfaces-divider px-5"
                style={{ gap: 8 }}
              >
                <Check size={17} color="#5FA74B" strokeWidth={2.4} />
                <Text className="text-body-2 text-primary">
                  {mentor.name} will see it{mentorOffline ? ` at ${MENTOR_BACK_AT}` : ''}
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={shareWithMentor}
                className="h-14 flex-row items-center justify-center rounded-full border border-surfaces-divider bg-white active:opacity-70 px-5"
                style={{ gap: 10 }}
              >
                <Image
                  source={{ uri: mentor.avatar }}
                  style={{ width: 28, height: 28, borderRadius: 14 }}
                />
                <Text className="text-body-2 text-primary">
                  Let {mentor.name} know I did this
                </Text>
              </Pressable>
            )}
            <Text className="text-body-3 text-tertiary text-center mt-2">
              Totally optional — this stays private unless you share it.
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.delay(480).duration(400).easing(EASE_STANDARD)}
          style={{ gap: 12 }}
        >
          <Pressable
            onPress={backToSpace}
            className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          >
            <Text className="text-body-2 text-white">Back to your space</Text>
          </Pressable>
          <TalkNowLink screen="selfcare_ground_better" />
        </Animated.View>
      </View>
    );
  }

  /* -------------------------- still feeling it -------------------------- */
  if (stage === 'same') {
    return (
      <View
        className="flex-1 bg-white px-6"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <View className="flex-1 items-center justify-center">
          <Animated.View entering={ZoomIn.springify().damping(14)}>
            <Image
              source={Moodies.tired}
              style={{ width: 80, height: 80 }}
              contentFit="contain"
            />
          </Animated.View>
          <Animated.Text
            entering={FadeInDown.delay(140).duration(400).easing(EASE_STANDARD)}
            className="font-avantt-bold text-primary text-center mt-6"
            style={{ fontSize: 30, lineHeight: 35 }}
          >
            That&apos;s okay.
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(220).duration(400).easing(EASE_STANDARD)}
            className="text-body-2 text-secondary text-center mt-3"
            style={{ lineHeight: 22, maxWidth: 310 }}
          >
            Sometimes it takes a couple rounds — that&apos;s not failing,
            that&apos;s how it works. You can go again, or try something
            slower.
          </Animated.Text>

          {/* Crisis resources step UP from a footer link to a card here */}
          <Animated.View
            entering={FadeInDown.delay(340).springify().damping(18)}
            className="w-full mt-7"
          >
            <PressableScale
              scaleTo={0.98}
              onPress={() => {
                track('crisis_resources_clicked', { screen: 'selfcare_ground_same' });
                router.push('/resources');
              }}
              className="flex-row items-center rounded-3xl px-5 py-4"
              style={{ backgroundColor: '#FFF0F4', gap: 12 }}
            >
              <View
                className="items-center justify-center rounded-full bg-white"
                style={{ width: 40, height: 40 }}
              >
                <Heart size={19} color="#E85C82" strokeWidth={2.2} />
              </View>
              <View className="flex-1">
                <Text className="font-avantt-bold text-primary" style={{ fontSize: 15 }}>
                  Need a person tonight?
                </Text>
                <Text className="text-body-3 text-secondary" style={{ marginTop: 1 }}>
                  Real people, right now — call or text.
                </Text>
              </View>
            </PressableScale>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.delay(440).duration(400).easing(EASE_STANDARD)}
          style={{ gap: 12 }}
        >
          <Pressable
            onPress={goAgain}
            className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          >
            <Text className="text-body-2 text-white">Go again</Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace('/selfcare/breathe')}
            className="h-12 items-center justify-center active:opacity-60"
          >
            <Text className="text-body-2 text-primary underline">
              Try breathing instead
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  /* ------------------------------- steps -------------------------------- */
  return (
    <View className="flex-1 bg-brand-trueBlack">
      {cameraLive && (
        <LocalCameraPreview
          onUnavailable={() => setCameraFailed(true)}
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

      <View className="flex-1 px-6" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center justify-between" style={{ minHeight: 44 }}>
          {cameraLive ? (
            <Animated.View
              entering={FadeIn.duration(400)}
              className="flex-1 flex-row items-center rounded-full px-4 py-2 mr-2"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)', gap: 6, alignSelf: 'flex-start' }}
            >
              <Camera size={13} color="#FFFFFF" strokeWidth={2} />
              <Text
                className="text-white flex-1"
                style={{ fontSize: 12, fontFamily: 'TWKLausanne-400' }}
              >
                Nothing is recorded or uploaded — this stays on your phone.
              </Text>
            </Animated.View>
          ) : (
            <View className="flex-1" />
          )}
          <Pressable
            onPress={leaveEarly}
            className="h-11 w-11 items-center justify-center rounded-full active:opacity-60"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            hitSlop={6}
            accessibilityLabel="Leave"
          >
            <X size={20} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>

        <Animated.Text
          key={`line-${stepIndex}`}
          entering={FadeInDown.delay(120).duration(380).easing(EASE_STANDARD)}
          className="font-avantt-bold text-white mt-5"
          style={{ fontSize: 28, lineHeight: 33, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 8 }}
        >
          {cameraLive ? 'Point your camera at 5 things you can see' : step.line}
        </Animated.Text>

        {/* Camera is opt-in, "see" step only — the browser permission
            prompt never fires unless the teen asks for it */}
        {seeStep && !cameraOn && !cameraFailed && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(400).easing(EASE_STANDARD)}
            style={{ alignSelf: 'flex-start' }}
          >
            <Pressable
              onPress={() => {
                track('ground_camera_opt_in', {});
                setCameraOn(true);
              }}
              className="mt-4 flex-row items-center rounded-full px-4 active:opacity-70"
              style={{
                height: 44,
                gap: 8,
                backgroundColor: 'rgba(255,255,255,0.14)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.35)',
              }}
            >
              <Camera size={16} color="#FFFFFF" strokeWidth={2} />
              <Text className="text-white" style={{ fontSize: 14, fontFamily: 'TWKLausanne-400' }}>
                Use my camera — it stays on your phone
              </Text>
            </Pressable>
          </Animated.View>
        )}

        <View className="flex-1" />

        <Animated.Text
          key={`count-${stepIndex}-${found}`}
          entering={ZoomIn.springify().damping(13)}
          className="font-avantt-bold text-white text-center"
          style={{ fontSize: 64, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 10 }}
        >
          {remaining}
        </Animated.Text>
        <Text
          className="text-white text-center mb-4"
          style={{ fontFamily: 'TWKLausanne-400', fontSize: 14, opacity: 0.85 }}
        >
          to go
        </Text>

        <AnimatedEntrance>
          <PressableScale
            scaleTo={0.97}
            onPress={foundOne}
            className="h-16 items-center justify-center rounded-full bg-white active:opacity-90"
          >
            <Text className="font-avantt-bold text-primary" style={{ fontSize: 19 }}>
              {step.cta}
            </Text>
          </PressableScale>
        </AnimatedEntrance>

        {/* No-fail escape: taste at 2am shouldn't feel like losing */}
        <Pressable
          onPress={skipSense}
          className="items-center justify-center active:opacity-60"
          style={{ minHeight: 44, marginTop: 2 }}
          hitSlop={6}
        >
          <Text
            className="text-white underline"
            style={{
              fontFamily: 'TWKLausanne-400',
              fontSize: 14,
              opacity: 0.8,
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowRadius: 6,
            }}
          >
            Can&apos;t find one? Skip it — still counts.
          </Text>
        </Pressable>

        <View style={{ paddingBottom: Math.max(insets.bottom, 16), paddingTop: 4 }}>
          <TalkNowLink screen="selfcare_ground" light />
        </View>
      </View>

      {snap && <SnapExplosion key={snap.id} uri={snap.uri} />}
    </View>
  );
}
