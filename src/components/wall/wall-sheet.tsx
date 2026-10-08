import { AnswersSheetContent } from '@/components/wall/answers-card';
import { BasicsSheetContent } from '@/components/wall/basics-card';
import { ColorSheetContent, InterestsSheetContent, SinglePhotoSheetContent, StickerSheetContent } from '@/components/wall/misc-sheets';
import { PhotosSheetContent } from '@/components/wall/photos-card';
import { ShelfSheetContent } from '@/components/wall/shelf-card';
import { SongSheetContent } from '@/components/wall/song-card';
import { useWallStore } from '@/stores/wall-store';
import { useEffect } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function WallSheet() {
  const sheet = useWallStore(s => s.wallSheet);
  const closeSheet = useWallStore(s => s.closeSheet);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!sheet) Keyboard.dismiss();
  }, [sheet]);

  if (!sheet) return null;

  let content = null;
  if (sheet === 'color') content = <ColorSheetContent />;
  else if (sheet === 'stickers') content = <StickerSheetContent />;
  else if (sheet === 'interests') content = <InterestsSheetContent />;
  else if (sheet === 'basics') content = <BasicsSheetContent />;
  else if (sheet === 'song') content = <SongSheetContent />;
  else if (sheet === 'shelf') content = <ShelfSheetContent />;
  else if (sheet === 'photo') content = <SinglePhotoSheetContent />;
  else if (sheet === 'photos') content = <PhotosSheetContent />;
  else if (sheet === 'answers') content = <AnswersSheetContent />;

  return (
    <Modal transparent visible animationType="fade" onRequestClose={closeSheet}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }} onPress={closeSheet} />
      <Animated.View
        entering={SlideInDown.duration(260).easing(Easing.out(Easing.cubic))}
        exiting={SlideOutDown.duration(200).easing(Easing.in(Easing.cubic))}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '78%',
          backgroundColor: '#fff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 18,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 14,
        }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">{content}</ScrollView>
        <Pressable
          onPress={closeSheet}
          style={{ alignSelf: 'flex-end', marginTop: 10, backgroundColor: '#1E1E1E', borderRadius: 999, paddingHorizontal: 24, paddingVertical: 13 }}
        >
          <Text className="font-avantt-bold" style={{ fontSize: 14, color: '#fff' }}>
            done
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
