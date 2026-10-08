import type { InfoSheetKind } from '@/stores/hub-store';
import { Camera, Grid3x3, Lock, PenLine, RefreshCw, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

// Copy verbatim from mono/link-v2 first-run info sheets
// (share-moment-info-sheet, share-swap-info-sheet, new-note-info-sheet).
const SHEETS: Record<
  InfoSheetKind,
  {
    header: string;
    body: string;
    bullets: { Icon: typeof Camera; text: string }[];
  }
> = {
  moment: {
    header: 'Share a moment',
    body: 'Share something small, for your mentor or just for yourself.',
    bullets: [
      {
        Icon: Camera,
        text: 'Pick up to 6 photos from your camera roll and add a lil caption.',
      },
      {
        Icon: Grid3x3,
        text: "Share to your hub so your mentor can see it too. They'll do the same.",
      },
    ],
  },
  swap: {
    header: 'Start a swap',
    body: 'Pick a prompt and share a photo. Your mentor will share one back. Once both photos are in, they reveal.',
    bullets: [
      {
        Icon: Camera,
        text: 'Pick a prompt and snap a photo to share with your mentor.',
      },
      {
        Icon: RefreshCw,
        text: 'Once your mentor shares theirs back, both photos reveal at the same time.',
      },
    ],
  },
  note: {
    header: 'Share a note',
    body: 'Share something small, for your mentor or just for yourself.',
    bullets: [
      { Icon: PenLine, text: 'Write freely, no rules.' },
      {
        Icon: Lock,
        text: 'Keep it private, or share to your hub so your mentor can see it too.',
      },
    ],
  },
};

export function InfoSheet({
  kind,
  onStart,
  onClose,
}: {
  kind: InfoSheetKind | null;
  onStart: () => void;
  onClose: () => void;
}) {
  // Keep the Modal mounted through the exit so SlideOutDown can play;
  // `visible` drives the inner views' entering/exiting animations.
  const [renderedKind, setRenderedKind] = useState(kind);
  const [visible, setVisible] = useState(!!kind);

  useEffect(() => {
    if (kind) {
      setRenderedKind(kind);
      setVisible(true);
      return;
    }
    setVisible(false);
    const t = setTimeout(() => setRenderedKind(null), 280);
    return () => clearTimeout(t);
  }, [kind]);

  if (!renderedKind) return null;
  const sheet = SHEETS[renderedKind];

  return (
    <Modal visible transparent animationType="none">
      {visible && (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(200)}
          style={{ flex: 1 }}
        >
          <Pressable
            className="flex-1"
            style={{ backgroundColor: 'rgba(31,30,29,0.4)' }}
            onPress={onClose}
          />
        </Animated.View>
      )}
      {visible && (
      <Animated.View
        entering={SlideInDown.duration(260)}
        exiting={SlideOutDown.duration(240)}
        className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-6 pt-8 pb-safe-or-6"
      >
        <View className="items-center mb-2">
          <Sparkles size={26} color="#1F1E1D" strokeWidth={1.6} />
        </View>
        <Text className="text-header-3 text-primary text-center">{sheet.header}</Text>
        <Text className="text-body-2 text-secondary text-center mt-2 px-4">
          {sheet.body}
        </Text>

        <Text
          className="text-geist text-tertiary mt-7 mb-3"
          style={{ fontSize: 10, letterSpacing: 1.4 }}
        >
          HOW IT WORKS
        </Text>
        {sheet.bullets.map(({ Icon, text }) => (
          <View key={text} className="flex-row items-start mb-4">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-surfaces-z2 mt-0.5">
              <Icon size={17} color="#1F1E1D" strokeWidth={1.8} />
            </View>
            <Text className="text-body-2 text-primary ml-3 flex-1" style={{ lineHeight: 21 }}>
              {text}
            </Text>
          </View>
        ))}

        <Pressable
          onPress={onStart}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85 mt-3"
        >
          <Text className="text-body-2 text-white">Start</Text>
        </Pressable>
      </Animated.View>
      )}
    </Modal>
  );
}
