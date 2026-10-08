import plugin from 'tailwindcss/plugin';
import { fontSize } from '../fonts';

function resolveFontFamily(tokenFamily: string): string {
  if (tokenFamily === 'Avantt' || tokenFamily === 'Avantt Bold') {
    return 'Avantt-Bold';
  }
  if (tokenFamily === 'TWK Lausanne') {
    return 'TWKLausanne-400';
  }
  if (tokenFamily === 'Geist Mono') {
    return 'GeistMono-Medium';
  }
  if (tokenFamily === 'Cedarville Cursive') {
    return 'CedarvilleCursive-Regular';
  }
  return tokenFamily;
}

export const typographyPlugin = plugin(function ({ addUtilities }) {
  const utilities: Record<string, Record<string, string | number>> = {};

  (Object.entries(fontSize) as Array<[string, unknown]>).forEach(
    ([key, tuple]) => {
      if (!Array.isArray(tuple)) return;
      const [size, meta] = tuple as [string, Record<string, unknown>];
      if (!meta?.fontFamily || typeof meta.fontFamily !== 'string') return;

      const resolvedFamily = resolveFontFamily(meta.fontFamily);

      let lineHeight: string | number | undefined = meta.lineHeight as
        | string
        | number
        | undefined;
      if (typeof lineHeight === 'string' && lineHeight.endsWith('%')) {
        lineHeight = parseFloat(lineHeight) / 100;
      }

      let letterSpacing: string | number | undefined = (
        'tracking' in meta ? meta.tracking : meta.letterSpacing
      ) as string | number | undefined;
      if (typeof letterSpacing === 'string' && letterSpacing.endsWith('em')) {
        const sizeNum = parseFloat(size);
        const emVal = parseFloat(letterSpacing);
        letterSpacing = `${sizeNum * emVal}px`;
      } else if (
        typeof letterSpacing === 'string' &&
        !letterSpacing.endsWith('px')
      ) {
        const parsed = parseFloat(letterSpacing);
        letterSpacing = isNaN(parsed) ? undefined : `${parsed}px`;
      }

      const utility: Record<string, string | number> = {
        fontSize: size,
        fontFamily: resolvedFamily,
      };

      if (lineHeight != null) {
        utility.lineHeight = lineHeight;
      }
      if (letterSpacing != null) {
        utility.letterSpacing = letterSpacing;
      }

      utilities[`.text-${key}`] = utility;
    },
  );

  addUtilities(utilities as unknown as Parameters<typeof addUtilities>[0]);
});

export const typographySafelist = (
  Object.keys(fontSize) as Array<keyof typeof fontSize>
)
  .filter(key => {
    const value = fontSize[key];
    return (
      Array.isArray(value) &&
      value[1] &&
      typeof value[1] === 'object' &&
      'fontFamily' in value[1]
    );
  })
  .map(key => `text-${String(key)}`);
