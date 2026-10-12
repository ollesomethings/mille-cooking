import { hubPhotos, mentor, teen } from '@/data/mock';
import { MENTOR_FIRST_PLAYLIST, type PlaylistData } from '@/data/playlists';

/**
 * Prototype mirror of the real app's ShareableEntity
 * (mono/link-v2 src/types/shareable-entities.ts), simplified to what the
 * hub grid renders. Swaps created in the prototype's swap flow live in
 * app-store.hubSwaps and are merged in by the hub tab.
 */
export type HubEntityType = 'note' | 'moment' | 'swap' | 'story' | 'playlist';

export interface StoryImage {
  url: string;
  eyebrow: string | null;
  header: string | null;
}

export interface HubOwner {
  name: string;
  avatar: string;
  role: 'teen' | 'mentor';
}

export interface HubEntity {
  id: string;
  entityType: HubEntityType;
  owner: HubOwner;
  createdAt: string;
  /** empty shares ⇒ private (real model uses shares: Share[]) */
  isPrivate?: boolean;
  note?: { content: string };
  moment?: { caption: string | null; images: string[] };
  swap?: {
    promptId: string;
    promptTitle: string;
    mentorPhoto: string;
    teenPhoto: string;
    revealed: boolean;
  };
  /** Mentor-authored, read-only in the real app */
  story?: { images: StoryImage[] };
  /** Shared taste — see src/data/playlists.ts */
  playlist?: PlaylistData;
}

// Verbatim from mono/link-v2 app/hub/welcome-note.tsx (typos included).
export function welcomeNoteContent(teenName: string): string {
  return `Welcome to Somethings, ${teenName}!

So excited to get to know you. A few things:

1. This is a safe space to share your thoughts/feelings.
2. You can keep them private or you want or share anytime
3. Don't feel like you have to talk to me every day. there's no pressure.
4. Think of me as an older sibling or friend - this is a FUN, casual space where we can get to know each other.

Excited to get started,
${mentor.name}`;
}

export const WELCOME_NOTE_CONTENT = welcomeNoteContent(teen.name);

export const hubEntities: HubEntity[] = [
  {
    id: 'entity-story-1',
    entityType: 'story',
    owner: { name: mentor.name, avatar: mentor.avatar, role: 'mentor' },
    createdAt: 'Yesterday',
    story: {
      images: [
        {
          url: hubPhotos.ski,
          eyebrow: 'FROM YOUR MENTOR',
          header: 'Went up the mountain this weekend',
        },
        {
          url: hubPhotos.park,
          eyebrow: null,
          header: 'The walk down was the best part',
        },
        {
          url: hubPhotos.food,
          eyebrow: null,
          header: 'Earned this after',
        },
      ],
    },
  },
  {
    id: 'entity-swap-1',
    entityType: 'swap',
    owner: { name: mentor.name, avatar: mentor.avatar, role: 'mentor' },
    createdAt: 'Last week',
    swap: {
      promptId: 'take-me-back',
      promptTitle: 'take me back',
      mentorPhoto: hubPhotos.ski,
      teenPhoto: hubPhotos.baby,
      revealed: true,
    },
  },
  {
    id: 'entity-moment-1',
    entityType: 'moment',
    owner: { name: mentor.name, avatar: mentor.avatar, role: 'mentor' },
    createdAt: '2 weeks ago',
    moment: {
      caption: 'saturday hike, almost died but the view tho',
      images: [hubPhotos.park, hubPhotos.food],
    },
  },
  {
    id: 'entity-note-2',
    entityType: 'note',
    owner: { name: teen.name, avatar: teen.avatar, role: 'teen' },
    createdAt: '3 weeks ago',
    isPrivate: true,
    note: {
      content:
        "today was actually okay. didn't think it would be.\n\nkinda proud of myself for just showing up.",
    },
  },
  {
    // The mentor's first playlist — auto-delivered on match, like the
    // welcome note. The start of the relationship, so it sits with it.
    id: 'entity-playlist-first',
    entityType: 'playlist',
    owner: { name: mentor.name, avatar: mentor.avatar, role: 'mentor' },
    createdAt: 'Since day one',
    playlist: { ...MENTOR_FIRST_PLAYLIST, reactions: {} },
  },
  {
    id: 'entity-note-welcome',
    entityType: 'note',
    owner: { name: mentor.name, avatar: mentor.avatar, role: 'mentor' },
    createdAt: 'Since day one',
    note: { content: WELCOME_NOTE_CONTENT },
  },
];
