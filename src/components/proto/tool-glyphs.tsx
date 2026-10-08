import type { ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Hand-drawn glyphs for the four tools — wobbly, open strokes that sit
 * with the scribble language instead of emoji. Drawn as single-weight
 * marker lines, slightly rotated so nothing feels machine-perfect.
 */

const STROKE = 3.6;

function BreatheGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* two imperfect rings, both left open a crack */}
      <Path
        d="M26 5 C37 6 44 16 42 26 C40 38 29 45 19 42 C9 39 3 29 6 19 C8 11 15 6 22 5"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M26 15 C32 16 35 22 33 27 C31 33 24 35 19 32 C15 30 13 24 16 20 C18 17 21 15 24 15"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
      <Circle cx="24" cy="24" r="2.6" fill={color} />
    </Svg>
  );
}

function VentGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* pressed-too-hard pen scrawl */}
      <Path
        d="M6 28 L14 9 L18 32 L26 7 L31 34 L39 12"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M9 41 C18 37 30 43 41 38"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
    </Svg>
  );
}

function GroundGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* rough viewfinder corners around a found thing */}
      <Path d="M6 15 L6 9 C6 7 7 6 9 6 L15 6" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
      <Path d="M33 6 L39 6 C41 6 42 7 42 9 L42 15" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
      <Path d="M42 33 L42 39 C42 41 41 42 39 42 L33 42" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
      <Path d="M15 42 L9 42 C7 42 6 41 6 39 L6 33" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
      <Path
        d="M25 17 C31 18 33 23 31 27 C29 32 23 33 19 30 C16 27 16 21 20 18 C21 17 23 17 25 17"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
    </Svg>
  );
}

function NotAloneGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* two rough circles, overlapping — you + everyone else up right now */}
      <Path
        d="M19 11 C27 12 31 19 29 26 C27 33 19 36 12 33 C6 30 4 22 8 16 C10 12 15 11 19 11"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M31 14 C39 15 43 22 41 29 C39 36 31 39 24 36 C19 34 16 27 19 21 C21 16 26 14 31 14"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
    </Svg>
  );
}

function PaintGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* one loose brush stroke, a handle, and a drip */}
      <Path
        d="M8 34 C14 26 24 14 36 8"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M36 8 L42 5"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
      <Circle cx="11" cy="42" r="3" fill={color} opacity={0.55} />
    </Svg>
  );
}

function DeckGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* two cards, fanned */}
      <Path
        d="M14 10 L32 6 C34 5.6 35 6.4 35.4 8 L41 34 C41.4 36 40.6 37 39 37.4 L21 41.4 C19 41.8 18 41 17.6 39.4 L12 13 C11.6 11.4 12.4 10.4 14 10 Z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M8 16 L13 14"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        opacity={0.55}
      />
      <Path
        d="M9 24 L15 22.6"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        opacity={0.55}
      />
      <Path
        d="M22 20 C26 17 30 19 29 23 C28 26 24 28 23 26"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
    </Svg>
  );
}

function QuestionsGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* a loose question mark */}
      <Path
        d="M14 16 C14 8 24 4 31 8 C38 12 37 21 30 25 C26 27 24 29 24 33"
        stroke={color}
        strokeWidth={STROKE + 0.6}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="24" cy="42" r="3" fill={color} />
    </Svg>
  );
}

function SongsGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* a wobbly vinyl */}
      <Path
        d="M26 6 C37 7 44 17 42 27 C40 39 28 45 18 42 C8 39 3 28 7 18 C10 10 18 5 26 6 Z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="24" cy="24" r="5" stroke={color} strokeWidth={STROKE} fill="none" opacity={0.55} />
      <Circle cx="24" cy="24" r="1.6" fill={color} />
    </Svg>
  );
}

function BoardsGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* four pinned tiles, slightly off-grid */}
      <Path d="M8 9 L21 8 L22 20 L9 21 Z" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" fill="none" />
      <Path d="M27 7 L40 9 L39 21 L27 20 Z" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" fill="none" opacity={0.55} />
      <Path d="M9 27 L21 26 L21 40 L9 40 Z" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" fill="none" opacity={0.55} />
      <Path d="M27 26 L40 27 L39 39 L28 40 Z" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function StoryGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* a story frame with a header scrawl */}
      <Path
        d="M14 6 L34 6 C38 6 40 8 40 12 L40 36 C40 40 38 42 34 42 L14 42 C10 42 8 40 8 36 L8 12 C8 8 10 6 14 6 Z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M14 14 L28 14" stroke={color} strokeWidth={STROKE} strokeLinecap="round" opacity={0.55} />
      <Path d="M14 33 C19 29 25 31 30 34 C33 36 36 35 38 33" stroke={color} strokeWidth={2.8} strokeLinecap="round" fill="none" opacity={0.55} />
    </Svg>
  );
}

function StarGlyph({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 48 48" width="100%" height="100%">
      {/* a wobbly five-point star, traced open at the top */}
      <Path
        d="M26 6 L30 17 L43 18 L33.5 27 L36.5 40 L24 33 L11.5 40 L14.5 27 L5 18 L18 17 L22 8"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="24" cy="5" r="2.6" fill={color} />
    </Svg>
  );
}

const GLYPHS: Record<string, (p: { color: string }) => ReactElement> = {
  star: StarGlyph,
  questions: QuestionsGlyph,
  songs: SongsGlyph,
  playlist: SongsGlyph,
  boards: BoardsGlyph,
  story: StoryGlyph,
  paint: PaintGlyph,
  calm_deck: DeckGlyph,
  breathe: BreatheGlyph,
  vent: VentGlyph,
  ground: GroundGlyph,
  not_alone: NotAloneGlyph,
};

export function ToolGlyph({
  id,
  size = 32,
  color,
  rotate = -5,
}: {
  id: string;
  size?: number;
  color: string;
  rotate?: number;
}) {
  const Glyph = GLYPHS[id];
  if (!Glyph) return null;
  return (
    <View style={{ width: size, height: size, transform: [{ rotate: `${rotate}deg` }] }}>
      <Glyph color={color} />
    </View>
  );
}
