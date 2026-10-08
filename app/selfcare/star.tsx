import { ConfettiBurst } from '@/components/proto/bursts';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

/**
 * Star breathing (after Dr. Juliet Young's exercise): trace your finger
 * around the star's ten edges, slowly — In on one edge, Hold on the next,
 * Out on the one after, around and around. The edge you're tracing fills
 * with its phase color under your finger; corners tick, finished laps
 * celebrate. "Guide me" moves the dot for you (the tap alternative).
 */
const PHASES = ['In', 'Hold', 'Out'] as const;
const PHASE_COLORS: Record<string, string> = {
  In: '#71E0FF',
  Hold: '#B164FF',
  Out: '#C2DF4F',
};
const LAPS = 2;
const TOUCH_TOLERANCE = 48;
const AUTO_EDGE_MS = 3600;

const phaseOf = (seg: number) => PHASES[seg % 3];

interface Pt {
  x: number;
  y: number;
}

/** 10 star vertices (alternating outer/inner), starting at the top point. */
function starPoints(cx: number, cy: number, R: number, r: number): Pt[] {
  return Array.from({ length: 10 }, (_, k) => {
    const a = ((-90 + k * 36) * Math.PI) / 180;
    const rad = k % 2 === 0 ? R : r;
    return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) };
  });
}

export default function Star() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [pos, setPos] = useState({ seg: 0, t: 0, lap: 0 });
  const [auto, setAuto] = useState(false);
  const [done, setDone] = useState(false);
  const posRef = useRef(pos);
  const doneRef = useRef(false);
  const startedAt = useRef(Date.now());
  const containerRef = useRef<View>(null);
  const rectRef = useRef({ left: 0, top: 0 });

  // cap by height so short windows keep the controls on screen
  const size = Math.min(width - 32, 400, height * 0.52);
  const cx = size / 2;
  const cy = size / 2 + 8;
  const R = size * 0.46;
  const pts = useRef(starPoints(cx, cy, R, R * 0.475)).current;

  const setProgress = (seg: number, t: number, lap: number) => {
    posRef.current = { seg, t, lap };
    setPos(posRef.current);
  };

  /** Advance within/through segments; shared by finger and guide mode. */
  const advanceTo = (seg: number, t: number) => {
    if (doneRef.current) return;
    let { lap } = posRef.current;
    if (t >= 0.985) {
      const nextSeg = seg + 1;
      if (nextSeg >= 10) {
        lap += 1;
        if (lap >= LAPS) {
          doneRef.current = true;
          buzz.success();
          track('offline_tool_completed', {
            tool: 'star',
            laps: LAPS,
            duration_s: Math.round((Date.now() - startedAt.current) / 1000),
          });
          setProgress(0, 0, lap);
          setDone(true);
          return;
        }
        buzz.success();
        setProgress(0, 0, lap);
        return;
      }
      // corner reached — new edge, new breath phase
      buzz.light();
      setProgress(nextSeg, 0, lap);
      return;
    }
    setProgress(seg, t, lap);
  };

  const handleTouch = (pageX: number, pageY: number) => {
    if (auto || doneRef.current) return;
    const x = pageX - rectRef.current.left;
    const y = pageY - rectRef.current.top;
    const { seg, t } = posRef.current;
    const A = pts[seg];
    const B = pts[(seg + 1) % 10];
    const abx = B.x - A.x;
    const aby = B.y - A.y;
    const len2 = abx * abx + aby * aby;
    let proj = ((x - A.x) * abx + (y - A.y) * aby) / len2;
    proj = Math.max(0, Math.min(1, proj));
    const qx = A.x + proj * abx;
    const qy = A.y + proj * aby;
    const dist = Math.hypot(qx - x, qy - y);
    if (dist > TOUCH_TOLERANCE) return; // wandered off the edge — no punishment
    if (proj > t) advanceTo(seg, proj); // only forward, slowly does it
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const node = containerRef.current as unknown as HTMLElement | null;
        if (node?.getBoundingClientRect) {
          const r = node.getBoundingClientRect();
          rectRef.current = { left: r.left, top: r.top };
        }
        handleTouch(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      },
      onPanResponderMove: (_evt, g) => handleTouch(g.moveX, g.moveY),
    }),
  ).current;

  // "Guide me" — the dot travels on its own, finger optional
  useEffect(() => {
    if (!auto || done) return;
    const stepMs = 40;
    const dt = stepMs / AUTO_EDGE_MS;
    const id = setInterval(() => {
      const { seg, t } = posRef.current;
      advanceTo(seg, Math.min(t + dt, 0.985 + 0.001));
    }, stepMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, done]);

  const finish = () => router.replace('/selfcare/done?tool=star');

  const { seg, t, lap } = pos;
  const phase = phaseOf(seg);
  const A = pts[seg];
  const B = pts[(seg + 1) % 10];
  const dot = { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t };
  const outlineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ') + ' Z';
  const started = seg > 0 || t > 0.02 || lap > 0;

  if (done) {
    return (
      <View className="flex-1 px-6" style={{ backgroundColor: '#FFF9E3', paddingBottom: Math.max(insets.bottom, 16) }}>
        <View className="flex-1 items-center justify-center">
          <View pointerEvents="none" style={{ position: 'absolute' }}>
            <ConfettiBurst count={16} spread={190} duration={950} />
          </View>
          <Animated.Text
            entering={ZoomIn.springify().damping(13)}
            className="font-avantt-bold text-primary text-center"
            style={{ fontSize: 30, lineHeight: 35 }}
          >
            Two full stars.
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(200).duration(400).easing(EASE_STANDARD)}
            className="text-secondary text-center mt-3"
            style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 21 }}
          >
            slower breathing, steadier you
          </Animated.Text>
        </View>
        <Animated.View entering={FadeInDown.delay(350).duration(360).easing(EASE_STANDARD)} style={{ gap: 12 }}>
          <Pressable
            onPress={finish}
            className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          >
            <Text className="text-body-2 text-white">I&apos;m done</Text>
          </Pressable>
          <TalkNowLink screen="selfcare_star" />
        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF9E3', paddingBottom: Math.max(insets.bottom, 16) }}>
      <View className="flex-row items-center justify-between px-5" style={{ paddingTop: insets.top + 8 }}>
        <Text
          className="text-tertiary"
          style={{ fontFamily: 'GeistMono-Medium', fontSize: 11, letterSpacing: 1.5 }}
        >
          LAP {lap + 1} OF {LAPS}
        </Text>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <Animated.View entering={FadeInDown.duration(380).easing(EASE_STANDARD)} className="px-5">
        <Text className="font-avantt-bold text-primary" style={{ fontSize: 28, lineHeight: 32 }}>
          Star breathing.
        </Text>
        <Text className="text-body-3 text-secondary mt-1">
          Trace the edges slowly — breathe with your finger.
        </Text>
      </Animated.View>

      <View className="flex-1 items-center justify-center">
        <View
          ref={containerRef}
          {...pan.panHandlers}
          style={{ width: size, height: size + 16 }}
        >
          <Svg width="100%" height="100%">
            {/* untraced outline */}
            <Path d={outlineD} stroke="#E4D9B0" strokeWidth={2.5} strokeDasharray="3 7" fill="rgba(255,216,77,0.14)" strokeLinejoin="round" />
            {/* edges finished this lap */}
            {Array.from({ length: seg }, (_, i) => (
              <Line
                key={i}
                x1={pts[i].x}
                y1={pts[i].y}
                x2={pts[(i + 1) % 10].x}
                y2={pts[(i + 1) % 10].y}
                stroke={PHASE_COLORS[phaseOf(i)]}
                strokeWidth={7}
                strokeLinecap="round"
              />
            ))}
            {/* the edge under your finger */}
            {t > 0 && (
              <Line
                x1={A.x}
                y1={A.y}
                x2={dot.x}
                y2={dot.y}
                stroke={PHASE_COLORS[phase]}
                strokeWidth={7}
                strokeLinecap="round"
              />
            )}
            {/* tiny phase labels along each edge */}
            {pts.map((p, i) => {
              const q = pts[(i + 1) % 10];
              const mx = (p.x + q.x) / 2;
              const my = (p.y + q.y) / 2;
              const ox = mx - cx;
              const oy = my - cy;
              const olen = Math.hypot(ox, oy) || 1;
              const lx = mx + (ox / olen) * 22;
              const ly = my + (oy / olen) * 22;
              const active = i === seg;
              return (
                <SvgText
                  key={`lbl-${i}`}
                  x={lx}
                  y={ly + 3}
                  fontSize={active ? 12 : 10}
                  fontWeight={active ? 'bold' : 'normal'}
                  fill={active ? '#1F1E1D' : '#A9A29A'}
                  textAnchor="middle"
                >
                  {phaseOf(i).toLowerCase()}
                </SvgText>
              );
            })}
            {/* the tracker dot */}
            <Circle cx={dot.x} cy={dot.y} r={16} fill={PHASE_COLORS[phase]} opacity={0.35} />
            <Circle cx={dot.x} cy={dot.y} r={9} fill={PHASE_COLORS[phase]} stroke="#1F1E1D" strokeWidth={2} />
          </Svg>
          {!started && (
            <Animated.Text
              entering={FadeIn.delay(400).duration(500)}
              className="absolute text-secondary"
              style={{
                fontFamily: 'Caveat_600SemiBold',
                fontSize: 19,
                left: cx - 130,
                top: pts[0].y - 4,
              }}
            >
              start here →
            </Animated.Text>
          )}
        </View>

        {/* the breath, front and center */}
        <Animated.Text
          key={`${phase}-${seg}`}
          entering={FadeIn.duration(300)}
          className="font-avantt-bold text-center"
          style={{ fontSize: 30, color: '#1F1E1D', marginTop: -size * 0.62, pointerEvents: 'none' }}
        >
          {phase === 'In' ? 'Breathe in' : phase === 'Hold' ? 'Hold' : 'Breathe out'}
        </Animated.Text>
        <View style={{ marginTop: size * 0.62 - 38 }} />
      </View>

      <View className="px-6" style={{ gap: 12 }}>
        <Pressable
          onPress={() => {
            buzz.tick();
            setAuto(a => !a);
          }}
          className="h-12 items-center justify-center rounded-full border border-[#E4D9B0] bg-white active:opacity-80"
        >
          <Text className="font-avantt-bold text-primary" style={{ fontSize: 15 }}>
            {auto ? "I'll trace it myself" : 'Guide me instead'}
          </Text>
        </Pressable>
        <Pressable onPress={finish} className="h-10 items-center justify-center active:opacity-60">
          <Text className="text-body-2 text-secondary underline">Stop early</Text>
        </Pressable>
        <Text className="text-tertiary text-center" style={{ fontFamily: 'TWKLausanne-400', fontSize: 11.5 }}>
          after Dr. Juliet Young&apos;s star breathing
        </Text>
        <TalkNowLink screen="selfcare_star" />
      </View>
    </View>
  );
}
