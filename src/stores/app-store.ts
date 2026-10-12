import { create } from 'zustand';
import {
  ChatMessage,
  hubPhotos,
  initialMessages,
  Swap,
  SwapStatus,
  WallCardData,
} from '@/data/mock';

let nextId = 100;

declare global {
  interface Window {
    /** Headless-verification hook: the chat store, dev builds only */
    __app?: typeof useAppStore;
  }
}

const mentorReplies = [
  'love that!!',
  'ok that is actually amazing',
  'haha no way',
  "that's what i'm talking about!",
];

interface AppState {
  messages: ChatMessage[];
  swap: Swap | null;
  hubSwaps: Swap[];
  sendMessage: (text: string) => void;
  pushMentorReply: () => void;
  pushMentorMessage: (text: string) => void;
  pushWallCard: (card: WallCardData) => void;
  addSystemMessage: (text: string, kind?: ChatMessage['kind'], entityId?: string) => void;
  /** Prefilled chat input ("wait you like this??" jumps from a playlist) */
  chatDraft: string | null;
  setChatDraft: (text: string | null) => void;
  startMentorSwap: () => void;
  startTeenSwap: (promptTitle: string, promptSubtitle: string) => void;
  addTeenPhoto: (uri: string) => void;
  revealSwap: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  messages: initialMessages,
  // The demo starts with a mentor-initiated swap waiting for the teen,
  // matching the "chat_new-swap_mentor-initiated" Figma flow.
  swap: {
    id: 'swap-1',
    promptTitle: 'take me back',
    promptSubtitle: 'An old photo that still makes you smile.',
    status: 'mentor_shared',
    mentorPhoto: hubPhotos.mentorOld,
  },
  hubSwaps: [],

  sendMessage: text => {
    const msg: ChatMessage = {
      id: `m${nextId++}`,
      from: 'teen',
      text,
    };
    set(s => ({ messages: [...s.messages, msg] }));
    setTimeout(() => get().pushMentorReply(), 1800);
  },

  pushMentorReply: () => {
    const reply: ChatMessage = {
      id: `m${nextId++}`,
      from: 'mentor',
      text: mentorReplies[Math.floor(Math.random() * mentorReplies.length)],
    };
    set(s => ({ messages: [...s.messages, reply] }));
  },

  pushMentorMessage: text => {
    set(s => ({ messages: [...s.messages, { id: `m${nextId++}`, from: 'mentor', text }] }));
  },

  pushWallCard: card => {
    set(s => ({
      messages: [
        ...s.messages,
        { id: `m${nextId++}`, from: 'teen', text: '', kind: 'wall-card', wallCard: card },
      ],
    }));
  },

  addSystemMessage: (text, kind, entityId) => {
    set(s => ({
      messages: [...s.messages, { id: `m${nextId++}`, from: 'system', text, kind, entityId }],
    }));
  },

  chatDraft: null,
  setChatDraft: chatDraft => set({ chatDraft }),

  startMentorSwap: () => {
    set({
      swap: {
        id: `swap-${nextId++}`,
        promptTitle: 'take me back',
        promptSubtitle: 'An old photo that still makes you smile.',
        status: 'mentor_shared',
        mentorPhoto: hubPhotos.mentorOld,
      },
    });
  },

  startTeenSwap: (promptTitle, promptSubtitle) => {
    set(s => ({
      swap: {
        id: `swap-${nextId++}`,
        promptTitle,
        promptSubtitle,
        status: 'mentor_shared',
        mentorPhoto: hubPhotos.mentorOld,
      },
      messages: [
        ...s.messages,
        { id: `m${nextId++}`, from: 'system', text: 'You started a Swap', kind: 'swap-event' as const },
      ],
    }));
  },

  addTeenPhoto: uri => {
    const current = get().swap;
    if (!current) return;
    set({
      swap: { ...current, teenPhoto: uri, status: 'ready' as SwapStatus },
    });
  },

  revealSwap: () => {
    const current = get().swap;
    if (!current) return;
    const revealed = { ...current, status: 'revealed' as SwapStatus };
    set(s => ({
      swap: revealed,
      hubSwaps: [revealed, ...s.hubSwaps],
    }));
  },
}));

if (typeof window !== 'undefined' && __DEV__) {
  window.__app = useAppStore;
}
