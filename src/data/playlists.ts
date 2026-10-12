import { Moodies } from '@/lib/scribbles';

/**
 * Playlists — the "share your taste" feature. Not a music app: 1–10 songs,
 * a title, a cover, snippets only. The mentor's first playlist ("this is my
 * vibe") is created once during mentor onboarding and auto-delivered to
 * every teen they match with — in the prototype that automation IS the seed
 * data (alongside the welcome note). Teen playlists are always shared on
 * send; there are no private playlists.
 */
export interface PlaylistSong {
  id: string;
  title: string;
  artist: string;
  /** Vinyl label / accent color (brand palette) */
  color: string;
}

export interface PlaylistCover {
  moodie: keyof typeof Moodies;
  bg: string;
}

export interface PlaylistData {
  title: string;
  cover: PlaylistCover;
  songs: PlaylistSong[];
  /** songId → who reacted ('teen' | 'mentor'), session state */
  reactions: Record<string, ('teen' | 'mentor')[]>;
  /** The simulated online mentor already followed up once (session state) */
  mentorNoticed?: boolean;
}

/** Default covers a teen can pick from (plus upload later, P1) */
export const COVER_OPTIONS: PlaylistCover[] = [
  { moodie: 'heartEyes', bg: '#FFF0F4' },
  { moodie: 'excited', bg: '#EAF9FF' },
  { moodie: 'happy', bg: '#FFF9E3' },
  { moodie: 'blueSmile', bg: '#F4F1FF' },
];

/** Search catalog for the teen builder — mock stand-in for real search. */
export const SONG_CATALOG: PlaylistSong[] = [
  { id: 's-ivy', title: 'Ivy', artist: 'Frank Ocean', color: '#C2DF4F' },
  { id: 's-killbill', title: 'Kill Bill', artist: 'SZA', color: '#E85C82' },
  { id: 's-505', title: '505', artist: 'Arctic Monkeys', color: '#71E0FF' },
  { id: 's-sweater', title: 'Sweater Weather', artist: 'The Neighbourhood', color: '#FF9812' },
  { id: 's-redbone', title: 'Redbone', artist: 'Childish Gambino', color: '#B164FF' },
  { id: 's-gooddays', title: 'Good Days', artist: 'SZA', color: '#5FA74B' },
  { id: 's-hook', title: 'Line Without a Hook', artist: 'Ricky Montgomery', color: '#FFD84D' },
  { id: 's-space', title: 'Space Song', artist: 'Beach House', color: '#4D55FD' },
  { id: 's-pinkwhite', title: 'Pink + White', artist: 'Frank Ocean', color: '#E85C82' },
  { id: 's-ribs', title: 'Ribs', artist: 'Lorde', color: '#71E0FF' },
  { id: 's-vienna', title: 'Vienna', artist: 'Billy Joel', color: '#FFD84D' },
  { id: 's-moon', title: 'Harvest Moon', artist: 'Neil Young', color: '#FF9812' },
  { id: 's-apocalypse', title: 'Apocalypse', artist: 'Cigarettes After Sex', color: '#B164FF' },
  { id: 's-heather', title: 'Heather', artist: 'Conan Gray', color: '#71E0FF' },
  { id: 's-fourseasons', title: 'From the Start', artist: 'Laufey', color: '#C2DF4F' },
  { id: 's-golden', title: 'Golden Hour', artist: 'JVKE', color: '#FFD84D' },
  { id: 's-sofia', title: 'Sofia', artist: 'Clairo', color: '#E85C82' },
  { id: 's-lover', title: 'Lover, You Should’ve Come Over', artist: 'Jeff Buckley', color: '#4D55FD' },
  { id: 's-chamber', title: 'Chamber of Reflection', artist: 'Mac DeMarco', color: '#5FA74B' },
  { id: 's-badhabit', title: 'Bad Habit', artist: 'Steve Lacy', color: '#FF9812' },
];

/**
 * Noah's "this is my vibe" playlist — made once during mentor onboarding,
 * auto-delivered to every matched teen. Pre-left content, never live.
 */
export const MENTOR_FIRST_PLAYLIST: PlaylistData = {
  title: 'this is the vibe',
  cover: { moodie: 'greenSmile', bg: '#F4FBE8' },
  songs: [
    { id: 'n-nights', title: 'Nights', artist: 'Frank Ocean', color: '#B164FF' },
    { id: 'n-ribs', title: 'Ribs', artist: 'Lorde', color: '#71E0FF' },
    { id: 'n-mystery', title: 'Mystery of Love', artist: 'Sufjan Stevens', color: '#C2DF4F' },
    { id: 'n-dreams', title: 'Dreams', artist: 'Fleetwood Mac', color: '#FFD84D' },
    { id: 'n-1979', title: '1979', artist: 'The Smashing Pumpkins', color: '#FF9812' },
    { id: 'n-washing', title: 'Washing Machine Heart', artist: 'Mitski', color: '#E85C82' },
    { id: 'n-weekend', title: 'The Weekend', artist: 'SZA', color: '#4D55FD' },
  ],
  reactions: {},
};
