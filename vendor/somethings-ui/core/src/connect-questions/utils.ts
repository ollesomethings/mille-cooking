import { CONNECT_QUESTIONS_DATA } from './questions';
import type { ConnectLevel, ConnectQuestion } from './types';

export const getQuestionsByLevel = (level: ConnectLevel): ConnectQuestion[] =>
  CONNECT_QUESTIONS_DATA.filter(q => q.level === level);

export const getQuestionById = (id: string): ConnectQuestion | undefined =>
  CONNECT_QUESTIONS_DATA.find(q => q.id === id);

// Returns a random question from a given level. Optionally excludes ids that
// have already been seen this session so the same question doesn't repeat
// until the level pool is exhausted.
export const getRandomQuestionByLevel = (
  level: ConnectLevel,
  excludeIds: string[] = [],
): ConnectQuestion => {
  const pool = getQuestionsByLevel(level);
  if (pool.length === 0) {
    throw new Error(`No Connect questions defined for level ${level}`);
  }
  const filtered = pool.filter(q => !excludeIds.includes(q.id));
  const candidates = filtered.length > 0 ? filtered : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
};

// Returns a shuffled copy of the questions for a given level. Useful for
// seeding a per-session shuffle cursor on the mentor setup dialog.
export const getShuffledQuestionsByLevel = (
  level: ConnectLevel,
): ConnectQuestion[] => {
  const pool = getQuestionsByLevel(level);
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
