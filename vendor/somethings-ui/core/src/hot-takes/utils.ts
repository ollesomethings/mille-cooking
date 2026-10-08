export const CUSTOM_STATEMENT_PREFIX = 'custom:';

export const isCustomStatementId = (id: string): boolean =>
  id.startsWith(CUSTOM_STATEMENT_PREFIX);

// Generates a `custom:<uuid>` id. Accepts an optional pre-generated uuid so
// callers in environments without a uuid helper can still use this.
export const makeCustomStatementId = (uuid?: string): string => {
  const id =
    uuid ??
    (typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : fallbackUuid());
  return `${CUSTOM_STATEMENT_PREFIX}${id}`;
};

// Minimal RFC4122-ish fallback for environments missing crypto.randomUUID.
// Not cryptographically strong — only used as a last resort.
const fallbackUuid = (): string => {
  const rnd = () =>
    Math.floor(Math.random() * 0x10000)
      .toString(16)
      .padStart(4, '0');
  return `${rnd()}${rnd()}-${rnd()}-4${rnd().slice(1)}-${(Math.floor(Math.random() * 4) + 8).toString(16) + rnd().slice(1)}-${rnd()}${rnd()}${rnd()}`;
};
