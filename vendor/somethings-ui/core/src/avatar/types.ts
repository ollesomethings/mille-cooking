export type AvatarSize = 'sm' | 'md' | 'lg' | number;

export interface BaseAvatarProps {
  imageUrl?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
  variant?: 'default' | 'glass';
}

export type AvatarData = Pick<BaseAvatarProps, 'imageUrl' | 'name'>;

export interface AvatarStackProps {
  avatars: AvatarData[];
  size?: AvatarSize;
  overlapPercentage?: number;
  className?: string;
  showBorder?: boolean;
  reverse?: boolean;
}
