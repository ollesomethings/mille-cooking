import { AnswersCard } from '@/components/wall/answers-card';
import { BasicsCard } from '@/components/wall/basics-card';
import { PhotoHero } from '@/components/wall/photo-hero';
import { PhotosCard } from '@/components/wall/photos-card';
import { ShelfCard } from '@/components/wall/shelf-card';
import { SongCard } from '@/components/wall/song-card';
import { accentFor, useWallStore } from '@/stores/wall-store';
import { ChevronLeft, Move, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SKIPPED_LABELS: Record<string, string> = {
  basics: '+ the basics',
  photos: '+ photos',
  song: '+ on repeat',
  shelf: '+ the shelf',
  answers: '+ prompts',
};

function AddBackFab() {
  const [open, setOpen] = useState(false);
  const skippedBasics = useWallStore(s => s.skippedBasics);
  const skippedPhotos = useWallStore(s => s.skippedPhotos);
  const skippedSong = useWallStore(s => s.skippedSong);
  const skippedShelf = useWallStore(s => s.skippedShelf);
  const skippedAnswers = useWallStore(s => s.skippedAnswers);
  const unskipBasics = useWallStore(s => s.unskipBasics);
  const unskipPhotos = useWallStore(s => s.unskipPhotos);
  const unskipSong = useWallStore(s => s.unskipSong);
  const unskipShelf = useWallStore(s => s.unskipShelf);
  const unskipAnswers = useWallStore(s => s.unskipAnswers);

  const hidden: { key: string; onAdd: () => void }[] = [
    skippedBasics ? { key: 'basics', onAdd: unskipBasics } : null,
    skippedPhotos ? { key: 'photos', onAdd: unskipPhotos } : null,
    skippedSong ? { key: 'song', onAdd: unskipSong } : null,
    skippedShelf ? { key: 'shelf', onAdd: unskipShelf } : null,
    skippedAnswers ? { key: 'answers', onAdd: unskipAnswers } : null,
  ].filter(Boolean) as { key: string; onAdd: () => void }[];

  if (!hidden.length) return null;

  return (
    <View style={{ position: 'absolute', right: 18, bottom: 26, alignItems: 'flex-end', gap: 9 }}>
      {open && (
        <View style={{ gap: 7, alignItems: 'flex-end' }}>
          {hidden.map(h => (
            <Animated.View key={h.key} entering={FadeInDown} exiting={FadeOutDown}>
              <Pressable
                onPress={() => {
                  h.onAdd();
                  setOpen(false);
                }}
                style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#F2F0EC', borderRadius: 999, paddingHorizontal: 15, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10 }}
              >
                <Text className="text-geist" style={{ fontSize: 12, color: '#1E1E1E' }}>{SKIPPED_LABELS[h.key]}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      )}
      <Pressable
        onPress={() => setOpen(o => !o)}
        style={{
          width: 52,
          height: 52,
          borderRadius: 999,
          backgroundColor: '#1E1E1E',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.28,
          shadowRadius: 12,
          transform: [{ rotate: open ? '45deg' : '0deg' }],
        }}
      >
        <Plus size={20} color="#fff" strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

export function WallBuilder({ onCollapse }: { onCollapse: () => void }) {
  const insets = useSafeAreaInsets();
  const accent = useWallStore(s => s.accent);
  const shareWall = useWallStore(s => s.shareWall);
  const acc = accentFor(accent);

  return (
    <View style={{ flex: 1, backgroundColor: acc.hl }}>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420, backgroundColor: acc.full, opacity: 0.16 }}
      />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <Pressable
            onPress={onCollapse}
            style={{ width: 36, height: 36, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.7)', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={20} color="#1E1E1E" strokeWidth={2.4} />
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,.65)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
            <Move size={12} color="#58534B" strokeWidth={2} />
            <Text className="text-geist" style={{ fontSize: 11, color: '#58534B' }}>drag stickers anywhere</Text>
          </View>
        </View>

        <PhotoHero />
        <BasicsCard />
        <SongCard />
        <ShelfCard />
        <PhotosCard />
        <AnswersCard />

        <View style={{ marginTop: 28, marginHorizontal: 20, alignItems: 'center', gap: 10 }}>
          <Pressable
            onPress={shareWall}
            style={{ width: '100%', backgroundColor: '#FF5001', borderRadius: 999, paddingVertical: 16, alignItems: 'center', shadowColor: '#FF5001', shadowOpacity: 0.28, shadowRadius: 14 }}
          >
            <Text className="font-avantt-bold" style={{ fontSize: 17, color: '#fff' }}>Done</Text>
          </Pressable>
          <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D' }}>tap anything up here to change it — it saves</Text>
        </View>
      </ScrollView>

      <AddBackFab />
    </View>
  );
}
