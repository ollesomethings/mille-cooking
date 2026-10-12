import { ChatMessage, mentor } from '@/data/mock';
import { daysSinceIntake, teenIntakeDate } from '@/data/goals';
import { HubHintCard } from '@/components/hub-hint-card';
import { MentorOfflineBlock } from '@/components/mentor-offline-block';
import { scenario } from '@/data/scenario';
import { useScenarioStore } from '@/stores/scenario-store';
import { useAppStore } from '@/stores/app-store';
import { useGoalsStore } from '@/stores/goals-store';
import { useWallStore } from '@/stores/wall-store';
import { Moodies, Scribbles } from '@/lib/scribbles';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Camera,
  Image as ImageIcon,
  Mic,
  Plus,
  ArrowUp,
  X,
} from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

function TypingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.35);
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 280 }),
          withTiming(0.35, { duration: 280 }),
        ),
        -1,
      ),
    );
  }, [delay, opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        { height: 6, width: 6, borderRadius: 3, backgroundColor: '#A9A296' },
        style,
      ]}
    />
  );
}

function TypingIndicator() {
  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      className="self-start bg-surfaces-z3 rounded-full px-4 py-3 flex-row gap-1 items-center mt-1"
    >
      <TypingDot delay={0} />
      <TypingDot delay={140} />
      <TypingDot delay={280} />
    </Animated.View>
  );
}

function bubbleAlignment(messages: ChatMessage[], index: number): 'left' | 'right' {
  // Timestamp rows align under the message group they follow.
  for (let i = index - 1; i >= 0; i--) {
    if (messages[i].from === 'teen') return 'right';
    if (messages[i].from === 'mentor') return 'left';
  }
  return 'left';
}

function GoalNudgeCard() {
  const router = useRouter();
  const recommendedCount = useGoalsStore(
    s => s.goals.filter(g => g.status === 'recommended').length,
  );

  return (
    <View className="my-3 items-center">
      <View
        className="w-full items-center overflow-hidden rounded-3xl px-6 pb-6 pt-8"
        style={{ backgroundColor: '#171339' }}
      >
        <View className="h-14 w-14 items-center justify-center rounded-full bg-white">
          <Image source={Scribbles.limeSwoosh} style={{ width: 34, height: 34 }} contentFit="contain" />
        </View>
        <Text
          className="font-avantt-bold text-center text-white mt-3"
          style={{ fontSize: 24, lineHeight: 30 }}
        >
          Some goal ideas are ready
        </Text>
        <Text className="text-body-3 text-center mt-2" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 260 }}>
          {recommendedCount} idea{recommendedCount === 1 ? '' : 's'}, pulled from your
          check-ins. Keep, reword, or toss — each one is your call.
        </Text>
        <Pressable
          onPress={() => router.push('/corner/deck')}
          className="mt-4 rounded-full bg-white px-7 py-3 active:opacity-85"
        >
          <Text className="text-body-2 text-primary">Take a look</Text>
        </Pressable>
        <Text
          className="text-geist mt-3"
          style={{ fontSize: 9, letterSpacing: 1.2, color: 'rgba(255,255,255,0.55)' }}
        >
          NO RUSH · THEY&apos;LL WAIT
        </Text>
      </View>
    </View>
  );
}

function MessageRow({
  item,
  index,
  messages,
  onOpenSwap,
  onOpenPlaylist,
}: {
  item: ChatMessage;
  index: number;
  messages: ChatMessage[];
  onOpenSwap: () => void;
  onOpenPlaylist: () => void;
}) {
  if (item.kind === 'goal-nudge') {
    return <GoalNudgeCard />;
  }

  if (item.kind === 'wall-card' && item.wallCard) {
    const card = item.wallCard;
    return (
      <View className="mt-3 mb-1.5 self-end items-end" style={{ maxWidth: '78%' }}>
        <View
          style={{ width: 190, backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 }}
        >
          <View style={{ height: 74, backgroundColor: card.accentHl, alignItems: 'center', justifyContent: 'center' }}>
            {card.photo ? (
              <Image source={{ uri: card.photo }} style={{ width: 44, height: 44, borderRadius: 999 }} contentFit="cover" />
            ) : (
              <Image source={Moodies.happy} style={{ width: 44, height: 44 }} contentFit="contain" />
            )}
          </View>
          <View className="px-3 pt-2.5 pb-3">
            <Text className="font-avantt-bold text-primary" style={{ fontSize: 14 }}>
              my wall · v1
            </Text>
            <Text className="text-caption-1 text-tertiary mt-0.5" numberOfLines={2}>
              {card.tagSummary}
            </Text>
          </View>
        </View>
        <Text className="text-geist text-tertiary mt-1" style={{ fontSize: 10 }}>
          {card.footer}
        </Text>
      </View>
    );
  }

  if (item.kind === 'playlist-event' && item.entityId) {
    return (
      <View className="my-3 items-center">
        <Pressable
          onPress={onOpenPlaylist}
          className="flex-row items-center active:opacity-60"
          style={{ minHeight: 44 }}
          hitSlop={4}
        >
          <View className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-brand-lime/40">
            {/* tiny vinyl */}
            <View className="h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-trueBlack">
              <View className="h-1.5 w-1.5 rounded-full bg-brand-lime" />
            </View>
          </View>
          <Text className="text-body-3 text-secondary">
            {item.text.endsWith('a playlist') ? (
              <>
                {item.text.replace(' a playlist', '')} a{' '}
                <Text className="text-body-3 text-primary font-avantt">Playlist</Text>
              </>
            ) : (
              item.text
            )}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (item.kind === 'swap-event') {
    return (
      <View className="my-3 items-center">
        <Text className="text-caption-1 text-tertiary mb-3">Today</Text>
        <Pressable
          onPress={onOpenSwap}
          className="flex-row items-center active:opacity-60"
        >
          <View className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-brand-sky/30">
            <View className="h-3 w-2.5 rounded-[2px] border border-brand-periwinkle bg-white" />
          </View>
          {item.text.endsWith('a Swap') ? (
            <Text className="text-body-3 text-secondary">
              {item.text.replace(' a Swap', '')} a{' '}
              <Text className="text-body-3 text-primary font-avantt">Swap</Text>
            </Text>
          ) : (
            <Text className="text-body-3 text-secondary text-center px-8">
              {item.text}
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  if (item.from === 'system') {
    const align = bubbleAlignment(messages, index);
    return (
      <Text
        className={`text-caption-1 text-tertiary mt-1 mb-2 ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        {item.text}
      </Text>
    );
  }

  const isTeen = item.from === 'teen';
  return (
    <View
      className={`mb-1.5 max-w-[78%] rounded-[20px] px-4 py-2.5 ${
        isTeen
          ? 'self-end bg-[#5E65FC]'
          : 'self-start bg-surfaces-z3'
      }`}
    >
      <Text
        className={`text-body-2 ${isTeen ? 'text-white' : 'text-primary'}`}
      >
        {item.text}
      </Text>
    </View>
  );
}

function AttachMenu({
  onClose,
  onPickSwaps,
  onPickMoments,
}: {
  onClose: () => void;
  onPickSwaps: () => void;
  onPickMoments: () => void;
}) {
  const Item = ({
    icon,
    label,
    isNew,
    onPress,
  }: {
    icon: React.ReactNode;
    label: string;
    isNew?: boolean;
    onPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress ?? onClose}
      className="flex-row items-center px-4 py-3 active:bg-surfaces-z3"
    >
      <View className="w-9">{icon}</View>
      <Text className="text-body-2 text-primary">{label}</Text>
      {isNew && (
        <Text className="text-caption-2 text-[#FF5001] ml-2">New!</Text>
      )}
    </Pressable>
  );

  return (
    <Animated.View
      entering={FadeInDown.duration(180)}
      exiting={FadeOutDown.duration(150)}
      className="absolute bottom-20 left-4 w-60 rounded-2xl bg-white py-2"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
      }}
    >
      <Item icon={<Camera size={20} color="#1F1E1D" strokeWidth={1.8} />} label="Camera" />
      <Item icon={<ImageIcon size={20} color="#1F1E1D" strokeWidth={1.8} />} label="Photos" />
      <Item
        icon={
          <View className="h-5 w-7 items-center justify-center rounded border border-text-primary">
            <Text style={{ fontSize: 8, fontWeight: '700', color: '#1F1E1D' }}>GIF</Text>
          </View>
        }
        label="GIF"
      />
      <View className="mx-4 my-1.5 h-px bg-surfaces-divider" />
      <Item
        icon={<Text style={{ fontSize: 18 }}>🃏</Text>}
        label="Swaps"
        isNew
        onPress={onPickSwaps}
      />
      <Item
        icon={<Text style={{ fontSize: 18 }}>🖼️</Text>}
        label="Moments"
        isNew
        onPress={onPickMoments}
      />
    </Animated.View>
  );
}

export function ChatTab({ onOpenHub }: { onOpenHub: () => void }) {
  const router = useRouter();
  const messages = useAppStore(s => s.messages);
  const sendMessage = useAppStore(s => s.sendMessage);
  const swap = useAppStore(s => s.swap);
  const mentorTyping = useWallStore(s => s.mentorTyping);
  const mentorOffline = useScenarioStore(s => s.mentorOffline);
  const hubHint = useScenarioStore(s => s.hubHint);
  const recommendedCount = useGoalsStore(
    s => s.goals.filter(g => g.status === 'recommended').length,
  );

  const [draft, setDraft] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Playlist "say it in chat" jumps prefill the input — theirs to edit/send
  const chatDraft = useAppStore(s => s.chatDraft);
  useEffect(() => {
    if (chatDraft) {
      setDraft(chatDraft);
      useAppStore.getState().setChatDraft(null);
    }
  }, [chatDraft]);
  const listRef = useRef<FlatList>(null);
  // Snapshot of the ids present at mount — see renderItem.
  const initialIds = useRef(new Set(messages.map(m => m.id))).current;

  // The goal-setting entry point: an inline chat card, shown once the teen is
  // inside the day-14–30 window and there are still un-decided ideas waiting.
  const showGoalNudge =
    scenario.showGoalNudge &&
    recommendedCount > 0 &&
    daysSinceIntake(teenIntakeDate) >= 14;
  const displayMessages = useMemo(
    () =>
      showGoalNudge
        ? [...messages, { id: 'goal-nudge', from: 'system' as const, text: '', kind: 'goal-nudge' as const }]
        : messages,
    [messages, showGoalNudge],
  );

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    sendMessage(text);
    setDraft('');
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [draft, sendMessage]);

  const openSwap = useCallback(() => {
    if (swap) router.push(`/hub/swap/${swap.id}`);
  }, [router, swap]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={listRef}
        data={displayMessages}
        keyExtractor={m => m.id}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 120, paddingBottom: 16 }}
        renderItem={({ item, index }) => {
          const row = (
            // While the mentor is offline the history rests, slightly dimmed —
            // the offline footer below stays at full strength.
            <View style={mentorOffline ? { opacity: 0.55 } : undefined}>
              <MessageRow
                item={item}
                index={index}
                messages={displayMessages}
                onOpenSwap={openSwap}
                onOpenPlaylist={() =>
                  item.entityId && router.push(`/hub/playlist/${item.entityId}`)
                }
              />
            </View>
          );
          // Only messages that arrive after mount animate in — the seeded
          // history renders instantly.
          return initialIds.has(item.id) ? (
            row
          ) : (
            <Animated.View entering={FadeInDown.duration(220)}>
              {row}
            </Animated.View>
          );
        }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        ListFooterComponent={
          <>
            {mentorTyping ? <TypingIndicator /> : null}
            {mentorOffline ? <MentorOfflineBlock /> : null}
            {/* preset-link nudge; the offline block has its own pointer */}
            {hubHint && !mentorOffline ? <HubHintCard /> : null}
          </>
        }
        showsVerticalScrollIndicator={false}
      />

      {menuOpen && (
        <AttachMenu
          onClose={() => setMenuOpen(false)}
          onPickSwaps={() => {
            setMenuOpen(false);
            router.push('/hub/start-swap');
          }}
          onPickMoments={() => {
            setMenuOpen(false);
            onOpenHub();
          }}
        />
      )}

      <View className="flex-row items-center px-4 pb-safe-or-4 pt-2 bg-white">
        <Pressable
          onPress={() => setMenuOpen(o => !o)}
          className={`mr-3 h-11 w-11 items-center justify-center rounded-full ${
            menuOpen ? 'bg-brand-trueBlack' : 'bg-surfaces-z3'
          } active:opacity-70`}
        >
          {menuOpen ? (
            <X size={20} color="#FFFFFF" strokeWidth={2} />
          ) : (
            <Plus size={20} color="#1F1E1D" strokeWidth={2} />
          )}
        </Pressable>

        <View className="flex-1 flex-row items-center rounded-full border border-surfaces-z5 bg-white pl-4 pr-2 h-11">
          <TextInput
            className="flex-1 text-body-2 text-primary"
            placeholder="Send a message..."
            placeholderTextColor="#B8B2A9"
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            style={{ fontFamily: 'TWKLausanne-400' }}
          />
          {draft.trim().length > 0 ? (
            <Pressable
              onPress={handleSend}
              className="h-8 w-8 items-center justify-center rounded-full bg-[#485AF8] active:opacity-80"
            >
              <ArrowUp size={16} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>
          ) : (
            <Mic size={20} color="#1F1E1D" strokeWidth={1.8} />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
