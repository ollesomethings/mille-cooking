export interface JournalPrompt {
  id: string;
  category: 'Unburden' | 'Deep Dive' | 'Today' | 'Future';
  title: string;
  placeholder: string;
  accentColor: string;
  bgTint: string;
}

export const JOURNAL_CATEGORIES = [
  'All',
  'Unburden',
  'Deep Dive',
  'Today',
  'Future',
] as const;

export type JournalCategory = (typeof JOURNAL_CATEGORIES)[number];

export const JOURNAL_PROMPTS: JournalPrompt[] = [
  {
    id: 'heavy',
    category: 'Unburden',
    title: 'What made today feel heavier than usual?',
    placeholder: 'Dump the heavy stuff here. No filter needed...',
    accentColor: '#FF9812',
    bgTint: '#FFF6F1',
  },
  {
    id: 'replaying',
    category: 'Unburden',
    title: "The conversation that's still replaying in my head",
    placeholder: 'What was said, and what did you wish you could have said instead?',
    accentColor: '#E85C82',
    bgTint: '#FFF0F4',
  },
  {
    id: 'unfair',
    category: 'Unburden',
    title: 'Something that felt completely unfair lately',
    placeholder: 'Get it all out. Why did it feel so wrong?',
    accentColor: '#4D55FD',
    bgTint: '#EEF0FF',
  },
  {
    id: 'ignoring',
    category: 'Deep Dive',
    title: "A feeling I've been trying to ignore or push down",
    placeholder: 'If that feeling had a voice, what is it trying to tell you?',
    accentColor: '#8E3FE0',
    bgTint: '#F4F1FF',
  },
  {
    id: 'understood',
    category: 'Deep Dive',
    title: 'One thing I wish people understood about me right now',
    placeholder: 'What are people missing when they look at you?',
    accentColor: '#1E93C9',
    bgTint: '#EAF9FF',
  },
  {
    id: 'credit',
    category: 'Today',
    title: 'Something I need to give myself credit for today',
    placeholder: 'Even the smallest victory counts. What did you get through?',
    accentColor: '#5FA74B',
    bgTint: '#F4FBE8',
  },
  {
    id: 'safe',
    category: 'Today',
    title: 'One tiny moment that felt peaceful or safe today',
    placeholder: 'A song, a quiet room, someone laughing, a cool breeze...',
    accentColor: '#D9A514',
    bgTint: '#FFF9E3',
  },
  {
    id: 'pause',
    category: 'Future',
    title: 'If you could hit pause on life for 24 hours, what would you do?',
    placeholder: 'No homework, no expectations, no drama. Where are you?',
    accentColor: '#3D45D8',
    bgTint: '#EEF0FF',
  },
  {
    id: 'dread',
    category: 'Future',
    title: "What are you dreading coming up, and what's the honest worst-case?",
    placeholder: 'Name it here. Once it is written down, it loses half its power.',
    accentColor: '#E8820A',
    bgTint: '#FFF6F1',
  },
];
