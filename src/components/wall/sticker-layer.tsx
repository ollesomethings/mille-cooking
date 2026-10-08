import { PlacedTag, useWallStore } from '@/stores/wall-store';
import { useRef } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

function DraggableTag({ tag, boundsW, boundsH }: { tag: PlacedTag; boundsW: number; boundsH: number }) {
  const moveSticker = useWallStore(s => s.moveSticker);
  const startX = useSharedValue(tag.x);
  const startY = useSharedValue(tag.y);
  const dragging = useSharedValue(0);

  const wPct = (tag.size / Math.max(boundsW, 1)) * 100;
  const hPct = (tag.size / Math.max(boundsH, 1)) * 100;

  const gesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      dragging.set(1);
    })
    .onUpdate(e => {
      'worklet';
      const nx = Math.max(-wPct * 0.35, Math.min(100 - wPct * 0.65, tag.x + (e.translationX / Math.max(boundsW, 1)) * 100));
      const ny = Math.max(-hPct * 0.2, Math.min(100 - hPct * 0.5, tag.y + (e.translationY / Math.max(boundsH, 1)) * 100));
      startX.set(nx);
      startY.set(ny);
    })
    .onEnd(() => {
      'worklet';
      dragging.set(0);
      runOnJS(moveSticker)(tag.id, startX.get(), startY.get());
    });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: `${startX.get()}%`,
    top: `${startY.get()}%`,
    width: tag.size,
    height: tag.size,
    zIndex: dragging.get() ? 60 : 4,
    transform: [
      { rotate: `${tag.rot}deg` },
      { scale: dragging.get() ? 1.06 : 1 },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={style}>
        <Text style={{ fontSize: tag.size * 0.72, textAlign: 'center', lineHeight: tag.size }}>
          {tag.emoji}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

export function StickerLayer({ scale = 1 }: { scale?: number }) {
  const placedTags = useWallStore(s => s.placedTags);
  const boundsRef = useRef({ w: 320, h: 330 });

  if (!placedTags.length) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      onLayout={e => {
        boundsRef.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height };
      }}
    >
      {placedTags.map(tag => (
        <DraggableTag
          key={tag.id}
          tag={{ ...tag, size: tag.size * scale }}
          boundsW={boundsRef.current.w}
          boundsH={boundsRef.current.h}
        />
      ))}
    </View>
  );
}
