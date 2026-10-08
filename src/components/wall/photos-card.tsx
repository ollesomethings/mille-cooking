import { hubPhotos } from '@/data/mock';
import { PHOTO_PROMPTS } from '@/data/wall-data';
import { useWallStore } from '@/stores/wall-store';
import { Image } from 'expo-image';
import { Check, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const ROLL = Object.values(hubPhotos);

export function PhotosCard() {
  const wallPhotos = useWallStore(s => s.wallPhotos);
  const photoPrompts = useWallStore(s => s.photoPrompts);
  const skipPhotos = useWallStore(s => s.skipPhotos);
  const openSheet = useWallStore(s => s.openSheet);

  return (
    <View style={{ marginTop: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, marginHorizontal: 20 }}>
        <Text className="font-caveat" style={{ fontSize: 27, color: '#1E1E1E' }}>a few things lately</Text>
        <Text className="text-geist" style={{ fontSize: 10.5, color: '#A0998D' }}>OPTIONAL</Text>
        <Pressable
          onPress={skipPhotos}
          hitSlop={6}
          style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: 999, backgroundColor: '#F4F3F1', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={9} color="#A0998D" strokeWidth={3} />
        </Pressable>
      </View>

      <View style={{ marginHorizontal: 16, marginTop: 10 }}>
        {wallPhotos.length === 0 ? (
          <>
            <Pressable
              onPress={() => openSheet('photos')}
              style={{ backgroundColor: 'rgba(255,255,255,.7)', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CBC6BE', borderRadius: 20, padding: 18, flexDirection: 'row', gap: 16, alignItems: 'center' }}
            >
              <View style={{ width: 78, height: 72 }}>
                <View style={{ position: 'absolute', left: 2, top: 6, width: 56, height: 62, backgroundColor: '#fff', borderRadius: 4, transform: [{ rotate: '-7deg' }], padding: 5, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6 }}>
                  <View style={{ width: '100%', height: 42, backgroundColor: '#E8E4DC', borderRadius: 2 }} />
                </View>
                <View style={{ position: 'absolute', left: 20, top: 2, width: 56, height: 62, backgroundColor: '#fff', borderRadius: 4, transform: [{ rotate: '4deg' }], padding: 5, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 6 }}>
                  <View style={{ width: '100%', height: 42, backgroundColor: '#E8E4DC', borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#A0998D', fontSize: 17 }}>+</Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>add a few photos</Text>
                <Text style={{ fontSize: 13.5, color: '#58534B', lineHeight: 19, marginTop: 4 }}>
                  drop up to three — after each photo we&apos;ll offer a little prompt to go with it, if you want
                </Text>
              </View>
            </Pressable>
          </>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            {wallPhotos.map((src, i) => (
              <View
                key={src}
                style={{ backgroundColor: '#fff', borderRadius: 6, padding: 9, paddingBottom: 10, transform: [{ rotate: `${i % 2 === 0 ? -4 : 3}deg` }], shadowColor: '#000', shadowOpacity: 0.13, shadowRadius: 10 }}
              >
                <Image source={{ uri: src }} style={{ width: 118, height: 118, borderRadius: 3 }} contentFit="cover" />
                <Text className="text-geist" style={{ fontSize: 9.5, color: '#A0998D', marginTop: 8 }}>
                  {photoPrompts[src] || ''}
                </Text>
              </View>
            ))}
            {wallPhotos.length < 3 && (
              <Pressable
                onPress={() => openSheet('photos')}
                style={{ width: 138, minHeight: 150, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CBC6BE', borderRadius: 6, backgroundColor: 'rgba(255,255,255,.6)', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D' }}>+ one more</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

export function PhotosSheetContent() {
  const wallPhotos = useWallStore(s => s.wallPhotos);
  const setWallPhotos = useWallStore(s => s.setWallPhotos);
  const setPhotoPrompt = useWallStore(s => s.setPhotoPrompt);
  const photoPrompts = useWallStore(s => s.photoPrompts);
  const [stage, setStage] = useState<'pick' | 'prompt'>(wallPhotos.length ? 'prompt' : 'pick');
  const [selected, setSelected] = useState<string[]>(wallPhotos);

  if (stage === 'prompt') {
    return (
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>Give them a prompt</Text>
          <Pressable onPress={() => setStage('pick')}>
            <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D', textDecorationLine: 'underline' }}>pick again</Text>
          </Pressable>
        </View>
        <Text style={{ fontSize: 12.5, color: '#A0998D', lineHeight: 18, marginBottom: 6 }}>
          optional — a line for your mentor to answer under each photo.
        </Text>
        <ScrollView style={{ maxHeight: 320 }}>
          {selected.map(src => (
            <View key={src} style={{ flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 4, padding: 6, paddingBottom: 14, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 6 }}>
                <Image source={{ uri: src }} style={{ width: 62, height: 62, borderRadius: 2 }} contentFit="cover" />
              </View>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {PHOTO_PROMPTS.map(p => {
                  const on = photoPrompts[src] === p;
                  return (
                    <Pressable
                      key={p}
                      onPress={() => setPhotoPrompt(src, p)}
                      style={{ borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: on ? '#1E1E1E' : '#F4F3F1', borderWidth: 1, borderColor: on ? '#1E1E1E' : '#F2F0EC' }}
                    >
                      <Text style={{ fontSize: 11.5, color: on ? '#fff' : '#58534B' }}>{p}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 16, color: '#0038FF' }}>Cancel</Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E1E1E' }}>Recents</Text>
        <Pressable
          disabled={selected.length === 0}
          onPress={() => {
            setWallPhotos(selected);
            setStage('prompt');
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: selected.length ? '#0038FF' : '#B5B0A6' }}>
            {selected.length ? `Add (${selected.length})` : 'Add'}
          </Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
        {ROLL.map(src => {
          const idx = selected.indexOf(src);
          const on = idx !== -1;
          return (
            <Pressable
              key={src}
              onPress={() =>
                setSelected(sel =>
                  sel.includes(src) ? sel.filter(x => x !== src) : sel.length < 3 ? sel.concat(src) : sel,
                )
              }
              style={{ width: '32.6%', aspectRatio: 1 }}
            >
              <Image source={{ uri: src }} style={{ width: '100%', height: '100%', opacity: on ? 0.72 : 1 }} contentFit="cover" />
              {on && (
                <View style={{ position: 'absolute', right: 5, bottom: 5, width: 20, height: 20, borderRadius: 999, backgroundColor: '#0038FF', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={11} color="#fff" strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
      <Text className="text-geist" style={{ fontSize: 10.5, color: '#A0998D', marginTop: 9 }}>
        {selected.length ? `${selected.length} of 3 selected` : 'pick up to three'}
      </Text>
    </View>
  );
}
