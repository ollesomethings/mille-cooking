export type PingPosition = 'center' | 'top' | 'bottom';

export interface BasePingProps {
  message: string;
  duration?: number;
  position?: PingPosition;
  onDismiss?: () => void;
  className?: string;
}

export interface PingConfig {
  message: string;
  duration?: number;
  position?: PingPosition;
}
