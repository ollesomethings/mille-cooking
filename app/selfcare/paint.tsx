import { ConfettiBurst } from '@/components/proto/bursts';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { teen } from '@/data/mock';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { EASE_STANDARD } from '@/lib/motion';
import { useHubStore } from '@/stores/hub-store';
import { PressableScale } from '@/components/ui/pressable-scale';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

/**
 * Paint it calm — color by numbers, no timer, no wrong-answer punishment.
 * Pick a subject, pick a numbered paint, tap the matching regions. Finish
 * and the painting becomes a little keepsake you can keep in your space
 * (a real hub moment). Leaving early is always fine.
 */

const VB_W = 340;
const VB_H = 300;

interface Region {
  id: string;
  n: number;
  color: string;
  d: string;
  /** number-label position in viewBox coords */
  lx: number;
  ly: number;
}

interface Scene {
  id: string;
  name: string;
  regions: Region[];
}

// Draw order = array order (background first).
const SCENES: Scene[] = [
  {
    id: 'lake',
    name: 'Evening lake',
    regions: [
      { id: 'sky', n: 1, color: '#C9E8F7', d: 'M0 0 H340 V300 H0 Z', lx: 40, ly: 42 },
      { id: 'sun', n: 2, color: '#FFD84D', d: 'M242 56 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0', lx: 272, ly: 61 },
      { id: 'cloud1', n: 3, color: '#FFE4EE', d: 'M92 64 C88 50 104 42 116 48 C120 36 142 36 148 50 C162 46 170 60 158 68 C152 76 100 76 94 70 Z', lx: 124, ly: 62 },
      { id: 'cloud2', n: 3, color: '#FFE4EE', d: 'M186 108 C184 98 196 92 204 96 C208 88 224 88 228 98 C238 96 242 106 234 112 C228 118 192 118 188 112 Z', lx: 210, ly: 107 },
      { id: 'hills', n: 4, color: '#BFE3C0', d: 'M0 196 C60 158 130 176 176 186 C232 198 284 164 340 184 L340 300 L0 300 Z', lx: 296, ly: 208 },
      { id: 'meadow', n: 5, color: '#8FCB91', d: 'M0 300 L0 234 C70 206 152 214 212 242 C244 256 288 268 340 258 L340 300 Z', lx: 150, ly: 282 },
      { id: 'lake', n: 6, color: '#A5D6F2', d: 'M186 270 a66 18 0 1 0 132 0 a66 18 0 1 0 -132 0', lx: 252, ly: 275 },
      { id: 'trunk', n: 7, color: '#B98A5A', d: 'M58 252 C62 232 60 212 57 198 L72 198 C69 214 70 234 76 252 Z', lx: 66, ly: 232 },
      { id: 'crown', n: 8, color: '#6FB472', d: 'M62 202 C38 198 32 170 48 156 C54 136 86 132 98 148 C116 150 120 174 106 186 C102 200 78 208 62 202 Z', lx: 74, ly: 174 },
    ],
  },
  {
    id: 'night',
    name: 'Night sky',
    regions: [
      { id: 'sky', n: 1, color: '#33406E', d: 'M0 0 H340 V300 H0 Z', lx: 170, ly: 46 },
      { id: 'moon', n: 2, color: '#FFE9A8', d: 'M244 62 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0', lx: 270, ly: 67 },
      { id: 'star1', n: 3, color: '#FFD84D', d: 'M60 44 L66 52 L60 60 L54 52 Z', lx: 60, ly: 56 },
      { id: 'star2', n: 3, color: '#FFD84D', d: 'M128 88 L134 96 L128 104 L122 96 Z', lx: 128, ly: 100 },
      { id: 'star3', n: 3, color: '#FFD84D', d: 'M196 34 L202 42 L196 50 L190 42 Z', lx: 196, ly: 46 },
      { id: 'cloud', n: 4, color: '#7D89B8', d: 'M84 142 C80 130 94 122 106 128 C110 116 132 116 138 130 C152 126 158 140 148 148 C142 156 92 156 86 150 Z', lx: 116, ly: 141 },
      { id: 'far', n: 5, color: '#56639B', d: 'M0 250 C40 180 78 158 110 200 C140 158 180 150 210 210 C240 168 282 178 340 250 L340 300 L0 300 Z', lx: 290, ly: 232 },
      { id: 'snow', n: 6, color: '#E8ECFA', d: 'M96 180 C104 170 116 170 124 182 L116 200 C110 190 102 188 96 194 Z', lx: 110, ly: 188 },
      { id: 'near', n: 7, color: '#414B7E', d: 'M0 300 L0 262 C60 232 140 242 200 272 C260 294 300 292 340 280 L340 300 Z', lx: 150, ly: 284 },
    ],
  },
  {
    id: 'window',
    name: 'Window plant',
    regions: [
      { id: 'wall', n: 1, color: '#FBF0E1', d: 'M0 0 H340 V300 H0 Z', lx: 26, ly: 260 },
      { id: 'winsky', n: 2, color: '#C9E8F7', d: 'M64 40 H276 V170 H64 Z', lx: 120, ly: 70 },
      { id: 'sun', n: 3, color: '#FFD84D', d: 'M216 62 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0', lx: 236, ly: 67 },
      { id: 'curtl', n: 4, color: '#FFC9D8', d: 'M48 30 C70 62 66 132 52 186 L32 186 C44 130 40 68 32 30 Z', lx: 49, ly: 110 },
      { id: 'curtr', n: 4, color: '#FFC9D8', d: 'M292 30 C270 62 274 132 288 186 L308 186 C296 130 300 68 308 30 Z', lx: 291, ly: 110 },
      { id: 'sill', n: 5, color: '#D9B98C', d: 'M46 186 H294 V204 H46 Z', lx: 80, ly: 199 },
      { id: 'pot', n: 6, color: '#E2725B', d: 'M148 252 L156 206 H200 L208 252 C190 262 166 262 148 252 Z', lx: 178, ly: 236 },
      { id: 'leafl', n: 7, color: '#6FB472', d: 'M170 206 C136 192 134 148 164 142 C176 136 188 148 184 164 C181 184 176 198 173 206 Z', lx: 162, ly: 172 },
      { id: 'leafr', n: 7, color: '#6FB472', d: 'M188 206 C222 194 226 152 196 145 C185 141 174 152 178 168 C182 188 186 198 188 206 Z', lx: 200, ly: 178 },
      { id: 'book', n: 8, color: '#B164FF', d: 'M228 204 L274 204 L274 188 L230 186 Z', lx: 251, ly: 199 },
    ],
  },
];

/** Standalone SVG markup of the finished scene — the keepable artifact. */
function sceneDataUri(scene: Scene): string {
  const markup =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}">` +
    scene.regions.map(r => `<path d="${r.d}" fill="${r.color}"/>`).join('') +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;
}

function SceneSvg({
  scene,
  filled,
  selected,
  onTap,
}: {
  scene: Scene;
  /** null ⇒ fully painted preview, no numbers */
  filled: Set<string> | null;
  selected?: number;
  onTap?: (r: Region) => void;
}) {
  const isFilled = (r: Region) => filled === null || filled.has(r.id);
  return (
    <Svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%">
      {scene.regions.map(r => (
        <Path
          key={r.id}
          d={r.d}
          fill={isFilled(r) ? r.color : '#FDFCF9'}
          stroke={isFilled(r) ? r.color : '#C9C2B6'}
          strokeWidth={1.4}
          onPress={onTap ? () => onTap(r) : undefined}
        />
      ))}
      {filled !== null &&
        scene.regions
          .filter(r => !filled.has(r.id))
          .map(r => (
            <SvgText
              key={`n-${r.id}`}
              x={r.lx}
              y={r.ly}
              fontSize={13}
              fontWeight="bold"
              fill={r.n === selected ? '#1F1E1D' : '#A9A29A'}
              textAnchor="middle"
              onPress={onTap ? () => onTap(r) : undefined}
            >
              {r.n}
            </SvgText>
          ))}
    </Svg>
  );
}

export default function Paint() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const addEntity = useHubStore(s => s.addEntity);
  const [scene, setScene] = useState<Scene | null>(null);
  const [selected, setSelected] = useState(1);
  const [filled, setFilled] = useState<Set<string>>(new Set());
  const [keepsake, setKeepsake] = useState(false);
  const [pop, setPop] = useState<{ key: number; x: number; y: number } | null>(null);
  const startedAt = useRef(Date.now());
  const popId = useRef(1);

  // cap by height so the palette and buttons stay on screen everywhere
  const canvasW = Math.min(width - 40, 420, height * 0.42 * (VB_W / VB_H));
  const canvasH = canvasW * (VB_H / VB_W);
  const scale = canvasW / VB_W;
  const done = scene !== null && filled.size === scene.regions.length;

  const numbers = scene ? [...new Set(scene.regions.map(r => r.n))].sort((a, b) => a - b) : [];
  const colorFor = (n: number) => scene!.regions.find(r => r.n === n)!.color;

  const pickScene = (s: Scene) => {
    buzz.light();
    track('paint_scene_selected', { scene: s.id });
    setScene(s);
    setSelected(1);
    setFilled(new Set());
    startedAt.current = Date.now();
  };

  const tapRegion = (r: Region) => {
    if (!scene || filled.has(r.id) || done) return;
    if (r.n !== selected) {
      // wrong paint — no punishment, just a soft nudge toward the number
      buzz.tick();
      return;
    }
    buzz.light();
    const next = new Set(filled).add(r.id);
    setFilled(next);
    const key = popId.current++;
    setPop({ key, x: r.lx * scale, y: r.ly * scale });
    setTimeout(() => setPop(p => (p && p.key === key ? null : p)), 700);
    if (next.size === scene.regions.length) {
      buzz.success();
      track('offline_tool_completed', {
        tool: 'paint',
        scene: scene.id,
        regions_filled: next.size,
        duration_s: Math.round((Date.now() - startedAt.current) / 1000),
      });
      setTimeout(() => setKeepsake(true), 900);
    }
  };

  const keepIt = () => {
    if (!scene) return;
    buzz.medium();
    track('paint_kept', { scene: scene.id });
    addEntity({
      entityType: 'moment',
      owner: { name: teen.name, avatar: teen.avatar, role: 'teen' },
      moment: {
        caption: `painted: ${scene.name.toLowerCase()}`,
        images: [sceneDataUri(scene)],
      },
    });
    router.replace('/selfcare/done?tool=paint');
  };

  const leave = () => {
    // completion is already tracked at the moment the last region fills
    if (!done && scene) {
      track('offline_tool_completed', {
        tool: 'paint',
        scene: scene.id,
        regions_filled: filled.size,
        duration_s: Math.round((Date.now() - startedAt.current) / 1000),
      });
    }
    router.replace('/selfcare/done?tool=paint');
  };

  // ── Stage 3: the keepsake ─────────────────────────────────────────────
  if (keepsake && scene) {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const polW = Math.min(width - 100, 280);
    return (
      <View className="flex-1 bg-white px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <View className="flex-1 items-center justify-center">
          <View pointerEvents="none" style={{ position: 'absolute' }}>
            <ConfettiBurst count={18} spread={200} duration={1000} />
          </View>
          <Animated.View
            entering={ZoomIn.springify().damping(13)}
            className="bg-white"
            style={{
              padding: 12,
              paddingBottom: 18,
              borderRadius: 8,
              transform: [{ rotate: '-3deg' }],
              shadowColor: '#000',
              shadowOpacity: 0.22,
              shadowRadius: 22,
              shadowOffset: { width: 0, height: 10 },
              borderWidth: 1,
              borderColor: '#EFEBE4',
            }}
          >
            <View style={{ width: polW, height: polW * (VB_H / VB_W), borderRadius: 4, overflow: 'hidden' }}>
              <SceneSvg scene={scene} filled={null} />
            </View>
            <Text
              className="text-primary text-center"
              style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 22, marginTop: 10 }}
            >
              {scene.name.toLowerCase()} — {today.toLowerCase()}
            </Text>
          </Animated.View>
          <Animated.Text
            entering={FadeInDown.delay(300).duration(400).easing(EASE_STANDARD)}
            className="font-avantt-bold text-primary text-center mt-7"
            style={{ fontSize: 26 }}
          >
            You made a thing.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInDown.delay(450).duration(360).easing(EASE_STANDARD)} style={{ gap: 12 }}>
          <Pressable
            onPress={keepIt}
            className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          >
            <Text className="text-body-2 text-white">Keep it in your space</Text>
          </Pressable>
          <Pressable onPress={leave} className="h-11 items-center justify-center active:opacity-60">
            <Text className="text-body-2 text-secondary underline">Let it go</Text>
          </Pressable>
          <TalkNowLink screen="selfcare_paint_keepsake" />
        </Animated.View>
      </View>
    );
  }

  // ── Stage 1: pick a subject ───────────────────────────────────────────
  if (!scene) {
    return (
      <View className="flex-1 bg-white px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Animated.View entering={FadeInDown.duration(380).easing(EASE_STANDARD)} style={{ paddingTop: insets.top + 24 }}>
          <Text className="font-avantt-bold text-primary" style={{ fontSize: 28, lineHeight: 32 }}>
            Paint it calm.
          </Text>
          <Text className="text-body-3 text-secondary mt-1.5">
            Pick something to color. No rush, no wrong moves.
          </Text>
        </Animated.View>

        <View className="flex-1 justify-center" style={{ gap: 14 }}>
          {SCENES.map((s, i) => (
            <Animated.View key={s.id} entering={FadeInDown.delay(140 + i * 100).springify().damping(18)}>
              <PressableScale
                scaleTo={0.97}
                onPress={() => pickScene(s)}
                className="flex-row items-center rounded-3xl border border-[#DFDAD3] bg-white p-3 active:opacity-90"
                style={{ gap: 14 }}
              >
                <View
                  className="overflow-hidden rounded-2xl"
                  style={{ width: 96, height: 96 * (VB_H / VB_W), transform: [{ rotate: '-2deg' }] }}
                >
                  <SceneSvg scene={s} filled={null} />
                </View>
                <View className="flex-1">
                  <Text className="font-avantt-bold text-primary" style={{ fontSize: 19 }}>
                    {s.name}
                  </Text>
                  <Text className="text-body-3 text-secondary mt-0.5">
                    {[...new Set(s.regions.map(r => r.n))].length} paints · {s.regions.length} shapes
                  </Text>
                </View>
              </PressableScale>
            </Animated.View>
          ))}
        </View>
        <TalkNowLink screen="selfcare_paint_pick" />
      </View>
    );
  }

  // ── Stage 2: paint ────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-white px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      <Animated.View entering={FadeInDown.duration(380).easing(EASE_STANDARD)} style={{ paddingTop: insets.top + 20 }}>
        <Text className="font-avantt-bold text-primary" style={{ fontSize: 28, lineHeight: 32 }}>
          {scene.name}.
        </Text>
        <Text className="text-body-3 text-secondary mt-1.5">
          Pick a paint, tap its numbers.
        </Text>
      </Animated.View>

      <View className="flex-1 items-center justify-center">
        <Animated.View
          entering={FadeInDown.delay(140).springify().damping(18)}
          style={{ width: canvasW, height: canvasH }}
        >
          <View
            className="overflow-hidden rounded-3xl border"
            style={{ width: canvasW, height: canvasH, borderColor: '#DFDAD3', backgroundColor: '#FDFCF9' }}
          >
            <SceneSvg scene={scene} filled={filled} selected={selected} onTap={tapRegion} />
            {pop && (
              <View pointerEvents="none" style={{ position: 'absolute', left: pop.x, top: pop.y }}>
                <ConfettiBurst key={pop.key} count={6} spread={46} duration={620} />
              </View>
            )}
          </View>
        </Animated.View>

        {done ? (
          <Animated.Text
            entering={ZoomIn.springify().damping(13)}
            className="text-primary mt-4"
            style={{ fontFamily: 'Caveat_600SemiBold', fontSize: 26 }}
          >
            look at that.
          </Animated.Text>
        ) : (
          <Text className="text-tertiary mt-4" style={{ fontFamily: 'TWKLausanne-400', fontSize: 12.5 }}>
            {filled.size} of {scene.regions.length} painted
          </Text>
        )}
      </View>

      {/* numbered paints */}
      <Animated.View
        entering={FadeInDown.delay(260).duration(320).easing(EASE_STANDARD)}
        className="flex-row flex-wrap justify-center"
        style={{ gap: 8, marginBottom: 12 }}
      >
        {numbers.map(n => {
          const isDone = scene.regions.filter(r => r.n === n).every(r => filled.has(r.id));
          const sel = n === selected;
          return (
            <Pressable
              key={n}
              onPress={() => {
                buzz.tick();
                setSelected(n);
              }}
              disabled={isDone}
              className="items-center justify-center rounded-full"
              style={{
                width: 44,
                height: 44,
                backgroundColor: colorFor(n),
                borderWidth: sel ? 3 : 1,
                borderColor: sel ? '#1F1E1D' : 'rgba(31,30,29,0.15)',
                opacity: isDone ? 0.25 : 1,
              }}
            >
              <Text className="font-avantt-bold" style={{ fontSize: 15, color: '#1F1E1D' }}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>

      <View style={{ gap: 12 }}>
        <Pressable onPress={leave} className="h-11 items-center justify-center active:opacity-60">
          <Text className="text-body-2 text-secondary underline">Stop early</Text>
        </Pressable>
        <TalkNowLink screen="selfcare_paint" />
      </View>
    </View>
  );
}
