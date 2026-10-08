import { create } from 'zustand';
import { ACCENTS } from '@/data/wall-data';
import { useAppStore } from '@/stores/app-store';

export type PromptStage = 'tiny' | 'full' | 'dismissed' | 'resume';
export type ProcStage = 'removing' | 'spraying' | null;
export type SheetKind =
  | 'color'
  | 'stickers'
  | 'interests'
  | 'basics'
  | 'song'
  | 'shelf'
  | 'photo'
  | 'photos'
  | 'answers'
  | null;

export interface PlacedTag {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rot: number;
}

export interface ShelfPick {
  cat: 'books' | 'shows' | 'games';
  label: string;
  color: string;
  emoji: string;
}

export interface AnswerNote {
  q: string;
  a: string;
}

let tagId = 0;

interface WallState {
  prompt: PromptStage;
  panelOpen: boolean;
  mentorPinged: boolean;
  mentorTyping: boolean;
  wallDone: boolean;
  doneMode: 'saved' | 'shared';
  wallComplete: boolean;
  celebrate: boolean;

  name: string;
  accent: number;
  placedTags: PlacedTag[];
  interests: string[];
  basics: Record<string, string>;
  skippedBasics: boolean;

  photo: string | null;
  rawPhoto: string | null;
  procStage: ProcStage;
  photoJustCut: boolean;

  songIdx: SongDefWithArt | null;
  skippedSong: boolean;

  shelf: ShelfPick[];
  skippedShelf: boolean;

  wallPhotos: string[];
  photoPrompts: Record<string, string>;
  skippedPhotos: boolean;

  answers: AnswerNote[];
  skippedAnswers: boolean;

  wallSheet: SheetKind;
  addMenuOpen: boolean;

  expandPrompt: () => void;
  dismissPrompt: () => void;
  openPanel: () => void;
  closePanel: () => void;
  restart: () => void;

  setName: (v: string) => void;
  setAccent: (i: number) => void;
  addSticker: (emoji: string) => void;
  moveSticker: (id: string, x: number, y: number) => void;

  toggleInterest: (label: string) => void;
  addCustomInterest: (label: string) => void;

  setBasic: (key: string, value: string) => void;
  skipBasics: () => void;
  unskipBasics: () => void;

  startPhotoProcessing: (uri: string) => void;
  removePhoto: () => void;

  setSong: (song: SongDefWithArt | null) => void;
  skipSong: () => void;
  unskipSong: () => void;

  toggleShelfItem: (item: ShelfPick) => void;
  skipShelf: () => void;
  unskipShelf: () => void;

  setWallPhotos: (photos: string[]) => void;
  setPhotoPrompt: (src: string, prompt: string) => void;
  skipPhotos: () => void;
  unskipPhotos: () => void;

  saveAnswer: (q: string, a: string) => void;
  removeAnswer: (q: string) => void;
  skipAnswers: () => void;
  unskipAnswers: () => void;

  openSheet: (sheet: SheetKind) => void;
  closeSheet: () => void;
  toggleAddMenu: () => void;

  shareWall: () => void;
  shareWithMentor: () => void;
  keepTweaking: () => void;
  closeCelebration: () => void;
  saveForLater: () => void;
}

export interface SongDefWithArt {
  t: string;
  a: string;
}

const initialWallFields = {
  name: 'Jules',
  accent: 6,
  placedTags: [] as PlacedTag[],
  interests: [] as string[],
  basics: {} as Record<string, string>,
  skippedBasics: false,
  photo: null as string | null,
  rawPhoto: null as string | null,
  procStage: null as ProcStage,
  photoJustCut: false,
  songIdx: null as SongDefWithArt | null,
  skippedSong: false,
  shelf: [] as ShelfPick[],
  skippedShelf: false,
  wallPhotos: [] as string[],
  photoPrompts: {} as Record<string, string>,
  skippedPhotos: false,
  answers: [] as AnswerNote[],
  skippedAnswers: false,
  wallSheet: null as SheetKind,
  addMenuOpen: false,
};

export const useWallStore = create<WallState>((set, get) => ({
  prompt: 'tiny',
  panelOpen: false,
  mentorPinged: false,
  mentorTyping: false,
  wallDone: false,
  doneMode: 'saved',
  wallComplete: false,
  celebrate: false,
  ...initialWallFields,

  expandPrompt: () => set({ prompt: 'full' }),
  dismissPrompt: () => set({ prompt: 'dismissed' }),

  openPanel: () => {
    set({ panelOpen: true, prompt: 'dismissed' });
    if (!get().mentorPinged) {
      setTimeout(() => set({ mentorTyping: true }), 1600);
      setTimeout(() => {
        set({ mentorTyping: false, mentorPinged: true });
        useAppStore.getState().pushMentorMessage('back for a sec — ooh are you making your wall rn?? 👀');
      }, 3400);
    }
  },
  closePanel: () => set({ panelOpen: false, prompt: 'resume' }),

  restart: () =>
    set({
      prompt: 'tiny',
      panelOpen: false,
      mentorPinged: false,
      mentorTyping: false,
      wallDone: false,
      wallComplete: false,
      celebrate: false,
      ...initialWallFields,
    }),

  setName: v => set({ name: v }),
  setAccent: i => set({ accent: i }),
  addSticker: emoji =>
    set(s => ({
      placedTags: s.placedTags.concat({
        id: `tag-${tagId++}`,
        emoji,
        x: 8 + Math.random() * 60,
        y: 8 + Math.random() * 54,
        size: 46 + Math.random() * 22,
        rot: -22 + Math.random() * 44,
      }),
    })),
  moveSticker: (id, x, y) =>
    set(s => ({
      placedTags: s.placedTags.map(t => (t.id === id ? { ...t, x, y } : t)),
    })),

  toggleInterest: label =>
    set(s => ({
      interests: s.interests.includes(label)
        ? s.interests.filter(x => x !== label)
        : s.interests.concat(label),
    })),
  addCustomInterest: label => {
    const clean = label.trim().toLowerCase();
    if (!clean) return;
    set(s => ({
      interests: s.interests.includes(clean) ? s.interests : s.interests.concat(clean),
    }));
  },

  setBasic: (key, value) =>
    set(s => ({
      basics: { ...s.basics, [key]: s.basics[key] === value ? '' : value },
      skippedBasics: false,
    })),
  skipBasics: () => set({ skippedBasics: true, wallSheet: null }),
  unskipBasics: () => set({ skippedBasics: false, addMenuOpen: false }),

  startPhotoProcessing: uri => {
    set({ photo: null, rawPhoto: uri, procStage: 'removing', wallSheet: null, photoJustCut: false });
    setTimeout(() => {
      set({ procStage: 'spraying' });
      setTimeout(() => {
        set({ photo: uri, rawPhoto: null, procStage: null, photoJustCut: true });
        setTimeout(() => set({ photoJustCut: false }), 2200);
      }, 950);
    }, 1250);
  },
  removePhoto: () =>
    set({
      photo: null,
      rawPhoto: null,
      procStage: null,
      photoJustCut: false,
    }),

  setSong: song => set({ songIdx: song, wallSheet: null }),
  skipSong: () => set({ skippedSong: true, wallSheet: null }),
  unskipSong: () => set({ skippedSong: false, addMenuOpen: false }),

  toggleShelfItem: item =>
    set(s => {
      const exists = s.shelf.some(x => x.cat === item.cat && x.label === item.label);
      return {
        shelf: exists
          ? s.shelf.filter(x => !(x.cat === item.cat && x.label === item.label))
          : s.shelf.concat(item),
      };
    }),
  skipShelf: () => set({ skippedShelf: true, wallSheet: null }),
  unskipShelf: () => set({ skippedShelf: false, addMenuOpen: false }),

  setWallPhotos: photos => set({ wallPhotos: photos, skippedPhotos: false }),
  setPhotoPrompt: (src, prompt) =>
    set(s => {
      const map = { ...s.photoPrompts };
      if (prompt === 'no prompt' || map[src] === prompt) delete map[src];
      else map[src] = prompt;
      return { photoPrompts: map };
    }),
  skipPhotos: () => set({ skippedPhotos: true, wallSheet: null }),
  unskipPhotos: () => set({ skippedPhotos: false, addMenuOpen: false }),

  saveAnswer: (q, a) =>
    set(s => ({
      answers: s.answers.filter(x => x.q !== q).concat({ q, a }),
      wallSheet: null,
      skippedAnswers: false,
    })),
  removeAnswer: q => set(s => ({ answers: s.answers.filter(x => x.q !== q) })),
  skipAnswers: () => set({ skippedAnswers: true, wallSheet: null }),
  unskipAnswers: () => set({ skippedAnswers: false, addMenuOpen: false }),

  openSheet: sheet => set({ wallSheet: sheet, addMenuOpen: false }),
  closeSheet: () => set({ wallSheet: null }),
  toggleAddMenu: () => set(s => ({ addMenuOpen: !s.addMenuOpen })),

  shareWall: () => set({ wallComplete: true, addMenuOpen: false, wallSheet: null }),
  shareWithMentor: () => set({ celebrate: true }),
  keepTweaking: () => set({ wallComplete: false, celebrate: false }),
  closeCelebration: () => {
    pushWallCardFromState(get(), 'shared with mentor · delivered');
    set({ celebrate: false, wallComplete: false, panelOpen: false, wallDone: true, doneMode: 'shared' });
  },
  saveForLater: () => {
    pushWallCardFromState(get(), 'saved · finish whenever');
    set({ panelOpen: false, wallDone: true, doneMode: 'saved', wallComplete: false });
  },
}));

function pushWallCardFromState(state: WallState, footer: string) {
  const acc = accentFor(state.accent);
  const basicsCount = Object.values(state.basics).filter(v => (v || '').trim()).length;
  const parts = [
    acc.name,
    `${state.placedTags.length} stickers`,
    basicsCount ? 'the basics' : null,
    state.photo ? 'a photo' : null,
    state.songIdx ? 'a song' : null,
    state.interests.length ? `${state.interests.length} interests` : null,
    state.shelf.length ? `${state.shelf.length} on the shelf` : null,
    state.answers.length ? `${state.answers.length} answers` : null,
    state.wallPhotos.length ? `${state.wallPhotos.length} polaroids` : null,
  ].filter(Boolean);
  useAppStore.getState().pushWallCard({
    name: state.name,
    photo: state.photo,
    accentHl: acc.hl,
    tagSummary: parts.join(' · '),
    footer,
  });
}

export function accentFor(idx: number) {
  return ACCENTS[idx] ?? ACCENTS[0];
}
