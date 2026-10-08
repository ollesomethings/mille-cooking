import { BASIC_FIELDS } from '@/data/wall-data';
import { useWallStore } from '@/stores/wall-store';
import { Plus, X } from 'lucide-react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

export function BasicsCard() {
  const basics = useWallStore(s => s.basics);
  const skipBasics = useWallStore(s => s.skipBasics);
  const openSheet = useWallStore(s => s.openSheet);
  const setBasic = useWallStore(s => s.setBasic);

  const filled = BASIC_FIELDS.concat([{ key: 'where', label: "WHERE I'M AT", options: [] }]).filter(f =>
    (basics[f.key] || '').trim(),
  );
  const hasBasics = filled.length > 0;

  return (
    <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: '#fff', borderRadius: 24, padding: 18, gap: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text className="text-geist" style={{ fontSize: 12, color: '#58534B', letterSpacing: 1 }}>
          THE BASICS
        </Text>
        <Text className="text-geist" style={{ fontSize: 10.5, color: '#CBC6BE' }}>
          {hasBasics ? 'OPTIONAL · TAP TO EDIT' : 'OPTIONAL · ANSWER ANY, OR NONE'}
        </Text>
        <Pressable
          onPress={skipBasics}
          hitSlop={6}
          style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: 999, backgroundColor: '#F4F3F1', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={9} color="#A0998D" strokeWidth={3} />
        </Pressable>
      </View>

      {!hasBasics ? (
        <Pressable
          onPress={() => openSheet('basics')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#DFDDD8', borderRadius: 14, padding: 14 }}
        >
          <View style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: '#F4F3F1', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={12} color="#58534B" strokeWidth={2.2} />
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#1E1E1E' }}>want to add anything?</Text>
            <Text className="text-geist" style={{ fontSize: 10.5, color: '#B4AEA3', marginTop: 2 }}>
              age, star sign, pronouns… pick any, or none
            </Text>
          </View>
        </Pressable>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {filled.map(f => (
            <Pressable
              key={f.key}
              onPress={() => openSheet('basics')}
              style={{ width: f.key === 'where' ? '100%' : '47%', backgroundColor: '#F8F5EE', borderWidth: 1, borderColor: '#F2F0EC', borderRadius: 12, padding: 12, gap: 4 }}
            >
              <Text className="text-geist" style={{ fontSize: 9.5, color: '#A0998D', letterSpacing: 0.6 }}>
                {f.label}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#1E1E1E' }}>{basics[f.key]}</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => openSheet('basics')}
            style={{ width: '47%', minHeight: 56, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#DFDDD8', borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 }}
          >
            <Plus size={11} color="#A0998D" strokeWidth={2.2} />
            <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D' }}>
              add more
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export function BasicsSheetContent() {
  const basics = useWallStore(s => s.basics);
  const setBasic = useWallStore(s => s.setBasic);

  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>
          The basics
        </Text>
        <Text className="text-geist" style={{ fontSize: 10, color: '#A0998D' }}>
          ANSWER ANY, OR NONE
        </Text>
      </View>
      <Text style={{ fontSize: 12.5, color: '#A0998D', lineHeight: 18, marginTop: -8 }}>
        tap to set — tap again to clear. only your mentor sees this.
      </Text>
      {BASIC_FIELDS.map(f => (
        <View key={f.key} style={{ gap: 8 }}>
          <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D', letterSpacing: 0.6 }}>
            {f.label}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
            {f.options.map(o => {
              const on = basics[f.key] === o;
              return (
                <Pressable
                  key={o}
                  onPress={() => setBasic(f.key, o)}
                  style={{
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    backgroundColor: on ? '#1E1E1E' : '#F4F3F1',
                    borderWidth: 1,
                    borderColor: on ? '#1E1E1E' : '#F2F0EC',
                  }}
                >
                  <Text style={{ fontSize: 13, color: on ? '#fff' : '#1E1E1E' }}>{o}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
      <View style={{ gap: 8 }}>
        <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D', letterSpacing: 0.6 }}>
          WHERE I&apos;M AT
        </Text>
        <TextInputWhere />
      </View>
    </View>
  );
}

function TextInputWhere() {
  const basics = useWallStore(s => s.basics);
  const setBasic = useWallStore(s => s.setBasic);
  return (
    <TextInput
      value={basics.where || ''}
      onChangeText={(v: string) => setBasic('where', v)}
      placeholder="city or town"
      style={{ borderWidth: 1, borderColor: '#F2F0EC', backgroundColor: '#F4F3F1', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 11, fontSize: 13.5, color: '#1E1E1E' }}
    />
  );
}
