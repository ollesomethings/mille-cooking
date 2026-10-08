import { Asset } from 'expo-asset';
import type { ImageSourcePropType } from 'react-native';

/**
 * Matched-mentor candidates for onboarding browse/detail, mirroring
 * mono/link-v2 mentor-detail-flow. Photos and interest icons are the real
 * demo assets copied from mono (assets/mentors). Card colors from
 * mentor-browse.tsx.
 */
export const MENTOR_CARD_COLORS = ['#b164ff', '#ff6fa3', '#7178ff', '#ff9812', '#5fa74b'];

const PHOTO_NOAH = require('@assets/mentors/mentor-new-4.png');
const PHOTO_MADDIE = require('@assets/mentors/mentor-new-3.png');
const PHOTO_KAIA = require('@assets/mentors/mentor-new-5.png');

const ICONS = {
  sports: require('@assets/mentors/mentor-interests/sports.png'),
  cooking: require('@assets/mentors/mentor-interests/cooking.png'),
  movies: require('@assets/mentors/mentor-interests/movies.png'),
  drawing: require('@assets/mentors/mentor-interests/drawing.png'),
  makingMusic: require('@assets/mentors/mentor-interests/making music.png'),
  fashion: require('@assets/mentors/mentor-interests/fashion.png'),
  nature: require('@assets/mentors/mentor-interests/nature.png'),
  pets: require('@assets/mentors/mentor-interests/pets.png'),
  photography: require('@assets/mentors/mentor-interests/photography.png'),
} as const;

export interface MentorCandidate {
  id: string;
  name: string;
  firstName: string;
  /** Full card/hero photo (local asset) */
  photo: ImageSourcePropType;
  /** Same photo as a URL string for `source={{ uri }}` consumers app-wide */
  avatarUri: string;
  credential: string;
  bio: string;
  interests: { icon: ImageSourcePropType; label: string }[];
  /** Track shown on the detail screen's vinyl */
  spotifyUrl: string;
  /** Horizontal photo strip on the profile */
  gallery: string[];
  /** Hero photo of the "my interests" stacked cards */
  interestPhotos: string[];
}

const uri = (mod: number) => Asset.fromModule(mod).uri;
const src = (mod: number) => ({ uri: uri(mod) });

export const mentorCandidates: MentorCandidate[] = [
  {
    id: 'mentor-1',
    name: 'Noah',
    firstName: 'Noah',
    photo: src(PHOTO_NOAH),
    avatarUri: uri(PHOTO_NOAH),
    credential: 'Certified Peer Specialist',
    bio: 'hey, i am noah. 🏀 i became a mentor because everyone deserves someone steady in their corner. i know what it feels like to carry things alone — you don\'t have to here.',
    interests: [
      { icon: src(ICONS.sports), label: 'Sports' },
      { icon: src(ICONS.cooking), label: 'Food / cooking' },
      { icon: src(ICONS.movies), label: 'Movies / TV' },
    ],
    spotifyUrl: 'https://open.spotify.com/track/1dGr1c8CrMLDpV6mPbImSI',
    gallery: [
      'https://picsum.photos/seed/noah-court/420/560',
      'https://picsum.photos/seed/noah-ramen/420/500',
      'https://picsum.photos/seed/noah-trail/420/540',
    ],
    interestPhotos: [
      'https://picsum.photos/seed/noah-stadium/700/900',
      'https://picsum.photos/seed/noah-kitchen/700/900',
      'https://picsum.photos/seed/noah-cinema/700/900',
    ],
  },
  {
    id: 'mentor-2',
    name: 'Maddie',
    firstName: 'Maddie',
    photo: src(PHOTO_MADDIE),
    avatarUri: uri(PHOTO_MADDIE),
    credential: 'Certified Peer Specialist',
    bio: "hi!! i'm maddie 🌊 art school survivor, playlist maker, professional overthinker. i became a mentor so you'd have someone who actually listens.",
    interests: [
      { icon: src(ICONS.drawing), label: 'Drawing / art' },
      { icon: src(ICONS.makingMusic), label: 'Making music' },
      { icon: src(ICONS.fashion), label: 'Fashion' },
    ],
    spotifyUrl: 'https://open.spotify.com/track/0V3wPSX9ygBnCm8psDIegu',
    gallery: [
      'https://picsum.photos/seed/maddie-studio/420/540',
      'https://picsum.photos/seed/maddie-show/420/500',
      'https://picsum.photos/seed/maddie-paint/420/560',
    ],
    interestPhotos: [
      'https://picsum.photos/seed/maddie-canvas/700/900',
      'https://picsum.photos/seed/maddie-stage/700/900',
      'https://picsum.photos/seed/maddie-thrift/700/900',
    ],
  },
  {
    id: 'mentor-3',
    name: 'Kaia',
    firstName: 'Kaia',
    photo: src(PHOTO_KAIA),
    avatarUri: uri(PHOTO_KAIA),
    credential: 'Certified Peer Specialist',
    bio: "hey, i'm kaia 🌱 plant mom, film photo taker, certified good listener. whatever pace you need, we go at yours.",
    interests: [
      { icon: src(ICONS.nature), label: 'Nature' },
      { icon: src(ICONS.pets), label: 'Pets' },
      { icon: src(ICONS.photography), label: 'Photography' },
    ],
    spotifyUrl: 'https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg',
    gallery: [
      'https://picsum.photos/seed/kaia-plants/420/560',
      'https://picsum.photos/seed/kaia-dog/420/500',
      'https://picsum.photos/seed/kaia-film/420/540',
    ],
    interestPhotos: [
      'https://picsum.photos/seed/kaia-forest/700/900',
      'https://picsum.photos/seed/kaia-pup/700/900',
      'https://picsum.photos/seed/kaia-camera/700/900',
    ],
  },
];
