import { hubPhotos } from '@/data/mock';
import { ACCENTS, INTERESTS, STICKERS, STICKER_CATS } from '@/data/wall-data';
import { accentFor, useWallStore } from '@/stores/wall-store';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export function ColorSheetContent() {
  const accent = useWallStore(s => s.accent);
  const setAccent = useWallStore(s => s.setAccent);
  const acc = accentFor(accent);

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>Make it yours</Text>
        <Text className="text-geist" style={{ fontSize: 12, color: '#A0998D' }}>{acc.name}</Text>
      </View>
      <Text style={{ fontSize: 12.5, color: '#A0998D', lineHeight: 18, marginBottom: 10 }}>
        tints your whole wall — it&apos;s the first thing your mentor sees.
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {ACCENTS.map((a, i) => (
          <Pressable
            key={a.name}
            onPress={() => setAccent(i)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              backgroundColor: a.full,
              borderWidth: i === accent ? 2 : 0,
              borderColor: '#1E1E1E',
            }}
          />
        ))}
      </View>
    </View>
  );
}

export function StickerSheetContent() {
  const [cat, setCat] = useState<string | null>(null);
  const addSticker = useWallStore(s => s.addSticker);
  const placedTags = useWallStore(s => s.placedTags);

  const filtered = cat ? STICKERS.filter(s => s.cat === cat) : STICKERS;

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>Stickers</Text>
        <Text className="text-geist" style={{ fontSize: 12, color: '#A0998D' }}>{placedTags.length} on your wall</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 9, marginBottom: 9, flexWrap: 'wrap' }}>
        <Pressable
          onPress={() => setCat(null)}
          style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: cat === null ? '#1E1E1E' : '#F4F3F1' }}
        >
          <Text className="text-geist" style={{ fontSize: 10, color: cat === null ? '#fff' : '#58534B', letterSpacing: 0.6 }}>all</Text>
        </Pressable>
        {STICKER_CATS.map(c => (
          <Pressable
            key={c}
            onPress={() => setCat(c)}
            style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: cat === c ? '#1E1E1E' : '#F4F3F1' }}
          >
            <Text className="text-geist" style={{ fontSize: 10, color: cat === c ? '#fff' : '#58534B', letterSpacing: 0.6 }}>{c}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {filtered.map(s => (
          <Pressable
            key={s.name}
            onPress={() => addSticker(s.emoji)}
            style={{ width: '21%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#F4F3F1', borderWidth: 2, borderColor: '#F2F0EC', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 26 }}>{s.emoji}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function InterestsSheetContent() {
  const interests = useWallStore(s => s.interests);
  const toggleInterest = useWallStore(s => s.toggleInterest);
  const addCustomInterest = useWallStore(s => s.addCustomInterest);
  const [draft, setDraft] = useState('');

  const allOptions = INTERESTS.concat(interests.filter(x => !INTERESTS.includes(x)));

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>What you&apos;re into</Text>
        <Text className="text-geist" style={{ fontSize: 12, color: '#A0998D' }}>{interests.length} picked</Text>
      </View>
      <Text style={{ fontSize: 12.5, color: '#A0998D', lineHeight: 18, marginBottom: 10 }}>
        they sit under your name as little pills.
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
        {allOptions.map(label => {
          const on = interests.includes(label);
          return (
            <Pressable
              key={label}
              onPress={() => toggleInterest(label)}
              style={{ borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: on ? '#1E1E1E' : '#F4F3F1', borderWidth: 1, borderColor: on ? '#1E1E1E' : '#F2F0EC' }}
            >
              <Text style={{ fontSize: 12, color: on ? '#fff' : '#58534B' }}>{label}</Text>
            </Pressable>
          );
        })}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#B4AEA3', borderRadius: 999, paddingLeft: 13, paddingRight: 4, backgroundColor: '#fff' }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="your own thing"
            onSubmitEditing={() => {
              addCustomInterest(draft);
              setDraft('');
            }}
            style={{ fontSize: 12, color: '#1E1E1E', width: 104, paddingVertical: 6 }}
          />
          <Pressable
            onPress={() => {
              addCustomInterest(draft);
              setDraft('');
            }}
            style={{ width: 26, height: 26, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: draft.trim() ? '#1E1E1E' : '#F4F3F1' }}
          >
            <Plus size={11} color={draft.trim() ? '#fff' : '#A0998D'} strokeWidth={2.4} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const SINGLE_PHOTO_OPTIONS = [hubPhotos.teenOld, hubPhotos.park, null];

export function SinglePhotoSheetContent() {
  const photo = useWallStore(s => s.photo);
  const startPhotoProcessing = useWallStore(s => s.startPhotoProcessing);
  const removePhoto = useWallStore(s => s.removePhoto);

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>Add your photo</Text>
        <Text className="text-geist" style={{ fontSize: 10, color: '#A0998D' }}>OPTIONAL</Text>
      </View>
      <Text style={{ fontSize: 12.5, color: '#A0998D', lineHeight: 18, marginBottom: 10 }}>
        we cut out the background and spray around you. only your mentor sees it.
      </Text>
      <Pressable
        onPress={() => startPhotoProcessing(hubPhotos.mentorOld)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1E1E1E', borderRadius: 14, padding: 15, marginBottom: 9 }}
      >
        <Text style={{ fontSize: 16 }}>⬆️</Text>
        <Text className="font-avantt-bold" style={{ fontSize: 14, color: '#fff' }}>upload from camera roll</Text>
      </Pressable>
      <Text className="text-geist" style={{ fontSize: 10, color: '#A0998D', marginBottom: 7 }}>OR TRY ONE OF THESE</Text>
      <View style={{ flexDirection: 'row', gap: 9 }}>
        {SINGLE_PHOTO_OPTIONS.map((src, i) =>
          src ? (
            <Pressable
              key={i}
              onPress={() => startPhotoProcessing(src)}
              style={{ flex: 1, height: 64, borderRadius: 12, overflow: 'hidden', borderWidth: photo === src ? 2.5 : 1, borderColor: photo === src ? '#FF5001' : '#DFDDD8' }}
            >
              <Image source={{ uri: src }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </Pressable>
          ) : (
            <Pressable
              key={i}
              onPress={removePhoto}
              style={{ flex: 1, height: 64, borderRadius: 12, backgroundColor: '#F4F3F1', borderWidth: 2, borderStyle: 'dashed', borderColor: photo === null ? '#FF5001' : '#DFDDD8', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text className="text-geist" style={{ fontSize: 12, color: '#A0998D' }}>no photo</Text>
            </Pressable>
          ),
        )}
      </View>
    </View>
  );
}
