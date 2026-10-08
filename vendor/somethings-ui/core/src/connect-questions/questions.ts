import type { ConnectQuestion } from './types';

// Question bank — source of truth:
// https://www.notion.so/somethings-get-better/Functional-Moment-3-Connect-Question-Bank-349f05427301804d86d3fb1f64416e6d
//
// Levels are arranged in ascending emotional depth:
//   Level 1 — lightest
//   Level 2 — medium
//   Level 3 — deepest
//
// IDs are stable kebab-case slugs (see types.ts for the slug algorithm). Once
// a question ships, its id MUST NOT change — mentor library rows and activity
// snapshots persist these ids. To retire a question, remove it from this list;
// historical mentor recordings keyed by the id will still play (the server
// stores the id as opaque text), they just stop appearing in the picker.
export const CONNECT_QUESTIONS_DATA: ConnectQuestion[] = [
  // ── Level 1 (lightest) ────────────────────────────────────────────────────
  { id: 'whats-your-go-to-snack', level: 1, text: "What's your go-to snack?" },
  {
    id: 'whats-your-comfort-tv-show',
    level: 1,
    text: "What's your comfort TV show?",
  },
  {
    id: 'whats-song-youve-had-on-repeat-lately',
    level: 1,
    text: "What's a song you've had on repeat lately?",
  },
  {
    id: 'what-app-do-you-spend-most-time-on',
    level: 1,
    text: 'What app do you spend the most time on?',
  },
  {
    id: 'whats-small-thing-that-instantly-puts-you-in-good-mood',
    level: 1,
    text: "What's a small thing that instantly puts you in a good mood?",
  },
  {
    id: 'whats-best-part-of-your-day-usually',
    level: 1,
    text: "What's the best part of your day, usually?",
  },
  {
    id: 'whats-your-favorite-way-to-spend-saturday',
    level: 1,
    text: "What's your favorite way to spend a Saturday?",
  },
  {
    id: 'you-morning-person-or-night-owl',
    level: 1,
    text: 'Are you a morning person or a night owl?',
  },
  {
    id: 'whats-your-favorite-season-and-why',
    level: 1,
    text: "What's your favorite season and why?",
  },
  {
    id: 'whats-food-you-could-eat-every-single-day',
    level: 1,
    text: "What's a food you could eat every single day?",
  },
  {
    id: 'do-you-prefer-texting-or-calling',
    level: 1,
    text: 'Do you prefer texting or calling?',
  },
  {
    id: 'if-you-could-pick-superpower-which-would-you-choose',
    level: 1,
    text: 'If you could pick a superpower, which would you choose?',
  },
  {
    id: 'whats-game-you-could-play-forever-and-not-get-bored',
    level: 1,
    text: "What's a game you could play forever and not get bored?",
  },
  {
    id: 'if-you-could-only-listen-to-one-artist-forever-who',
    level: 1,
    text: 'If you could only listen to one artist forever, who?',
  },
  {
    id: 'whats-fast-food-item-you-think-underrated',
    level: 1,
    text: "What's a fast food item you think is underrated?",
  },
  {
    id: 'what-flavor-ice-cream-you-picking-every-time',
    level: 1,
    text: 'What flavor ice cream are you picking every time?',
  },
  {
    id: 'what-item-do-you-always-keep-in-your-bag-backpack',
    level: 1,
    text: 'What item do you always keep in your bag/backpack?',
  },
  {
    id: 'do-you-have-lucky-number-color-or-item',
    level: 1,
    text: 'Do you have a lucky number, color, or item?',
  },
  {
    id: 'what-movie-do-you-make-people-watch-if-theyve-never-seen-it',
    level: 1,
    text: "What movie do you make people watch if they've never seen it?",
  },
  {
    id: 'what-sport-would-you-want-to-instantly-good-at',
    level: 1,
    text: 'What sport would you want to instantly be good at?',
  },

  // ── Level 2 (medium) ──────────────────────────────────────────────────────
  {
    id: 'what-you-into-that-most-people-dont-know-about',
    level: 2,
    text: "What are you into that most people don't know about?",
  },
  {
    id: 'what-hobby-would-you-pick-up-if-no-one-would-judge-you',
    level: 2,
    text: 'What hobby would you pick up if no one would judge you?',
  },
  {
    id: 'whats-something-youre-secretly-really-good-at',
    level: 2,
    text: "What's something you're secretly really good at?",
  },
  {
    id: 'whats-topic-you-could-talk-about-for-hour',
    level: 2,
    text: "What's a topic you could talk about for an hour?",
  },
  {
    id: 'whats-something-you-loved-as-kid-that-you-kind-of-miss',
    level: 2,
    text: "What's something you loved as a kid that you kind of miss?",
  },
  {
    id: 'whats-tiny-thing-thats-been-making-you-happy-recently',
    level: 2,
    text: "What's a tiny thing that's been making you happy recently?",
  },
  {
    id: 'when-do-you-feel-most-like-yourself',
    level: 2,
    text: 'When do you feel most like yourself?',
  },
  {
    id: 'whats-compliment-you-got-that-genuinely-surprised-you',
    level: 2,
    text: "What's a compliment you got that genuinely surprised you?",
  },
  {
    id: 'whats-something-you-changed-your-mind-about-recently',
    level: 2,
    text: "What's something you changed your mind about recently?",
  },
  {
    id: 'whats-random-thing-you-know-weird-amount-about',
    level: 2,
    text: "What's a random thing you know a weird amount about?",
  },
  {
    id: 'whats-dream-you-had-as-kid-that-you-never-fully-let-go',
    level: 2,
    text: "What's a dream you had as a kid that you never fully let go?",
  },
  {
    id: 'whats-something-that-always-makes-you-laugh',
    level: 2,
    text: "What's something that always makes you laugh?",
  },
  {
    id: 'where-do-you-go-when-you-need-to-clear-your-head',
    level: 2,
    text: 'Where do you go when you need to clear your head?',
  },
  {
    id: 'whos-someone-you-admire-that-isnt-famous',
    level: 2,
    text: "Who's someone you admire that isn't famous?",
  },
  {
    id: 'whats-skill-you-taught-yourself',
    level: 2,
    text: "What's a skill you taught yourself?",
  },
  {
    id: 'whats-something-youd-do-every-day-if-you-had-time',
    level: 2,
    text: "What's something you'd do every day if you had time?",
  },
  {
    id: 'whats-something-you-wish-more-people-cared-about',
    level: 2,
    text: "What's something you wish more people cared about?",
  },
  {
    id: 'when-do-you-feel-most-calm',
    level: 2,
    text: 'When do you feel the most calm?',
  },
  {
    id: 'whats-great-piece-of-advice-youve-gotten',
    level: 2,
    text: "What's a great piece of advice you've gotten?",
  },
  {
    id: 'whats-small-win-you-had-recently-that-meant-lot',
    level: 2,
    text: "What's a small win you had recently that meant a lot?",
  },

  // ── Level 3 (deepest) ─────────────────────────────────────────────────────
  {
    id: 'what-would-your-younger-self-proud-of-you-for',
    level: 3,
    text: 'What would your younger self be proud of you for?',
  },
  {
    id: 'whats-something-people-often-get-wrong-about-you',
    level: 3,
    text: "What's something people often get wrong about you?",
  },
  {
    id: 'whats-something-youre-working-on-in-yourself-right-now',
    level: 3,
    text: "What's something you're working on in yourself right now?",
  },
  {
    id: 'whats-worry-thats-been-on-your-mind-lately',
    level: 3,
    text: "What's a worry that's been on your mind lately?",
  },
  {
    id: 'whats-something-you-wish-someone-would-ask-you',
    level: 3,
    text: "What's something you wish someone would ask you?",
  },
  {
    id: 'when-last-time-you-felt-really-understood',
    level: 3,
    text: 'When was the last time you felt really understood?',
  },
  {
    id: 'whats-something-youre-scared-of-thats-hard-to-explain',
    level: 3,
    text: "What's something you're scared of that's hard to explain?",
  },
  {
    id: 'whats-something-you-wish-you-could-talk-about-more',
    level: 3,
    text: "What's something you wish you could talk about more?",
  },
  {
    id: 'whats-moment-that-changed-how-you-see-yourself',
    level: 3,
    text: "What's a moment that changed how you see yourself?",
  },
  {
    id: 'whats-something-you-had-to-learn-hard-way',
    level: 3,
    text: "What's something you had to learn the hard way?",
  },
  {
    id: 'whats-something-you-wish-you-could-tell-your-younger-self',
    level: 3,
    text: "What's something you wish you could tell your younger self?",
  },
  {
    id: 'when-do-you-feel-most-alone-even-around-people',
    level: 3,
    text: 'When do you feel the most alone, even around people?',
  },
  {
    id: 'whats-feeling-you-have-trouble-putting-into-words',
    level: 3,
    text: "What's a feeling you have trouble putting into words?",
  },
  {
    id: 'whats-something-you-pretend-doesnt-bother-you-but-it-does',
    level: 3,
    text: "What's something you pretend doesn't bother you but it does?",
  },
  {
    id: 'whats-something-youre-still-figuring-out-about-yourself',
    level: 3,
    text: "What's something you're still figuring out about yourself?",
  },
  {
    id: 'what-do-you-need-from-people-that-you-rarely-ask-for',
    level: 3,
    text: 'What do you need from people that you rarely ask for?',
  },
  {
    id: 'whats-conversation-youve-been-avoiding',
    level: 3,
    text: "What's a conversation you've been avoiding?",
  },
  {
    id: 'whats-something-you-forgave-yourself-for',
    level: 3,
    text: "What's something you forgave yourself for?",
  },
  {
    id: 'when-last-time-you-cried-and-what-it-about',
    level: 3,
    text: 'When was the last time you cried and what was it about?',
  },
  {
    id: 'whats-something-you-carry-that-no-one-really-sees',
    level: 3,
    text: "What's something you carry that no one really sees?",
  },
];
