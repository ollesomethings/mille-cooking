import type { DeepThoughtsCategory } from './types';

const categoryMapBySlug = (categories: DeepThoughtsCategory[]) =>
  new Map(categories.map(category => [category.slug, category]));

/** Resolve a stored Q1/Q2 value to display text: canonical slug → label; custom text → as-is. */
export const getCategoryLabel = (
  value: string,
  categories: DeepThoughtsCategory[],
): string => {
  const bySlug = categoryMapBySlug(categories).get(value);
  if (bySlug) {
    return bySlug.label;
  }

  const byLabel = categories.find(category => category.label === value);
  if (byLabel) {
    return byLabel.label;
  }

  return value;
};

export const isCanonicalCategory = (
  value: string,
  categories: DeepThoughtsCategory[],
): boolean => categoryMapBySlug(categories).has(value);

export const getCategoryBySlug = (
  slug: string,
  categories: DeepThoughtsCategory[],
): DeepThoughtsCategory | undefined => categoryMapBySlug(categories).get(slug);

/** Teen-typed Q1 entry (not a canonical slug). */
export const isCustomCategoryValue = (
  value: string,
  categories: DeepThoughtsCategory[],
): boolean => !isCanonicalCategory(value, categories);

export const normalizeCustomCategory = (
  text: string,
  maxLength: number,
): string => text.trim().slice(0, maxLength);
