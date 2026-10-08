export interface Accent {
  name: string;
  full: string;
  hl: string;
}

export const ACCENTS: Accent[] = [
  { name: 'Tangelo', full: '#FF5001', hl: '#FFDCCC' },
  { name: 'Apricot', full: '#FF9812', hl: '#FFEAD0' },
  { name: 'Sunshine', full: '#FFD400', hl: '#FFF3B0' },
  { name: 'Lime', full: '#A9C93A', hl: '#EBF3C8' },
  { name: 'Forest', full: '#5FA74B', hl: '#DFEDD8' },
  { name: 'Sky', full: '#3FC8F0', hl: '#DAF4FC' },
  { name: 'Periwinkle', full: '#7178FF', hl: '#E3E4FF' },
  { name: 'Violet', full: '#B164FF', hl: '#EFE0FF' },
  { name: 'Fuchsia', full: '#FF83FE', hl: '#FFE6FF' },
  { name: 'Blush', full: '#FF8592', hl: '#FFE3E6' },
];

export interface StickerDef {
  emoji: string;
  name: string;
  cat: string;
}

export const STICKERS: StickerDef[] = [
  { emoji: '👽', name: 'alien', cat: 'space' },
  { emoji: '🏀', name: 'basketball', cat: 'sports' },
  { emoji: '🌸', name: 'blossom', cat: 'nature' },
  { emoji: '🦋', name: 'butterfly', cat: 'nature' },
  { emoji: '📷', name: 'camera', cat: 'photo' },
  { emoji: '🍀', name: 'clover', cat: 'nature' },
  { emoji: '🎮', name: 'controller', cat: 'games' },
  { emoji: '😎', name: 'cool', cat: 'mood' },
  { emoji: '🔥', name: 'fire', cat: 'mood' },
  { emoji: '👻', name: 'ghost', cat: 'mood' },
  { emoji: '🎸', name: 'guitar', cat: 'music' },
  { emoji: '🎧', name: 'headphones', cat: 'music' },
  { emoji: '😍', name: 'heart-eyes', cat: 'love' },
  { emoji: '❤️', name: 'heart', cat: 'love' },
  { emoji: '💯', name: 'hundred', cat: 'mood' },
  { emoji: '🌙', name: 'moon', cat: 'space' },
  { emoji: '🎵', name: 'note', cat: 'music' },
  { emoji: '🎉', name: 'party', cat: 'mood' },
  { emoji: '✌️', name: 'peace', cat: 'mood' },
  { emoji: '🍕', name: 'pizza', cat: 'food' },
  { emoji: '🌈', name: 'rainbow', cat: 'nature' },
  { emoji: '🚀', name: 'rocket', cat: 'space' },
  { emoji: '🛹', name: 'skateboard', cat: 'sports' },
  { emoji: '💖', name: 'sparkle-heart', cat: 'love' },
  { emoji: '✨', name: 'sparkles', cat: 'mood' },
  { emoji: '🤩', name: 'star-struck', cat: 'mood' },
  { emoji: '☀️', name: 'sun', cat: 'space' },
];

export const STICKER_CATS = ['happy', 'fire', 'music', 'love', 'sports', 'space', 'food', 'nature'];

export const INTERESTS = [
  'drawing',
  'late-night playlists',
  'thrifting',
  'JV hoops',
  'anime',
  'skating',
  'baking',
  'horror movies',
];

export interface BasicField {
  key: string;
  label: string;
  options: string[];
}

export const BASIC_FIELDS: BasicField[] = [
  { key: 'age', label: 'AGE', options: ['13', '14', '15', '16', '17', '18', '19'] },
  { key: 'grade', label: 'GRADE', options: ['7th', '8th', '9th', '10th', '11th', '12th', 'out of school'] },
  {
    key: 'sign',
    label: 'STAR SIGN',
    options: ['♈ Aries', '♉ Taurus', '♊ Gemini', '♋ Cancer', '♌ Leo', '♍ Virgo', '♎ Libra', '♏ Scorpio', '♐ Sagittarius', '♑ Capricorn', '♒ Aquarius', '♓ Pisces'],
  },
  { key: 'pronouns', label: 'PRONOUNS', options: ['she/her', 'he/him', 'they/them', 'she/they', 'he/they', 'ask me'] },
  { key: 'energy', label: 'MY HOURS', options: ['night owl', 'early bird', 'depends on the day'] },
  { key: 'company', label: 'AT HOME', options: ['a dog', 'a cat', 'siblings', 'a little chaos', 'just me'] },
];

export const QA_PROMPTS = [
  'my comfort show is…',
  'lately I’ve been into…',
  'something that made me laugh this week…',
  'a place I feel most like myself…',
  'I wish more people knew…',
  'the last thing I sent to my group chat…',
  'what I do when it’s a lot…',
];

export const PHOTO_PROMPTS = ['where is this?', 'caption it in five words', 'what was happening here?', 'guess the vibe', 'no prompt'];

export interface SongDef {
  t: string;
  a: string;
}

export const SONGS: SongDef[] = [
  { t: 'slow bus home', a: 'the mall walkers' },
  { t: 'parking lot summer', a: 'glass apartment' },
  { t: 'txt me back', a: 'juniper velvet' },
  { t: 'homework at 2am', a: 'the porch lights' },
  { t: 'sour candy theory', a: 'petal engine' },
  { t: 'good 4 u', a: 'olivia rodrigo' },
  { t: 'kill bill', a: 'sza' },
  { t: 'friday i\'m in love', a: 'the cure' },
  { t: 'from the start', a: 'laufey' },
];

export const SONG_TRY = ['olivia rodrigo', 'sza', 'the cure', 'laufey'];

export interface ShelfItem {
  cat: 'books' | 'shows' | 'games';
  label: string;
  color: string;
  emoji: string;
}

export interface MediaCat {
  key: 'books' | 'shows' | 'games';
  label: string;
  dot: string;
  placeholder: string;
  ratio: number;
  suggestions: { label: string; color: string; emoji: string }[];
}

export const MEDIA: MediaCat[] = [
  {
    key: 'books',
    label: 'books',
    dot: '#B164FF',
    placeholder: 'search any book…',
    ratio: 2 / 3,
    suggestions: [
      { label: 'Heartstopper', color: '#FFD2CF', emoji: '💌' },
      { label: 'Percy Jackson', color: '#CFE3FF', emoji: '⚡️' },
      { label: 'The Outsiders', color: '#E4DCC8', emoji: '🏍️' },
      { label: 'Hunger Games', color: '#2E2A28', emoji: '🔥' },
    ],
  },
  {
    key: 'shows',
    label: 'movies & shows',
    dot: '#3FC8F0',
    placeholder: 'search movies & shows…',
    ratio: 2 / 3,
    suggestions: [
      { label: 'Stranger Things', color: '#241417', emoji: '📼' },
      { label: 'Wednesday', color: '#1C1B24', emoji: '🖤' },
      { label: 'Spirited Away', color: '#CFE8DC', emoji: '🐉' },
      { label: 'Spider-Verse', color: '#3A1750', emoji: '🕸️' },
    ],
  },
  {
    key: 'games',
    label: 'games',
    dot: '#5FA74B',
    placeholder: 'search any game…',
    ratio: 1,
    suggestions: [
      { label: 'Minecraft', color: '#B7E19A', emoji: '⛏️' },
      { label: 'Mario Kart', color: '#FFD9A0', emoji: '🏎️' },
      { label: 'Fortnite', color: '#C8D8FF', emoji: '🪂' },
      { label: 'Stardew Valley', color: '#FFE199', emoji: '🌾' },
    ],
  },
];

export const MOOD_EMOJI = '🙂';
