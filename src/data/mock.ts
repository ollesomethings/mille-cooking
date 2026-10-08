export const teen = {
  id: 'teen-1',
  name: 'John',
  avatar: 'https://i.pravatar.cc/150?img=12',
};

export const mentor = {
  id: 'mentor-1',
  name: 'Noah',
  avatar: 'https://i.pravatar.cc/150?img=59',
};

export const hub = {
  name: 'da boyzz',
  since: 'Since October 2025',
  stats: { days: 23, messages: 120 },
};

export type SwapStatus = 'mentor_shared' | 'waiting_for_mentor' | 'ready' | 'revealed';

export interface Swap {
  id: string;
  promptTitle: string;
  promptSubtitle: string;
  status: SwapStatus;
  mentorPhoto: string;
  teenPhoto?: string;
}

export interface SwapPrompt {
  id: string;
  title: string;
  subtitle: string;
}

export const swapPrompts: SwapPrompt[] = [
  {
    id: 'prompt-1',
    title: 'take me back',
    subtitle: 'An old photo that still makes you smile.',
  },
  {
    id: 'prompt-2',
    title: 'me when i was little',
    subtitle: 'Your favorite childhood photo.',
  },
  {
    id: 'prompt-3',
    title: 'golden hour',
    subtitle: 'A photo you took when the light was just right.',
  },
  {
    id: 'prompt-4',
    title: 'main character energy',
    subtitle: 'A photo where you felt like the main character.',
  },
];

export interface WallCardData {
  name: string;
  photo: string | null;
  accentHl: string;
  tagSummary: string;
  footer: string;
}

export interface ChatMessage {
  id: string;
  from: 'teen' | 'mentor' | 'system';
  text: string;
  timestamp?: string;
  kind?: 'text' | 'swap-event' | 'wall-card' | 'goal-nudge';
  wallCard?: WallCardData;
}

export const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    from: 'teen',
    text: "but like i'm over it - kind of...",
  },
  { id: 't1', from: 'system', text: '12:20 PM', kind: 'text' },
  { id: 'm2', from: 'mentor', text: 'OMG how did that happen??' },
  { id: 'm3', from: 'mentor', text: 'I hope she is ok!!!' },
  { id: 't2', from: 'system', text: '12:20 PM' },
  { id: 'm4', from: 'teen', text: 'feeling depressed about it...' },
  { id: 't3', from: 'system', text: '9:51 PM' },
  {
    id: 'm5',
    from: 'mentor',
    text: "ugh i bet. well listen i'm heading out but message me over the weekend if you wanna chat",
  },
  { id: 'm6', from: 'mentor', text: 'here for you.' },
  { id: 't4', from: 'system', text: '10:01 PM' },
  { id: 'e1', from: 'system', text: 'Noah started a Swap', kind: 'swap-event' },
];

export const hubPhotos = {
  mentorOld: 'https://picsum.photos/seed/mentor-old/600/800',
  teenOld: 'https://picsum.photos/seed/teen-old/600/800',
  park: 'https://picsum.photos/seed/park/600/800',
  food: 'https://picsum.photos/seed/food/600/800',
  ski: 'https://picsum.photos/seed/ski/600/800',
  baby: 'https://picsum.photos/seed/baby/600/800',
};

export const scheduleMentor = {
  name: 'Khayla',
  role: 'Your Mentor',
  avatar: 'https://i.pravatar.cc/300?img=47',
};

export interface TimeSlot {
  id: string;
  label: string;
  time: string;
  duration: string;
}

export const timeSlots: TimeSlot[] = [
  { id: 's1', label: 'Video Call', time: '5:30 PM', duration: '30 min' },
  { id: 's2', label: 'Video Call', time: '6:00 PM', duration: '30 min' },
  { id: 's3', label: 'Video Call', time: '6:30 PM', duration: '30 min' },
  { id: 's4', label: 'Video Call', time: '7:00 PM', duration: '30 min' },
];

export const scheduleDays = [
  { id: 'd1', day: 'Mon', date: 'Feb 10', disabled: true },
  { id: 'd2', day: 'Tue', date: 'Feb 11', disabled: false },
  { id: 'd3', day: 'Wed', date: 'Feb 12', disabled: false },
  { id: 'd4', day: 'Thu', date: 'Feb 12', disabled: false },
  { id: 'd5', day: 'Fri', date: 'Feb 14', disabled: false },
];
