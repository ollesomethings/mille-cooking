import { hubEntities, type HubEntity } from '@/data/hub-entities';
import { hub } from '@/data/mock';
import { create } from 'zustand';

let nextEntityId = 1000;

export type InfoSheetKind = 'moment' | 'note' | 'swap';

interface HubState {
  /** Custom hub name — real app stores this on the mentorship (max 16 chars) */
  name: string;
  setName: (name: string) => void;

  /** Hub grid content, newest first (real app: ShareableEntity list) */
  entities: HubEntity[];
  /** Returns the new entity's id (chat event lines link back to it) */
  addEntity: (entity: Omit<HubEntity, 'id' | 'createdAt'>) => string;
  /** Toggle a reaction on one playlist song (teen) or add one (mentor) */
  reactToSong: (entityId: string, songId: string, who: 'teen' | 'mentor') => void;
  /** The simulated online mentor follows up at most once per playlist */
  markMentorNoticed: (entityId: string) => void;

  /** In-flight moment draft (real app: draft moment + presigned uploads) */
  draftImages: string[];
  draftCaption: string;
  setDraftImages: (uris: string[]) => void;
  setDraftCaption: (caption: string) => void;

  /** In-flight note draft */
  draftNote: string;
  setDraftNote: (content: string) => void;

  clearDrafts: () => void;

  /** First-use explainer sheets, one per creation flow */
  seenInfoSheets: Record<InfoSheetKind, boolean>;
  markInfoSeen: (kind: InfoSheetKind) => void;
}

export const useHubStore = create<HubState>(set => ({
  name: hub.name,
  setName: name => set({ name: name.slice(0, 16) }),

  entities: hubEntities,
  addEntity: entity => {
    const id = `entity-${nextEntityId++}`;
    set(s => ({
      entities: [{ ...entity, id, createdAt: 'Just now' }, ...s.entities],
    }));
    return id;
  },
  markMentorNoticed: entityId =>
    set(s => ({
      entities: s.entities.map(e =>
        e.id === entityId && e.playlist
          ? { ...e, playlist: { ...e.playlist, mentorNoticed: true } }
          : e,
      ),
    })),
  reactToSong: (entityId, songId, who) =>
    set(s => ({
      entities: s.entities.map(e => {
        if (e.id !== entityId || !e.playlist) return e;
        const current = e.playlist.reactions[songId] ?? [];
        const next = current.includes(who)
          ? who === 'teen'
            ? current.filter(w => w !== who) // teens can un-react
            : current
          : [...current, who];
        return {
          ...e,
          playlist: {
            ...e.playlist,
            reactions: { ...e.playlist.reactions, [songId]: next },
          },
        };
      }),
    })),

  draftImages: [],
  draftCaption: '',
  setDraftImages: draftImages => set({ draftImages }),
  setDraftCaption: draftCaption => set({ draftCaption }),

  draftNote: '',
  setDraftNote: draftNote => set({ draftNote }),

  clearDrafts: () => set({ draftImages: [], draftCaption: '', draftNote: '' }),

  seenInfoSheets: { moment: false, note: false, swap: false },
  markInfoSeen: kind =>
    set(s => ({ seenInfoSheets: { ...s.seenInfoSheets, [kind]: true } })),
}));

declare global {
  interface Window {
    /** Headless-verification hook: the hub store, dev builds only */
    __hub?: typeof useHubStore;
  }
}

if (typeof window !== 'undefined' && __DEV__) {
  window.__hub = useHubStore;
}
