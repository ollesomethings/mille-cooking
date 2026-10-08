export type SpotifyVinylSize = 'sm' | 'md' | 'lg';

export interface BaseSpotifyVinylProps {
  /** Spotify track or album URL, e.g. https://open.spotify.com/track/... */
  spotifyUrl: string;
  /**
   * Optional 30-second preview MP3 URL (from Spotify CDN, has CORS open).
   * Fetched server-side via GET /v2/spotify/preview?trackId={id}.
   * If not provided, the disc will spin visually but no audio plays.
   */
  previewUrl?: string | null;
  /**
   * Called when play state changes. Use this to sync external audio players.
   * On web: the component plays audio internally. This is a notification callback.
   * On native: the component does NOT play audio — parent must handle expo-audio.
   */
  onPlayChange?: (isPlaying: boolean) => void;
  /** Disc size (default: 'md') */
  size?: SpotifyVinylSize;
  className?: string;
}

/** Internal state once oEmbed data has loaded */
export interface SpotifyVinylData {
  title: string;
  thumbnailUrl: string;
}

/** Shape of the Spotify oEmbed API response we care about */
export interface SpotifyOEmbedResponse {
  title: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
}
