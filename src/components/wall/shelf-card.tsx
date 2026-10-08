import { MEDIA } from '@/data/wall-data';
import { ShelfPick, useWallStore } from '@/stores/wall-store';
import { BookOpen, Gamepad2, Plus, Search, Tv, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const CAT_ICON = { books: BookOpen, shows: Tv, games: Gamepad2 } as const;

function ShelfTile({ item, onPress }: { item: ShelfPick; onPress: () => void }) {
  const game = item.cat === 'games';
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: game ? 60 : 58,
        height: game ? 60 : 86,
        borderRadius: game ? 13 : 4,
        backgroundColor: item.color,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
      }}
    >
      <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
    </Pressable>
  );
}

export function ShelfCard() {
  const shelf = useWallStore(s => s.shelf);
  const skipShelf = useWallStore(s => s.skipShelf);
  const openSheet = useWallStore(s => s.openSheet);
  const toggleShelfItem = useWallStore(s => s.toggleShelfItem);

  const hasShelf = shelf.length > 0;

  return (
    <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: '#fff', borderRadius: 24, padding: 18, paddingBottom: 14, gap: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text className="text-geist" style={{ fontSize: 12, color: '#58534B', letterSpacing: 1 }}>ON THE SHELF</Text>
        <Text className="text-geist" style={{ fontSize: 10.5, color: '#CBC6BE' }}>OPTIONAL · SHARE ANY, OR NONE</Text>
        <Pressable
          onPress={skipShelf}
          hitSlop={6}
          style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: 999, backgroundColor: '#F4F3F1', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={9} color="#A0998D" strokeWidth={3} />
        </Pressable>
      </View>

      {!hasShelf ? (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 18 }}>
          {MEDIA.map((m, i) => {
            const Icon = CAT_ICON[m.key];
            return (
              <Pressable
                key={m.key}
                onPress={() => openSheet('shelf')}
                style={{
                  width: 88,
                  height: m.key === 'games' ? 96 : 128,
                  borderWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: '#CBC6BE',
                  borderRadius: 8,
                  backgroundColor: '#F8F5EE',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 9,
                  transform: [{ rotate: `${i === 0 ? -2 : i === 2 ? 3 : 0}deg` }],
                }}
              >
                <Icon size={20} color="#A0998D" strokeWidth={1.8} />
                <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D' }}>
                  {m.key === 'books' ? 'a book' : m.key === 'shows' ? 'a show' : 'a game'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          {MEDIA.filter(m => shelf.some(x => x.cat === m.key)).map(m => (
            <View key={m.key} style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: m.dot }} />
                <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D', letterSpacing: 0.6 }}>
                  {m.label.toUpperCase()}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
                {shelf
                  .filter(x => x.cat === m.key)
                  .map(item => (
                    <ShelfTile key={item.label} item={item} onPress={() => toggleShelfItem(item)} />
                  ))}
                <Pressable
                  onPress={() => openSheet('shelf')}
                  style={{ width: m.key === 'games' ? 60 : 58, height: m.key === 'games' ? 60 : 86, borderRadius: m.key === 'games' ? 13 : 4, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CBC6BE', backgroundColor: 'rgba(255,255,255,.6)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={15} color="#A0998D" strokeWidth={2} />
                </Pressable>
              </View>
              <View style={{ height: 9, borderRadius: 5, backgroundColor: '#D8D0C1' }} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function ShelfSheetContent() {
  const shelf = useWallStore(s => s.shelf);
  const toggleShelfItem = useWallStore(s => s.toggleShelfItem);
  const [cat, setCat] = useState<ShelfPick['cat']>('books');
  const [query, setQuery] = useState('');

  const media = MEDIA.find(m => m.key === cat)!;
  const results = query.trim()
    ? media.suggestions.filter(s => s.label.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>
          {cat === 'books' ? 'Add a book' : cat === 'shows' ? 'Add a movie or show' : 'Add a game'}
        </Text>
        <Text className="text-geist" style={{ fontSize: 10, color: '#A0998D' }}>OPTIONAL</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 7, marginTop: 4, marginBottom: 6 }}>
        {MEDIA.map(m => (
          <Pressable
            key={m.key}
            onPress={() => {
              setCat(m.key);
              setQuery('');
            }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: cat === m.key ? '#1E1E1E' : '#F4F3F1', borderWidth: 1, borderColor: cat === m.key ? '#1E1E1E' : '#F2F0EC' }}
          >
            <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: m.dot }} />
            <Text className="text-geist" style={{ fontSize: 11.5, color: cat === m.key ? '#fff' : '#58534B' }}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      {shelf.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 8 }}>
          {shelf.map(it => (
            <Pressable
              key={it.label}
              onPress={() => toggleShelfItem(it)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#1E1E1E', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Text style={{ fontSize: 12.5, color: '#fff' }}>{it.label}</Text>
              <X size={10} color="#fff" strokeWidth={3} />
            </Pressable>
          ))}
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F4F3F1', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}>
        <Search size={14} color="#A0998D" strokeWidth={2.2} />
        <TextInput value={query} onChangeText={setQuery} placeholder={media.placeholder} style={{ flex: 1, fontSize: 13, color: '#1E1E1E' }} />
      </View>

      {!query.trim() && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D', width: '100%' }}>try</Text>
          {media.suggestions.map(s => (
            <Pressable
              key={s.label}
              onPress={() => setQuery(s.label)}
              style={{ backgroundColor: '#F4F3F1', borderWidth: 1, borderColor: '#F2F0EC', borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 }}
            >
              <Text style={{ fontSize: 12.5, color: '#1E1E1E' }}>{s.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {query.trim() && results.length === 0 && (
        <Text style={{ textAlign: 'center', paddingVertical: 22, fontSize: 13.5, color: '#A0998D' }}>
          nothing found — try a different search
        </Text>
      )}

      {results.length > 0 && (
        <ScrollView style={{ maxHeight: 260, marginTop: 8 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {results.map(r => {
              const picked = shelf.some(x => x.cat === cat && x.label === r.label);
              return (
                <Pressable
                  key={r.label}
                  onPress={() => toggleShelfItem({ cat, label: r.label, color: r.color, emoji: r.emoji })}
                  style={{ width: '30%', gap: 6, padding: 6, borderRadius: 12, backgroundColor: picked ? '#1E1E1E' : '#F4F3F1', borderWidth: 1.5, borderColor: picked ? '#1E1E1E' : '#F2F0EC' }}
                >
                  <View style={{ width: '100%', aspectRatio: cat === 'games' ? 1 : 2 / 3, borderRadius: cat === 'games' ? 10 : 5, backgroundColor: r.color, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24 }}>{r.emoji}</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: picked ? '#fff' : '#1E1E1E' }} numberOfLines={2}>{r.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
