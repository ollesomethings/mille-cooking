import { Scribbles } from '@/lib/scribbles';

/**
 * The four self-care tools. They used to live behind the offline-only
 * "What do you need right now?" picker; now they're cards on the Hub
 * (src/components/hub-tab.tsx), open to everyone, all the time.
 */
export interface SelfcareTool {
  id: string;
  /** Stroke color for the hand-drawn ToolGlyph */
  glyphColor: string;
  label: string;
  sub: string;
  bg: string;
  scribble: { uri: string };
  scribbleTint: string;
  route:
    | '/selfcare/breathe'
    | '/selfcare/vent'
    | '/selfcare/ground'
    | '/selfcare/notalone'
    | '/selfcare/paint'
    | '/selfcare/calmdeck'
    | '/selfcare/star'
    | '/know/questions'
    | '/know/songs'
    | '/know/boards'
    | '/know/story';
}

export const SELFCARE_TOOLS: SelfcareTool[] = [
  {
    id: 'breathe',
    glyphColor: '#1E93C9',
    label: 'Calm my body',
    sub: 'Breathe with the circle',
    bg: '#EAF9FF',
    scribble: Scribbles.blueSwoosh,
    scribbleTint: '#71E0FF',
    route: '/selfcare/breathe',
  },
  {
    id: 'vent',
    glyphColor: '#E8820A',
    label: 'Get it out',
    sub: 'Say whatever you need to',
    bg: '#FFF6F1',
    scribble: Scribbles.orangeCloud,
    scribbleTint: '#FF9812',
    route: '/selfcare/vent',
  },
  {
    id: 'ground',
    glyphColor: '#4E8F3D',
    label: 'Back to your senses',
    sub: 'A 2-minute senses hunt',
    bg: '#F4FBE8',
    scribble: Scribbles.greenSwoosh,
    scribbleTint: '#5FA74B',
    route: '/selfcare/ground',
  },
  {
    id: 'not_alone',
    glyphColor: '#8E3FE0',
    label: "Show me I'm not alone",
    sub: 'Real words from other teens',
    bg: '#F4F1FF',
    scribble: Scribbles.pinkLoops,
    scribbleTint: '#B164FF',
    route: '/selfcare/notalone',
  },
];

/**
 * The calming / mental-health tool set — shown on the Hub instead of the
 * default set when the launcher's "Mental health tools" toggle is on.
 * Breathing and 5-4-3-2-1 carry over; venting and confessions swap out for
 * paint-by-numbers and the calm-tips deck.
 */
export const CALM_TOOLS: SelfcareTool[] = [
  SELFCARE_TOOLS[0], // breathe
  {
    id: 'ground',
    glyphColor: '#4E8F3D',
    label: 'Back to your senses',
    sub: '5 you see, 4 you touch… ~2 min',
    bg: '#F4FBE8',
    scribble: Scribbles.greenSwoosh,
    scribbleTint: '#5FA74B',
    route: '/selfcare/ground',
  },
  {
    id: 'paint',
    glyphColor: '#3D45D8',
    label: 'Paint it calm',
    sub: 'Color by numbers, no rush',
    bg: '#EEF0FF',
    scribble: Scribbles.periwinkleCloud,
    scribbleTint: '#4D55FD',
    route: '/selfcare/paint',
  },
  {
    id: 'calm_deck',
    glyphColor: '#B8860B',
    label: 'Calm cards',
    sub: 'One tip at a time',
    bg: '#FFF9E3',
    scribble: Scribbles.yellowSpiral,
    scribbleTint: '#D9A514',
    route: '/selfcare/calmdeck',
  },
  {
    id: 'star',
    glyphColor: '#D9A514',
    label: 'Star breathing',
    sub: 'Trace it with your finger',
    bg: '#FFF9E3',
    scribble: Scribbles.yellowLoops,
    scribbleTint: '#FFD84D',
    route: '/selfcare/star',
  },
];

/**
 * The get-to-know-your-mentor tool set — icebreakers, shown on the Hub when
 * the launcher's "Know your mentor" toggle is on. All mentor content in
 * these tools is pre-left by the mentor (intro answers, an on-repeat song,
 * a board) — never a simulated live reply.
 */
export const MENTOR_TOOLS: SelfcareTool[] = [
  {
    id: 'questions',
    glyphColor: '#D14868',
    label: '20 questions',
    sub: 'Trade quick answers',
    bg: '#FFF0F4',
    scribble: Scribbles.pinkLoops,
    scribbleTint: '#E85C82',
    route: '/know/questions',
  },
  {
    id: 'playlist',
    glyphColor: '#8E3FE0',
    label: 'Our playlist',
    sub: 'They started it — add yours',
    bg: '#F4F1FF',
    scribble: Scribbles.purpleSwoosh,
    scribbleTint: '#B164FF',
    route: '/know/songs',
  },
  {
    id: 'boards',
    glyphColor: '#1E93C9',
    label: 'Vibe boards',
    sub: 'Pinterest, basically',
    bg: '#EAF9FF',
    scribble: Scribbles.blueSwoosh,
    scribbleTint: '#71E0FF',
    route: '/know/boards',
  },
  {
    id: 'story',
    glyphColor: '#4E8F3D',
    label: 'Make a story',
    sub: 'For your hub, like theirs',
    bg: '#F4FBE8',
    scribble: Scribbles.greenSwoosh,
    scribbleTint: '#5FA74B',
    route: '/know/story',
  },
];
