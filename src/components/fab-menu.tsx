import { InfoSheet } from '@/components/hub/info-sheet';
import { useAppStore } from '@/stores/app-store';
import { useHubStore, type InfoSheetKind } from '@/stores/hub-store';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/** Plus icon that rotates 45° into an ✕ when the menu opens. */
function FabIcon({ open }: { open: boolean }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: 180 });
  }, [open, progress]);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 45}deg` }],
  }));
  return (
    <Animated.View style={style}>
      <Plus size={24} color="#FFFFFF" strokeWidth={2} />
    </Animated.View>
  );
}

interface FabOption {
  id: string;
  label: string;
  subLabel?: string;
  emoji: string;
  disabled?: boolean;
  /** First-use explainer sheet to show before the flow */
  infoKind?: InfoSheetKind;
  onPress?: (router: ReturnType<typeof useRouter>) => void;
}

export function FabMenu() {
  const router = useRouter();
  const swap = useAppStore(s => s.swap);
  const seenInfoSheets = useHubStore(s => s.seenInfoSheets);
  const markInfoSeen = useHubStore(s => s.markInfoSeen);
  const [open, setOpen] = useState(false);
  const [pendingSheet, setPendingSheet] = useState<{
    kind: InfoSheetKind;
    onStart: () => void;
  } | null>(null);

  // Swap row label/sub-label per active swap state, mirroring
  // mono/link-v2 src/hooks/use-fab-options.tsx.
  const swapOption: FabOption =
    !swap || swap.status === 'revealed'
      ? {
          id: 'swap',
          label: 'Start a swap',
          emoji: '🃏',
          infoKind: 'swap',
          onPress: r => r.push('/hub/start-swap'),
        }
      : swap.status === 'ready'
        ? {
            id: 'swap',
            label: 'Swap ready',
            subLabel: 'Tap to reveal',
            emoji: '🃏',
            onPress: r => r.push(`/hub/swap/${swap.id}`),
          }
        : swap.status === 'mentor_shared'
          ? {
              id: 'swap',
              label: 'Swap in progress',
              subLabel: 'Finish your swap first',
              emoji: '🃏',
              onPress: r => r.push(`/hub/swap/${swap.id}`),
            }
          : {
              id: 'swap',
              label: 'Swap sent',
              subLabel: 'Waiting on your mentor',
              emoji: '🃏',
              disabled: true,
            };

  const options: FabOption[] = [
    swapOption,
    {
      id: 'note',
      label: 'Share a note',
      emoji: '💌',
      infoKind: 'note',
      onPress: r => r.push('/hub/create-note'),
    },
    {
      id: 'moment',
      label: 'Share a moment',
      emoji: '🏞️',
      infoKind: 'moment',
      onPress: r => r.push('/hub/share-moment'),
    },
  ];

  const handleOption = (option: FabOption) => {
    if (option.disabled) return;
    setOpen(false);
    const go = () => option.onPress?.(router);
    if (option.infoKind && !seenInfoSheets[option.infoKind]) {
      const kind = option.infoKind;
      setPendingSheet({
        kind,
        onStart: () => {
          markInfoSeen(kind);
          setPendingSheet(null);
          go();
        },
      });
      return;
    }
    go();
  };

  return (
    <>
      <InfoSheet
        kind={pendingSheet?.kind ?? null}
        onStart={() => pendingSheet?.onStart()}
        onClose={() => setPendingSheet(null)}
      />
      {open && (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(140)}
          className="absolute inset-0"
        >
          <Pressable
            className="absolute inset-0 bg-white/80"
            onPress={() => setOpen(false)}
          />
        </Animated.View>
      )}
      <View className="absolute right-5 items-end" style={{ bottom: 28 }}>
        {open && (
          <View className="mb-4">
            {options.map((o, i) => (
              <Animated.View
                key={o.id}
                entering={FadeInDown.delay((options.length - 1 - i) * 40).duration(180)}
                exiting={FadeOutDown}
              >
                <Pressable
                  onPress={() => handleOption(o)}
                  className="mb-3 flex-row items-center justify-end active:opacity-70"
                  style={o.disabled ? { opacity: 0.45 } : undefined}
                >
                  <View className="mr-3 items-end">
                    <Text className="text-body-1 text-primary">{o.label}</Text>
                    {o.subLabel ? (
                      <Text className="text-caption-1 text-tertiary">{o.subLabel}</Text>
                    ) : null}
                  </View>
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                    <Text style={{ fontSize: 20 }}>{o.emoji}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}
        <Pressable
          onPress={() => setOpen(o => !o)}
          className="h-14 w-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          }}
        >
          <FabIcon open={open} />
        </Pressable>
      </View>
    </>
  );
}
