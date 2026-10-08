import { StickerLayer } from '@/components/wall/sticker-layer';
import { accentFor, useWallStore } from '@/stores/wall-store';
import { Moodies, Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { Camera, Sparkles, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

function ScanningPhoto({ uri, caption }: { uri: string; caption: string }) {
  const scanY = useSharedValue(0);

  useEffect(() => {
    scanY.set(withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true));
  }, [scanY]);

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 + scanY.get() * 132 }],
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-end', width: 264, height: 240 }}>
      <View style={{ width: 172, height: 212, borderRadius: 20, overflow: 'hidden' }}>
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(37,224,255,.10)' }}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#25E0FF', shadowColor: '#25E0FF', shadowOpacity: 0.4, shadowRadius: 6 },
            lineStyle,
          ]}
        />
      </View>
      <ProcCaption caption={caption} />
    </View>
  );
}

function SprayingPhoto({ uri, caption }: { uri: string; caption: string }) {
  const dots = [
    { top: '22%', left: '26%', color: '#25E4FF', size: 10 },
    { top: '38%', left: '74%', color: '#FF3DD0', size: 8 },
    { top: '60%', left: '18%', color: '#FF3DD0', size: 7 },
    { top: '70%', left: '80%', color: '#25E4FF', size: 9 },
    { top: '14%', left: '54%', color: '#7CF3FF', size: 6 },
  ] as const;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-end', width: 264, height: 240 }}>
      <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={{ uri }} style={{ maxWidth: '100%', maxHeight: 200 }} contentFit="contain" />
        {dots.map((d, i) => (
          <Animated.View
            key={i}
            entering={FadeIn.duration(500).delay(i * 40)}
            style={{ position: 'absolute', top: d.top, left: d.left, width: d.size, height: d.size, borderRadius: 999, backgroundColor: d.color }}
          />
        ))}
      </View>
      <ProcCaption caption={caption} />
    </View>
  );
}

function ProcCaption({ caption }: { caption: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: -2,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: 'rgba(31,30,29,.82)',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 7,
      }}
    >
      <Text className="text-geist" style={{ fontSize: 11, color: '#fff' }}>
        {caption}
      </Text>
    </View>
  );
}

export function PhotoHero() {
  const name = useWallStore(s => s.name);
  const setName = useWallStore(s => s.setName);
  const photo = useWallStore(s => s.photo);
  const rawPhoto = useWallStore(s => s.rawPhoto);
  const procStage = useWallStore(s => s.procStage);
  const photoJustCut = useWallStore(s => s.photoJustCut);
  const accent = useWallStore(s => s.accent);
  const openSheet = useWallStore(s => s.openSheet);
  const removePhoto = useWallStore(s => s.removePhoto);
  const interests = useWallStore(s => s.interests);
  const toggleInterest = useWallStore(s => s.toggleInterest);

  const acc = accentFor(accent);

  return (
    <View style={{ position: 'relative', minHeight: 330 }}>
      <StickerLayer />

      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="your name"
          textAlign="center"
          className="font-avantt-bold"
          style={{ fontSize: 40, color: '#1E1E1E', letterSpacing: -1, paddingHorizontal: 24, width: '100%' }}
        />
        <Sparkles size={16} color="#7BC8EE" strokeWidth={1.8} style={{ marginTop: 4 }} />
      </View>

      <View style={{ alignItems: 'center', marginTop: 22, position: 'relative' }}>
        <Image
          source={Scribbles.orangeStarburst}
          style={{ position: 'absolute', right: 30, top: -30, width: 100, height: 100, opacity: 0.9, transform: [{ rotate: '8deg' }] }}
          contentFit="contain"
        />
        <Image
          source={Scribbles.purpleSwoosh}
          style={{ position: 'absolute', left: 8, top: 90, width: 130, height: 130, opacity: 0.9, transform: [{ rotate: '-4deg' }] }}
          contentFit="contain"
        />

        {!photo && !procStage && (
          <View style={{ width: 118, height: 118, borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16 }}>
            <Image source={Moodies.happy} style={{ width: 76, height: 76 }} contentFit="contain" />
            <Pressable
              onPress={() => openSheet('photo')}
              style={{ position: 'absolute', right: -1, bottom: 4, width: 34, height: 34, borderRadius: 999, backgroundColor: '#FF5001', borderWidth: 2.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
            >
              <Camera size={15} color="#fff" strokeWidth={1.9} />
            </Pressable>
          </View>
        )}

        {procStage === 'removing' && rawPhoto && (
          <ScanningPhoto uri={rawPhoto} caption="removing the background…" />
        )}
        {procStage === 'spraying' && rawPhoto && (
          <SprayingPhoto uri={rawPhoto} caption="spraying it up…" />
        )}

        {photo && !procStage && (
          <View style={{ alignItems: 'center', justifyContent: 'flex-end', width: 264, height: 240 }}>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: '50%',
                top: '56%',
                width: 220,
                height: 220,
                marginLeft: -110,
                marginTop: -110,
                backgroundColor: `${acc.full}33`,
                borderRadius: 999,
              }}
            />
            <Image
              source={{ uri: photo }}
              style={{ width: 180, height: 180, borderRadius: 999, shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 14 }}
              contentFit="cover"
            />
            <Pressable
              onPress={removePhoto}
              style={{ position: 'absolute', right: 6, top: 4, width: 30, height: 30, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.94)', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={13} color="#58534B" strokeWidth={2.4} />
            </Pressable>
            {photoJustCut && (
              <Animated.Text
                entering={FadeIn}
                className="text-geist"
                style={{ position: 'absolute', bottom: -26, fontSize: 11, color: '#58534B', backgroundColor: 'rgba(255,255,255,.85)', borderRadius: 999, paddingHorizontal: 13, paddingVertical: 7, overflow: 'hidden' }}
              >
                background gone — sprayed up ✦
              </Animated.Text>
            )}
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 9, marginTop: 56 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 999, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, overflow: 'hidden' }}>
          <Pressable
            onPress={() => openSheet('stickers')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingLeft: 19, paddingRight: 16 }}
          >
            <Text style={{ fontSize: 15 }}>🎨</Text>
            <Text className="font-avantt-bold" style={{ fontSize: 14, color: '#1E1E1E' }}>
              stickers
            </Text>
          </Pressable>
          <View style={{ width: 1, backgroundColor: 'rgba(0,0,0,.1)', marginVertical: 9 }} />
          <Pressable
            onPress={() => openSheet('color')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingLeft: 16, paddingRight: 19 }}
          >
            <View style={{ width: 17, height: 17, borderRadius: 999, backgroundColor: acc.full, borderWidth: 2, borderColor: '#fff' }} />
            <Text className="font-avantt-bold" style={{ fontSize: 14, color: '#1E1E1E' }}>
              color
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7, marginTop: 18, paddingHorizontal: 24 }}>
        {interests.map(label => (
          <View
            key={label}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,.85)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 }}
          >
            <Text style={{ fontSize: 13, color: '#1E1E1E' }}>{label}</Text>
            <Pressable onPress={() => toggleInterest(label)} hitSlop={6}>
              <X size={10} color="#A0998D" strokeWidth={2.4} />
            </Pressable>
          </View>
        ))}
        <Pressable
          onPress={() => openSheet('interests')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#B4AEA3', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 }}
        >
          <Text style={{ fontSize: 12, color: '#58534B' }}>+</Text>
          <Text className="text-geist" style={{ fontSize: 12, color: '#58534B' }}>
            what you&apos;re into
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
