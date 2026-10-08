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
  addEntity: (entity: Omit<HubEntity, 'id' | 'createdAt'>) => void;

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
  addEntity: entity =>
    set(s => ({
      entities: [
        { ...entity, id: `entity-${nextEntityId++}`, createdAt: 'Just now' },
        ...s.entities,
      ],
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
