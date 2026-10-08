import raw from './confessions.json';

/**
 * Loader for the confessions feed ("Show me I'm not alone"). Tolerant of
 * both a bare array and the { confessions: [...] } wrapper so the export
 * can be swapped without code changes.
 *
 * The bundled set is real anonymized submissions, safety-passed — but NOT
 * yet clinically reviewed. Clinical review is required before shipping.
 */
export interface Confession {
  id?: number;
  text: string;
  theme: string;
}

const data = raw as
  | Confession[]
  | { placeholder?: boolean; confessions: Confession[] };

export const CONFESSIONS: Confession[] = Array.isArray(data)
  ? data
  : data.confessions;

export const IS_PLACEHOLDER_DATA = !Array.isArray(data) && !!data.placeholder;

/** Themes present in the file, in first-appearance order */
export const THEMES: string[] = [...new Set(CONFESSIONS.map(c => c.theme))];

export const themeLabel = (theme: string) =>
  theme.charAt(0).toUpperCase() + theme.slice(1);

/** The "no filter" chip, per spec */
export const ALL_THEMES = 'all';
export const ALL_LABEL = 'Everything at once';
