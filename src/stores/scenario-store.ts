import { welcomeNoteContent } from '@/data/hub-entities';
import { hubEntities } from '@/data/hub-entities';
import { initialGoals } from '@/data/goals';
import { mentorCandidates } from '@/data/mentor-candidates';
import { hubPhotos, initialMessages, mentor } from '@/data/mock';
import { MENTOR_FIRST_PLAYLIST } from '@/data/playlists';
import { useAppStore } from '@/stores/app-store';
import { useGoalsStore } from '@/stores/goals-store';
import { useHubStore } from '@/stores/hub-store';
import { create } from 'zustand';

/**
 * Prototype-level scenario control (not part of the app being prototyped).
 * Picked on the launcher screen before the app starts; seeds every store
 * to match. Reloading the page returns to the launcher.
 */
export type ScenarioMode = 'new' | 'existing';

// The mock `mentor` object is read at render time across the app, so
// mutating it swaps the mentor identity everywhere (avatars, greetings,
// welcome note). The existing-teen scenario always runs as Noah.
function applyMentor(candidateId: string | undefined) {
  const candidate =
    mentorCandidates.find(m => m.id === candidateId) ?? mentorCandidates[0];
  Object.assign(mentor, {
    id: candidate.id,
    name: candidate.name,
    avatar: candidate.avatarUri,
  });
}

interface ScenarioState {
  mode: ScenarioMode | null;
  /** Preferred name picked during new-teen onboarding */
  teenName: string;
  /** Late-night scenario: the mentor is offline (set on the launcher) */
  mentorOffline: boolean;
  setMentorOffline: (b: boolean) => void;
  /** New-teen flow: skip the signup questions and land in chat matched */
  skipOnboarding: boolean;
  setSkipOnboarding: (b: boolean) => void;
  /** Hub offers the calming/mental-health tool set instead of the default */
  mentalHealthTools: boolean;
  setMentalHealthTools: (b: boolean) => void;
  /** Hub offers the get-to-know-your-mentor tool set instead of the default */
  mentorTools: boolean;
  setMentorTools: (b: boolean) => void;
  /** Chat shows a one-off pointer card to the Hub (preset tester links) */
  hubHint: boolean;
  setHubHint: (b: boolean) => void;
  /** "This is a demo" dialog, shown once per session over everything */
  disclaimerSeen: boolean;
  setDisclaimerSeen: (b: boolean) => void;
  /** Chat coach mark pointing at the "Your space" pill, once per session */
  hubCoachSeen: boolean;
  setHubCoachSeen: (b: boolean) => void;
  /** Olle's version: Home/Journey tab layout and prompt-first journal */
  ollesVersion: boolean;
  setOllesVersion: (b: boolean) => void;
  chooseScenario: (mode: ScenarioMode) => void;
  /** New-teen onboarding finished: seed the fresh account's first content. */
  completeOnboarding: (name: string, mentorId?: string) => void;
}

// Normalize the default mentor to the Noah candidate (real photo asset)
// before anything renders — the splash mockups read mentor.avatar too.
applyMentor('mentor-1');

declare global {
  interface Window {
    /** Headless-verification hook: the scenario store, dev builds only */
    __scenario?: typeof useScenarioStore;
  }
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  mode: null,
  teenName: 'John',
  mentorOffline: false,
  setMentorOffline: mentorOffline => set({ mentorOffline }),
  skipOnboarding: false,
  setSkipOnboarding: skipOnboarding => set({ skipOnboarding }),
  // The two special tool sets are mutually exclusive — the Hub shows one set
  mentalHealthTools: false,
  setMentalHealthTools: mentalHealthTools =>
    set(s => ({ mentalHealthTools, mentorTools: mentalHealthTools ? false : s.mentorTools })),
  mentorTools: false,
  setMentorTools: mentorTools =>
    set(s => ({ mentorTools, mentalHealthTools: mentorTools ? false : s.mentalHealthTools })),
  hubHint: false,
  setHubHint: hubHint => set({ hubHint }),
  disclaimerSeen: false,
  setDisclaimerSeen: disclaimerSeen => set({ disclaimerSeen }),
  hubCoachSeen: false,
  setHubCoachSeen: hubCoachSeen => set({ hubCoachSeen }),
  ollesVersion: true,
  setOllesVersion: ollesVersion => set({ ollesVersion }),

  chooseScenario: mode => {
    if (mode === 'new') {
      useAppStore.setState({ messages: [], swap: null, hubSwaps: [] });
      useHubStore.setState({
        entities: [],
        seenInfoSheets: { moment: false, note: false, swap: false },
      });
      useGoalsStore.setState({ goals: [] });
    } else {
      // Existing teen: three weeks in — full seeds, explainers already seen.
      applyMentor('mentor-1');
      useAppStore.setState({
        messages: initialMessages,
        swap: {
          id: 'swap-1',
          promptTitle: 'take me back',
          promptSubtitle: 'An old photo that still makes you smile.',
          status: 'mentor_shared',
          mentorPhoto: hubPhotos.mentorOld,
        },
        hubSwaps: [],
      });
      useHubStore.setState({
        entities: hubEntities,
        seenInfoSheets: { moment: true, note: true, swap: true },
      });
      useGoalsStore.setState({ goals: initialGoals });
    }
    set({ mode });
  },

  completeOnboarding: (name, mentorId) => {
    const teenName = name.trim() || 'John';
    applyMentor(mentorId);
    set({ teenName });

    // The real app auto-creates the mentor's welcome note on signup.
    useHubStore.getState().addEntity({
      entityType: 'note',
      owner: { name: mentor.name, avatar: mentor.avatar, role: 'mentor' },
      note: { content: welcomeNoteContent(teenName) },
    });

    // ...and auto-delivers the mentor's "this is my vibe" playlist (made
    // once during mentor onboarding). Added after the note so it sits at
    // the top of a new teen's hub. Works offline — it's pre-left content.
    const playlistId = useHubStore.getState().addEntity({
      entityType: 'playlist',
      owner: { name: mentor.name, avatar: mentor.avatar, role: 'mentor' },
      playlist: { ...MENTOR_FIRST_PLAYLIST, reactions: {} },
    });
    useAppStore
      .getState()
      .addSystemMessage(`${mentor.name} made you a playlist`, 'playlist-event', playlistId);

    // Mentor offline (late-night signup): NO live greeting — the chat's
    // offline block shows the automated holding message instead. We never
    // simulate a live person.
    if (get().mentorOffline) return;

    // Mentor says hi shortly after the teen lands in chat.
    setTimeout(() => {
      useAppStore.getState().pushMentorMessage(`hey ${teenName}!! i'm ${mentor.name} 👋`);
    }, 1400);
    setTimeout(() => {
      useAppStore
        .getState()
        .pushMentorMessage(
          "so glad you're here. no pressure to reply right away — this space is yours.",
        );
    }, 3200);
  },
}));

if (typeof window !== 'undefined' && __DEV__) {
  window.__scenario = useScenarioStore;
}
