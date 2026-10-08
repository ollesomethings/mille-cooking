export const AVATAR_SIZE_MAP: Record<string, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

export const DEFAULT_AVATAR_SIZE = 48;
export const DEFAULT_STACK_SIZE = 42;
export const DEFAULT_OVERLAP_PERCENTAGE = 0.35;
export const AVATAR_FONT_SIZE_RATIO = 0.36;
export const AVATAR_IMAGE_BACKGROUND = '#E5E7EB';

export function getInitials(name?: string): string {
  if (!name || name.trim().length === 0) return 'U';

  const trimmedName = name.trim();
  const parts = trimmedName.split(' ').filter(part => part.length > 0);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return parts[0].slice(0, 2).toUpperCase();
}

export function getAvatarBackgroundColor(name?: string): string {
  if (!name) return AVATAR_IMAGE_BACKGROUND;

  const colors = [
    '#93C5FD', // blue-300
    '#FCD34D', // yellow-300
    '#F87171', // red-300
    '#A78BFA', // purple-300
    '#34D399', // emerald-300
    '#60A5FA', // blue-400
    '#FBBF24', // yellow-400
    '#F472B6', // pink-400
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
}

export function getAvatarSizeValue(
  size: string | number,
  defaultSize: number = DEFAULT_AVATAR_SIZE,
): number {
  return typeof size === 'number' ? size : AVATAR_SIZE_MAP[size] || defaultSize;
}

export function calculateOverlap(
  sizeValue: number,
  overlapPercentage: number,
  index: number,
): number {
  return index > 0 ? sizeValue * overlapPercentage : 0;
}
