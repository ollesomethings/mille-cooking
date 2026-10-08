import { QA_PROMPTS } from '@/data/wall-data';
import { useWallStore } from '@/stores/wall-store';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { X } from 'lucide-react-native';

export function AnswersCard() {
  const answers = useWallStore(s => s.answers);
  const skipAnswers = useWallStore(s => s.skipAnswers);
  const openSheet = useWallStore(s => s.openSheet);
  const removeAnswer = useWallStore(s => s.removeAnswer);

  return (
    <View style={{ marginTop: 26 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, marginHorizontal: 20 }}>
        <Text className="font-caveat" style={{ fontSize: 27, color: '#1E1E1E' }}>in my words</Text>
        <Text className="text-geist" style={{ fontSize: 10.5, color: '#A0998D' }}>OPTIONAL</Text>
        <Pressable
          onPress={skipAnswers}
          hitSlop={6}
          style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: 999, backgroundColor: '#F4F3F1', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={9} color="#A0998D" strokeWidth={3} />
        </Pressable>
      </View>
      <View style={{ marginHorizontal: 16, marginTop: 10 }}>
        {answers.length === 0 ? (
          <Pressable
            onPress={() => openSheet('answers')}
            style={{ backgroundColor: 'rgba(255,255,255,.7)', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CBC6BE', borderRadius: 20, padding: 18, flexDirection: 'row', gap: 16, alignItems: 'center' }}
          >
            <View style={{ width: 74, height: 72, backgroundColor: '#fff', borderRadius: 6, transform: [{ rotate: '-4deg' }], padding: 9, gap: 6, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6 }}>
              <View style={{ height: 5, width: '80%', backgroundColor: '#E8E4DC', borderRadius: 99 }} />
              <View style={{ height: 5, width: '95%', backgroundColor: '#E8E4DC', borderRadius: 99 }} />
              <View style={{ height: 5, width: '60%', backgroundColor: '#E8E4DC', borderRadius: 99 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>answer a couple of prompts</Text>
              <Text style={{ fontSize: 13.5, color: '#58534B', lineHeight: 19, marginTop: 4 }}>
                little questions, short answers — they sit on your wall as notes
              </Text>
            </View>
          </Pressable>
        ) : (
          <View style={{ gap: 12 }}>
            {answers.map((n, i) => (
              <View
                key={n.q}
                style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, paddingRight: 40, transform: [{ rotate: `${i % 2 === 0 ? -0.8 : 0.9}deg` }], shadowColor: '#000', shadowOpacity: 0.09, shadowRadius: 12 }}
              >
                <Text className="text-geist" style={{ fontSize: 10, color: '#A0998D' }}>{n.q}</Text>
                <Text className="font-caveat" style={{ fontSize: 24, color: '#1E1E1E', marginTop: 4, lineHeight: 28 }}>{n.a}</Text>
                <Pressable
                  onPress={() => removeAnswer(n.q)}
                  style={{ position: 'absolute', right: 10, top: 10, width: 24, height: 24, borderRadius: 999, backgroundColor: '#F4F3F1', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={9} color="#A0998D" strokeWidth={3} />
                </Pressable>
              </View>
            ))}
            <Pressable
              onPress={() => openSheet('answers')}
              style={{ alignSelf: 'flex-start', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CBC6BE', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 }}
            >
              <Text className="text-geist" style={{ fontSize: 12, color: '#A0998D' }}>+ another prompt</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

export function AnswersSheetContent() {
  const answers = useWallStore(s => s.answers);
  const saveAnswer = useWallStore(s => s.saveAnswer);
  const [draftQ, setDraftQ] = useState<string | null>(null);
  const [draftText, setDraftText] = useState('');

  if (draftQ) {
    return (
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>In my words</Text>
          <Text className="text-geist" style={{ fontSize: 10, color: '#A0998D' }}>OPTIONAL</Text>
        </View>
        <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D', marginBottom: 8 }}>{draftQ}</Text>
        <TextInput
          value={draftText}
          onChangeText={setDraftText}
          placeholder="type your answer…"
          multiline
          numberOfLines={3}
          className="font-caveat"
          style={{ backgroundColor: '#F4F3F1', borderWidth: 1, borderColor: '#F2F0EC', borderRadius: 14, padding: 14, fontSize: 22, color: '#1E1E1E', minHeight: 80, textAlignVertical: 'top' }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}>
          <Pressable onPress={() => setDraftQ(null)}>
            <Text className="text-geist" style={{ fontSize: 11, color: '#A0998D', textDecorationLine: 'underline' }}>pick a different one</Text>
          </Pressable>
          <Pressable
            disabled={!draftText.trim()}
            onPress={() => {
              saveAnswer(draftQ, draftText.trim());
              setDraftQ(null);
              setDraftText('');
            }}
            style={{ marginLeft: 'auto', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11, backgroundColor: draftText.trim() ? '#1E1E1E' : '#F4F3F1' }}
          >
            <Text className="font-avantt-bold" style={{ fontSize: 13.5, color: draftText.trim() ? '#fff' : '#B5B0A6' }}>pin it to my wall</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text className="font-avantt-bold" style={{ fontSize: 19, color: '#1E1E1E' }}>Pick a prompt</Text>
        <Text className="text-geist" style={{ fontSize: 10, color: '#A0998D' }}>OPTIONAL</Text>
      </View>
      <Text style={{ fontSize: 12.5, color: '#A0998D', lineHeight: 18, marginBottom: 6 }}>pick one to answer — short is fine.</Text>
      <ScrollView style={{ maxHeight: 280 }}>
        {QA_PROMPTS.map(q => {
          const answered = answers.some(x => x.q === q);
          return (
            <Pressable
              key={q}
              onPress={() => {
                setDraftQ(q);
                setDraftText(answers.find(x => x.q === q)?.a || '');
              }}
              style={{ borderRadius: 14, padding: 12, marginBottom: 7, backgroundColor: answered ? '#EEECE7' : '#F4F3F1', borderWidth: 1, borderColor: answered ? '#E4E1DA' : '#F2F0EC' }}
            >
              <Text style={{ fontSize: 13.5, color: answered ? '#A0998D' : '#1E1E1E', lineHeight: 18 }}>
                {answered ? `${q}  ·  answered` : q}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
