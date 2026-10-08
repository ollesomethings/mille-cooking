// Connect Moment — leveled question bank shared by mentor dashboard + mobile.
// Mirrors the swap-prompts / hot-takes pattern: pure typed TS data, no DB.

export type ConnectLevel = 1 | 2 | 3;

export interface ConnectQuestion {
  // Stable kebab-case slug. Mentor library rows + activity snapshots reference
  // this id, so it must never change for an existing question. Slug algorithm
  // matches Hot Takes (locked 2026-04-21):
  //   lowercase → strip apostrophes → drop articles (a/an/the) and to-be verbs
  //   (is/are/was/were/be/am) → hyphenate → truncate ≤60 chars on word boundary.
  id: string;
  level: ConnectLevel;
  text: string;
}
