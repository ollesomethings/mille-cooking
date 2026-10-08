import {
  cn,
  type BaseSpotifyVinylProps,
  type SpotifyOEmbedResponse,
  type SpotifyVinylData,
  type SpotifyVinylSize,
} from '@somethings-ui/core';
import React, { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Mask,
  Rect,
  Image as SvgImage,
} from 'react-native-svg';
import { scheduleOnUI } from 'react-native-worklets';

// --------------------------------------------------------------------------
// Size maps
// --------------------------------------------------------------------------

const DISC_SIZE: Record<SpotifyVinylSize, number> = {
  sm: 96,
  md: 160,
  lg: 224,
};

const HOLE_SIZE: Record<SpotifyVinylSize, number> = {
  sm: 8,
  md: 12,
  lg: 16,
};

// --------------------------------------------------------------------------
// oEmbed fetch
// --------------------------------------------------------------------------

const OEMBED_BASE = 'https://open.spotify.com/oembed';

function normalizeSpotifyUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.search = '';
    u.pathname = u.pathname.replace(/^\/embed\//, '/');
    return u.toString();
  } catch {
    // Fallback: strip embed and query params via string ops
    return raw.replace('/embed/', '/').split('?')[0];
  }
}

async function fetchOEmbed(spotifyUrl: string): Promise<SpotifyVinylData> {
  const canonical = normalizeSpotifyUrl(spotifyUrl);
  const url = `${OEMBED_BASE}?url=${encodeURIComponent(canonical)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`oEmbed fetch failed: ${res.status}`);
  const data: SpotifyOEmbedResponse = await res.json();
  return { title: data.title, thumbnailUrl: data.thumbnail_url };
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

export interface SpotifyVinylProps extends BaseSpotifyVinylProps {}

export const SpotifyVinyl = ({
  spotifyUrl,
  previewUrl,
  size = 'md',
  className,
  onPlayChange,
}: SpotifyVinylProps) => {
  const [data, setData] = useState<SpotifyVinylData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Grows monotonically in degrees so we never need to reset it
  const rotation = useSharedValue(0);

  // Unique mask ID to prevent collisions when multiple components render
  const maskId = React.useMemo(
    () => `vinyl-mask-${Math.random().toString(36).substr(2, 9)}`,
    [],
  );

  // One useEffect — unavoidable for async data fetching
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchOEmbed(spotifyUrl)
      .then(d => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [spotifyUrl]);

  // Derived style — runs on UI thread, no JS involvement per frame
  const discStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ rotate: `${rotation.get()}deg` }],
    };
  });

  const handlePress = useCallback(() => {
    console.log(
      'handlePress called, previewUrl:',
      previewUrl,
      'isPlaying:',
      isPlaying,
    );
    if (!previewUrl) {
      console.log('No preview URL, returning early');
      return;
    }

    const newPlaying = !isPlaying;
    console.log('Toggling play state to:', newPlaying);
    setIsPlaying(newPlaying);
    onPlayChange?.(newPlaying);

    scheduleOnUI(() => {
      'worklet';
      if (newPlaying) {
        // Start infinite rotation from current angle
        const currentRotation = rotation.get();
        rotation.set(
          withRepeat(
            withTiming(currentRotation + 360, {
              duration: 2500,
              easing: Easing.linear,
            }),
            -1, // -1 means infinite repetitions
            false, // don't reverse
          ),
        );
      } else {
        // Freeze at the exact current angle
        cancelAnimation(rotation);
      }
    });
  }, [isPlaying, previewUrl, onPlayChange, rotation]);

  const discPx = DISC_SIZE[size];
  const holePx = HOLE_SIZE[size];

  if (loading) {
    return (
      <View className={cn('items-center', className)}>
        <View
          style={{
            width: discPx,
            height: discPx,
            borderRadius: discPx / 2,
            backgroundColor: '#2a2a2a',
          }}
        />
      </View>
    );
  }

  if (error || !data) {
    return null;
  }

  return (
    <View className={cn('items-center', className)}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={
          isPlaying ? `Pause ${data.title}` : `Play ${data.title}`
        }
        accessibilityState={{ selected: isPlaying }}
        disabled={!previewUrl}
      >
        <Animated.View
          style={[
            {
              width: discPx,
              height: discPx,
              borderRadius: discPx / 2,
              overflow: 'hidden',
              opacity: previewUrl ? 1 : 0.8,
            },
            discStyle,
          ]}
        >
          {/* Album art with transparent hole using SVG mask */}
          <Svg width={discPx} height={discPx}>
            <Defs>
              <Mask id={maskId} x="0" y="0" width={discPx} height={discPx}>
                {/* White = visible, Black = transparent */}
                <Rect x="0" y="0" width={discPx} height={discPx} fill="white" />
                <Circle
                  cx={discPx / 2}
                  cy={discPx / 2}
                  r={holePx / 2}
                  fill="black"
                />
              </Mask>
            </Defs>
            {/* Dark vinyl base with same mask (creates hole all the way through) */}
            <Circle
              cx={discPx / 2}
              cy={discPx / 2}
              r={discPx / 2}
              fill="#1a1a1a"
              mask={`url(#${maskId})`}
            />
            {/* Album art with mask creating transparent hole */}
            <SvgImage
              x="0"
              y="0"
              width={discPx}
              height={discPx}
              href={{ uri: data.thumbnailUrl }}
              preserveAspectRatio="xMidYMid slice"
              mask={`url(#${maskId})`}
            />
          </Svg>
        </Animated.View>
      </Pressable>
    </View>
  );
};
