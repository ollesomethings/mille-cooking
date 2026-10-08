import { LoadingIndicator } from '@/components/proto/loading-indicator';
import {
  MENTOR_CARD_COLORS,
  mentorCandidates,
  type MentorCandidate,
} from '@/data/mentor-candidates';
import { EASE_STANDARD } from '@/lib/motion';
import { useScenarioStore } from '@/stores/scenario-store';
import { useHorizontalDragScroll } from '@/web/use-drag-scroll';
import { colors } from '@somethings-ui/core';
import { assetUri, Scribbles } from '@/lib/scribbles';
import { SelectorRows } from '@/components/proto/selector-rows';
import {
  Button,
  ContentBlock,
  Logo,
  SpotifyVinyl,
  TextInput,
} from '@somethings-ui/native';

const WELCOME_BG = assetUri(require('@assets/illustrations/welcome-new.png'));
// Brand spray-paint blob (alpha asset from the sales demo), tinted per use
const SPRAY = assetUri(require('@assets/illustrations/spray.png'));
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Condensed new-teen onboarding, mirroring mono/link-v2 (onboarding):
 * preferred-name → ideal-vibe → mentors-loading-v3 → we-found-match,
 * using the same OnboardingLayout structure, ProgressHeader, and
 * design-system components (ContentBlock / TextInput / SelectorRows /
 * Button). The full intake (birthday, pronouns, state…) is skipped;
 * add steps as scenarios need them.
 */

type Step =
  | 'welcome'
  | 'phone'
  | 'otp'
  | 'state'
  | 'name'
  | 'fullName'
  | 'birthday'
  | 'zip'
  | 'sex'
  | 'pronouns'
  | 'race'
  | 'expectations'
  | 'vibe'
  | 'loading'
  | 'match'
  | 'detail'
  | 'browse';

// Linear order up to the vibe pick; loading→match→detail/browse are driven
// by their own logic.
const ORDER: Step[] = [
  'welcome',
  'phone',
  'otp',
  'state',
  'name',
  'fullName',
  'birthday',
  'zip',
  'sex',
  'pronouns',
  'race',
  'expectations',
  'vibe',
];

// Steps that show the progress header, in counted order (vibe is the last)
const COUNTED: Step[] = [
  'state',
  'name',
  'fullName',
  'birthday',
  'zip',
  'sex',
  'pronouns',
  'race',
  'vibe',
];

const US_STATES = [
  { label: 'New York', value: 'New York' },
  { label: 'New Jersey', value: 'New Jersey' },
  { label: 'California', value: 'California' },
  { label: 'Texas', value: 'Texas' },
  { label: 'Florida', value: 'Florida' },
  { label: 'Massachusetts', value: 'Massachusetts' },
];

// From mono (onboarding)/expectation-setting.tsx SLIDES — tangelo runs kept
const TANGELO = '#FF5001';

// Brand standard easing — shared in src/lib/motion.ts

// Phone display format, from the sales demo's InputScreen: 555-123-4567
function formatPhone(digits: string) {
  const d = digits.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

const HERO_COLLAGE = assetUri(require('@assets/illustrations/female-collage.png'));
const MIN_LOADING_MS = 2500;
const TOTAL_STEPS = COUNTED.length;

// From mono ideal-vibe.tsx VIBE_ICONS / VIBE_OPTIONS
const VIBE_ICONS = {
  goofy: { source: Scribbles.orangeLoops, tint: '#FF5001' },
  chaotic: { source: Scribbles.yellowSpiralSmall, tint: '#FFE81F' },
  chill: { source: Scribbles.greenSwooshSmall, tint: '#5FA74B' },
  bubbly: { source: Scribbles.blueStarburstSmall, tint: '#71E0FF' },
  shy: { source: Scribbles.orangeCloudSmall, tint: '#FF9812' },
} as const;

const VibeIcon = ({ vibeKey }: { vibeKey: keyof typeof VIBE_ICONS }) => {
  const { source, tint } = VIBE_ICONS[vibeKey];
  return (
    <Image
      source={source}
      style={{ width: 40, height: 40, tintColor: tint }}
      contentFit="contain"
    />
  );
};

const VIBE_OPTIONS = [
  { label: 'Goofy', value: 'Goofy', icon: <VibeIcon vibeKey="goofy" /> },
  { label: 'Chaotic', value: 'Chaotic', icon: <VibeIcon vibeKey="chaotic" /> },
  { label: 'Chill', value: 'Chill', icon: <VibeIcon vibeKey="chill" /> },
  { label: 'Bubbly', value: 'Bubbly', icon: <VibeIcon vibeKey="bubbly" /> },
  { label: 'Shy', value: 'Shy', icon: <VibeIcon vibeKey="shy" /> },
];

// Mirror of mono mentor-detail-flow/mentor-browse.tsx MentorCard
function MentorCard({
  candidate,
  color,
  width,
  height,
  onPress,
}: {
  candidate: MentorCandidate;
  color: string;
  width: number;
  height: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width,
        height,
        backgroundColor: color,
        borderRadius: 24,
        overflow: 'hidden',
      }}
      className="shadow-md active:opacity-90"
    >
      <View className="items-center px-4 pt-9 z-10">
        <Text className="text-[36px] font-avantt-bold text-white text-center tracking-[-0.9px] leading-[1.1]">
          {candidate.firstName}
        </Text>
        <View className="mt-4 w-full bg-white/15 rounded-[20px] px-4 py-3">
          <Text
            className="text-base text-white leading-[1.4]"
            style={{ fontFamily: 'TWKLausanne-400' }}
            numberOfLines={5}
          >
            {candidate.bio}
          </Text>
        </View>
        <View className="mt-4 w-full z-10" style={{ gap: 10 }}>
          {candidate.interests.map(interest => (
            <View
              key={interest.label}
              className="flex-row items-center self-start border border-[#ece8e1] rounded-full"
              style={{ gap: 8, paddingHorizontal: 16, paddingVertical: 9 }}
            >
              <Image source={interest.icon} style={{ width: 24, height: 24 }} contentFit="contain" />
              <Text
                className="text-white leading-[1.4]"
                style={{ fontFamily: 'TWKLausanne-400', fontSize: 16 }}
              >
                {interest.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {/* Cutout-style photo over a sky spray halo, per the sales-demo cards */}
      <Image
        source={SPRAY}
        style={{ position: 'absolute', bottom: -30, right: -55, width: '95%', height: '62%' }}
        contentFit="contain"
        tintColor="#71e0ff"
      />
      <Image
        source={candidate.photo}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '62%',
          height: '48%',
          borderTopLeftRadius: 24,
        }}
        contentFit="cover"
      />
    </Pressable>
  );
}

// Static mock of the real detail screen's voice-note row — open row (no
// container), tangelo play circle + tangelo waveform + duration, per the
// sales-demo profile (05-page).
function AudioRow() {
  const bars = Array.from({ length: 42 }, (_, i) =>
    Math.round(6 + 18 * Math.abs(Math.sin(i * 1.7) * Math.sin(i * 0.53))),
  );
  return (
    <View className="flex-row items-center">
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 40, height: 40, backgroundColor: TANGELO }}
      >
        <View
          style={{
            marginLeft: 3,
            width: 0,
            height: 0,
            borderTopWidth: 7,
            borderBottomWidth: 7,
            borderLeftWidth: 11,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: '#FFFFFF',
          }}
        />
      </View>
      <View className="flex-1 flex-row items-center justify-between px-3" style={{ height: 32 }}>
        {bars.map((h, i) => (
          <View
            key={i}
            style={{ width: 2.5, height: h, borderRadius: 2, backgroundColor: TANGELO }}
          />
        ))}
      </View>
      <Text className="text-primary" style={{ fontFamily: 'TWKLausanne-400', fontSize: 15 }}>
        0:43
      </Text>
    </View>
  );
}

// Mirror of mono src/screens/onboarding/components/progress-header.tsx
function ProgressHeader({
  currentStep,
  onBack,
}: {
  currentStep: number;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  // Composited scaleX fill (never animate width), sales-demo load-bar recipe
  const p = useSharedValue(currentStep / TOTAL_STEPS);
  useEffect(() => {
    p.value = withTiming(currentStep / TOTAL_STEPS, {
      duration: 380,
      easing: EASE_STANDARD,
    });
  }, [currentStep, p]);
  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: p.value }],
  }));

  return (
    <View
      className="flex-row items-center bg-white px-4 pb-3"
      style={{ paddingTop: insets.top + 8 }}
    >
      <Pressable
        onPress={onBack}
        className="h-11 w-11 items-center justify-center active:opacity-60"
        hitSlop={8}
      >
        <ChevronLeft size={24} color="#1F1E1D" strokeWidth={1.8} />
      </Pressable>
      <View className="flex-1 px-1">
        <View className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-gray-900 rounded-full"
            style={[{ width: '100%', transformOrigin: 'left' }, fillStyle]}
          />
        </View>
      </View>
      <Text className="text-base text-primary ml-3 mr-2" style={{ fontFamily: 'TWKLausanne-400' }}>
        {currentStep}/{TOTAL_STEPS}
      </Text>
    </View>
  );
}

// Mirror of mono src/screens/onboarding/components/layout.tsx
function OnboardingLayout({
  title,
  subtitle,
  children,
  buttonText = 'Continue',
  buttonDisabled,
  onButtonPress,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  buttonText?: string;
  buttonDisabled?: boolean;
  onButtonPress: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View className="flex-1 px-6">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="mt-2">
            <ContentBlock header={title} body={subtitle} size="l" />
            <View className="mt-12 flex-1">{children}</View>
          </View>
        </ScrollView>
      </View>
      <View
        className="px-6 py-4 gap-4 bg-white"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          onPress={onButtonPress}
          disabled={buttonDisabled}
          fullWidth
          size="lg"
          shape="pill"
        >
          {buttonText}
        </Button>
      </View>
    </>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const chooseScenario = useScenarioStore(s => s.chooseScenario);
  const completeOnboarding = useScenarioStore(s => s.completeOnboarding);

  const [step, setStep] = useState<Step>('welcome');
  // Native-stack feel on web: forward steps enter from the right, backward
  // from the left (see the keyed wrapper below).
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [name, setName] = useState('');
  const [vibes, setVibes] = useState<string[]>([]);
  // Intake answers (prototype: collected, only the name is used downstream)
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [usState, setUsState] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [zip, setZip] = useState('');
  const [sexAtBirth, setSexAtBirth] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [expectPage, setExpectPage] = useState(0);
  const [race, setRace] = useState('');

  const expectRef = useRef<ScrollView>(null);
  useHorizontalDragScroll(
    expectRef,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => width, [width, step]),
  );

  const next = () => {
    const i = ORDER.indexOf(step);
    if (i >= 0 && i < ORDER.length - 1) {
      setDir('fwd');
      setStep(ORDER[i + 1]);
    }
  };
  const [detail, setDetail] = useState<{
    candidate: MentorCandidate;
    color: string;
    source: 'recommended' | 'browse';
  } | null>(null);
  const [browsePage, setBrowsePage] = useState(0);

  const browseRef = useRef<ScrollView>(null);
  const browseCardWidth = width - 48;
  useHorizontalDragScroll(
    browseRef,
    // re-attach once the conditionally-rendered carousel mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => browseCardWidth + 12, [browseCardWidth, step]),
  );

  useEffect(() => {
    if (step !== 'loading') return;
    const t = setTimeout(() => {
      setDir('fwd');
      setStep('match');
    }, MIN_LOADING_MS);
    return () => clearTimeout(t);
  }, [step]);

  const finish = (mentorId: string) => {
    chooseScenario('new');
    completeOnboarding(name, mentorId);
    // canGoBack is false when the page cold-started on /onboarding (phone
    // browsers restore tabs without history) — back() would silently no-op.
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const goBack = () => {
    const i = ORDER.indexOf(step);
    if (i > 0) {
      setDir('back');
      setStep(ORDER[i - 1]);
      return;
    }
    // Backing out of onboarding returns to the full-bleed launcher.
    useScenarioStore.setState({ mode: null });
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const openDetail = (
    candidate: MentorCandidate,
    color: string,
    source: 'recommended' | 'browse',
  ) => {
    setDetail({ candidate, color, source });
    setDir('fwd');
    setStep('detail');
  };

  const handleBrowseScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.min(
      mentorCandidates.length, // last page = choose-for-me card
      Math.max(0, Math.round(e.nativeEvent.contentOffset.x / (browseCardWidth + 12))),
    );
    if (p !== browsePage) setBrowsePage(p);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {COUNTED.includes(step) && (
        <ProgressHeader currentStep={COUNTED.indexOf(step) + 1} onBack={goBack} />
      )}

      <Animated.View
        key={step}
        entering={(dir === 'back' ? FadeInLeft : FadeInRight)
          .duration(280)
          .easing(EASE_STANDARD)}
        className="flex-1"
      >
      {step === 'welcome' && (
        <View className="flex-1">
          <Image source={WELCOME_BG} style={{ position: 'absolute', width: '100%', height: '100%' }} contentFit="cover" />
          <Animated.View
            entering={FadeIn.duration(500).delay(150)}
            className="items-center"
            style={{ paddingTop: insets.top + 20 }}
          >
            <Logo color="#fff" width={150} height={(150 / 161) * 21} viewBox="0 0 161 21" />
          </Animated.View>
          <View className="flex-1 justify-center items-center px-8">
            <Animated.Text
              entering={FadeInUp.duration(500).delay(250)}
              className="font-avantt-bold text-4xl text-center text-white"
            >
              Whoever you are,{'\n'}you are enough.
            </Animated.Text>
          </View>
          <Animated.View
            entering={FadeIn.duration(500).delay(400)}
            className="px-5 gap-4"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <Button onPress={next} size="lg" fullWidth shape="pill" className="bg-brand-tangelo">
              Get started
            </Button>
            <Pressable onPress={next} className="active:opacity-70">
              <Text className="text-base text-center font-avantt-bold text-white">
                Already have an account? <Text className="underline">Sign In</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      )}

      {step === 'phone' && (
        <View className="flex-1">
          <View className="items-center" style={{ paddingTop: insets.top + 16 }}>
            <Logo color="#1F1E1D" width={130} height={(130 / 161) * 21} viewBox="0 0 161 21" />
          </View>
          <View className="flex-1 px-5 mt-8">
            <Text className="text-4xl text-left font-avantt-bold text-primary mb-8">
              Enter your phone number
            </Text>
            <TextInput
              placeholderTextColor={colors.text.secondary}
              value={formatPhone(phone)}
              onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
              placeholder="555-555-5555"
              keyboardType="phone-pad"
              autoFocus
              onSubmitEditing={() => phone.length >= 10 && next()}
            />
          </View>
          <View className="px-5 py-4 gap-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <Button
              onPress={next}
              disabled={phone.length < 10}
              fullWidth
              size="lg"
              shape="pill"
            >
              Continue
            </Button>
          </View>
        </View>
      )}

      {step === 'otp' && (
        <View className="flex-1 px-7" style={{ paddingTop: insets.top + 40 }}>
          <Text className="text-4xl font-avantt-bold text-primary text-center">
            You&apos;ve got a text!
          </Text>
          <Text
            className="text-sm text-center leading-4 text-secondary mt-8"
            style={{ fontFamily: 'TWKLausanne-400' }}
          >
            Enter the code we sent to {phone || 'your phone'}
          </Text>
          <View className="items-center mt-8">
            <TextInput
              placeholderTextColor={colors.text.secondary}
              value={otp}
              onChangeText={t => {
                const code = t.replace(/\D/g, '').slice(0, 6);
                setOtp(code);
                if (code.length === 6)
                  setTimeout(() => {
                    setDir('fwd');
                    setStep('state');
                  }, 250);
              }}
              placeholder="••••••"
              keyboardType="number-pad"
              autoFocus
              className="w-48"
              inputClassName="text-center text-2xl tracking-[8px]"
            />
          </View>
          <View className="flex-1" />
          <View className="py-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <Button onPress={next} disabled={otp.length < 4} fullWidth size="lg" shape="pill">
              Continue
            </Button>
          </View>
        </View>
      )}

      {step === 'state' && (
        <OnboardingLayout
          title="What state do you live in?"
          subtitle="Somethings is only available in select US states"
          buttonDisabled={!usState}
          onButtonPress={next}
        >
          <SelectorRows
            options={US_STATES}
            value={usState}
            onChange={v => setUsState(v as string)}
          />
        </OnboardingLayout>
      )}

      {step === 'name' && (
        <OnboardingLayout
          title="What do you want your mentor to call you?"
          buttonDisabled={!name.trim()}
          onButtonPress={() => name.trim() && next()}
        >
          <View className="flex flex-col gap-6">
            <TextInput
              placeholderTextColor={colors.text.secondary}
              value={name}
              onChangeText={setName}
              placeholder="Preferred Name"
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => name.trim() && next()}
            />
          </View>
        </OnboardingLayout>
      )}

      {step === 'fullName' && (
        <OnboardingLayout
          title="What's your legal first and last name?"
          subtitle="We need your legal name to verify with your insurance that you can access Somethings for free."
          buttonDisabled={!firstName.trim() || !lastName.trim()}
          onButtonPress={next}
        >
          <View className="flex flex-col gap-6">
            <TextInput
              placeholderTextColor={colors.text.secondary}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
            />
            <TextInput
              placeholderTextColor={colors.text.secondary}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </OnboardingLayout>
      )}

      {step === 'birthday' && (
        <OnboardingLayout
          title="When's your birthday?"
          buttonDisabled={birthday.length < 10}
          onButtonPress={next}
        >
          <TextInput
            placeholderTextColor={colors.text.secondary}
            value={birthday}
            onChangeText={t => {
              const d = t.replace(/\D/g, '').slice(0, 8);
              let out = d;
              if (d.length > 4) out = `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
              else if (d.length > 2) out = `${d.slice(0, 2)}/${d.slice(2)}`;
              setBirthday(out);
            }}
            placeholder="MM/DD/YYYY"
            keyboardType="number-pad"
            autoFocus
          />
        </OnboardingLayout>
      )}

      {step === 'zip' && (
        <OnboardingLayout
          title="What's your zip code?"
          buttonDisabled={zip.length < 5}
          onButtonPress={next}
        >
          <TextInput
            placeholderTextColor={colors.text.secondary}
            value={zip}
            onChangeText={t => setZip(t.replace(/\D/g, '').slice(0, 5))}
            placeholder="Enter your zipcode"
            keyboardType="number-pad"
            autoFocus
          />
        </OnboardingLayout>
      )}

      {step === 'sex' && (
        <OnboardingLayout
          title="What was your sex at birth?"
          buttonDisabled={!sexAtBirth}
          onButtonPress={next}
        >
          <SelectorRows
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ]}
            value={sexAtBirth}
            onChange={v => setSexAtBirth(v as string)}
          />
        </OnboardingLayout>
      )}

      {step === 'pronouns' && (
        <OnboardingLayout
          title="What pronouns do you go by?"
          buttonDisabled={!pronouns}
          onButtonPress={next}
        >
          <SelectorRows
            options={[
              { label: 'She/Her', value: 'She/Her' },
              { label: 'He/Him', value: 'He/Him' },
              { label: 'They/Them', value: 'They/Them' },
              { label: 'Other', value: 'Other' },
            ]}
            value={pronouns}
            onChange={v => setPronouns(v as string)}
          />
        </OnboardingLayout>
      )}

      {step === 'race' && (
        <OnboardingLayout
          title="How do you identify racially/ethnically?"
          buttonDisabled={!race}
          onButtonPress={next}
        >
          <SelectorRows
            options={[
              'Native American or Alaska Native',
              'Black or African American',
              'White or Caucasian',
              'Asian',
              'Hispanic or Latino',
              'Native Hawaiian or Other Pacific Islander',
              'Other',
            ].map(label => ({ label, value: label }))}
            value={race}
            onChange={v => setRace(v as string)}
          />
        </OnboardingLayout>
      )}

      {step === 'expectations' && (
        <View className="flex-1 bg-white">
          <View className="absolute left-0 right-0 top-0 overflow-hidden" style={{ height: height * 0.4 }}>
            <Image
              source={Scribbles.blueLoops}
              contentFit="cover"
              style={{
                position: 'absolute',
                bottom: 0,
                width: width * 2.52,
                height: width * 2.52,
                left: -(width * 2.52 - width) / 2 + width * 0.15,
              }}
            />
          </View>
          <Pressable
            onPress={goBack}
            className="absolute left-2 z-10 h-11 w-11 items-center justify-center active:opacity-60"
            style={{ top: insets.top + 8 }}
            hitSlop={8}
          >
            <ChevronLeft size={24} color="#1F1E1D" strokeWidth={1.8} />
          </Pressable>

          <ScrollView
            ref={expectRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const p = Math.min(3, Math.max(0, Math.round(e.nativeEvent.contentOffset.x / width)));
              if (p !== expectPage) setExpectPage(p);
            }}
            scrollEventThrottle={16}
          >
            {/* Slide 1: ready */}
            <View style={{ width }} className="flex-1 justify-center items-center px-6">
              <Text className="text-[32px] font-avantt-bold text-primary text-center tracking-[-0.8px] leading-[36px]">
                Ready to find your mentor match?
              </Text>
              <Text
                className="text-sm leading-[20px] text-primary text-center mt-2"
                style={{ fontFamily: 'TWKLausanne-400' }}
              >
                We&apos;ll pick a mentor who matches the vibe{'\n'}you&apos;re looking for
              </Text>
              <Pressable
                onPress={() => {
                  (expectRef.current as unknown as { scrollTo?: (o: object) => void })?.scrollTo?.({ x: width, animated: true });
                }}
                className="mt-8 active:opacity-60"
                hitSlop={8}
              >
                <Text className="font-avantt-bold text-base text-black">Learn more first →</Text>
              </Pressable>
            </View>
            {/* Slide 2 */}
            <View style={{ width }} className="flex-1 justify-center px-6">
              <Text className="text-geist text-primary mb-2" style={{ fontSize: 16, letterSpacing: -0.32 }}>
                Who are they?
              </Text>
              <Text className="text-[28px] font-avantt-bold text-primary tracking-[-0.7px] leading-[33px]">
                Our mentors are all <Text style={{ color: TANGELO }}>in their 20s</Text> and
                they&apos;ve dealt with <Text style={{ color: TANGELO }}>similar struggles</Text>,
                so they actually get what you&apos;re going through.
              </Text>
            </View>
            {/* Slide 3 */}
            <View style={{ width }} className="flex-1 justify-center px-6">
              <Text className="text-geist text-primary mb-2" style={{ fontSize: 16, letterSpacing: -0.32 }}>
                What can I talk about?
              </Text>
              <Text className="text-[28px] font-avantt-bold text-primary tracking-[-0.7px] leading-[33px]">
                Anything you&apos;re struggling with, big or small.{' '}
                <Text style={{ color: TANGELO }}>Nothing&apos;s off the table</Text>, and you never
                have to feel bad for leaning on them.
              </Text>
            </View>
            {/* Slide 4 */}
            <View style={{ width }} className="flex-1 justify-center px-6">
              <Text className="text-geist text-primary mb-2" style={{ fontSize: 16, letterSpacing: -0.32 }}>
                How does it work?
              </Text>
              <Text className="text-[28px] font-avantt-bold text-primary tracking-[-0.7px] leading-[33px]">
                <Text style={{ color: TANGELO }}>Message them anytime</Text>, they&apos;re usually
                online afternoons and evenings Monday-Friday and reply during those hours.
              </Text>
            </View>
          </ScrollView>

          <View className="px-6 gap-6" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <View className="flex-row justify-center" style={{ opacity: expectPage === 0 ? 0 : 1, gap: 8 }}>
              {[1, 2, 3].map(i => (
                <View
                  key={i}
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: expectPage === i ? '#1F1E1D' : '#D8D3CA' }}
                />
              ))}
            </View>
            <Button onPress={next} fullWidth size="lg" shape="pill">
              Choose mentor vibe
            </Button>
          </View>
        </View>
      )}

      {step === 'vibe' && (
        <OnboardingLayout
          title="What's your ideal mentors vibe?"
          subtitle="Pick up to 5."
          buttonDisabled={vibes.length === 0}
          onButtonPress={() => {
            if (vibes.length === 0) return;
            setDir('fwd');
            setStep('loading');
          }}
        >
          <SelectorRows
            options={VIBE_OPTIONS}
            value={vibes}
            onChange={v => setVibes(v as string[])}
            multiple
            maxSelected={5}
          />
        </OnboardingLayout>
      )}

      {step === 'loading' && (
        <View className="flex-1 bg-white">
          <View className="flex-1 items-center justify-center px-5">
            <Animated.View
              entering={FadeIn.duration(800)}
              className="items-center mb-[60px]"
            >
              <View className="mb-8">
                <LoadingIndicator />
              </View>
            </Animated.View>
          </View>
        </View>
      )}

      {step === 'match' && (
        <View className="flex-1 bg-white">
          <View className="flex-1 items-center justify-center">
            <Animated.View entering={FadeIn.duration(800)} className="items-center">
              <Image
                source={HERO_COLLAGE}
                style={{ width: width * 0.85, height: width * 0.85 }}
                contentFit="contain"
              />
            </Animated.View>
            <Animated.View
              entering={FadeInUp.delay(300).duration(600)}
              className="items-center mt-6 px-10"
            >
              <Text className="text-[32px] font-avantt-bold leading-[34px] tracking-[-0.8px] text-center text-primary">
                We found your matches!
              </Text>
              <Text
                className="text-base text-[#3d3d3d] text-center mt-3 leading-[22px]"
                style={{ fontFamily: 'TWKLausanne-400' }}
              >
                We picked mentors who match the vibe you&apos;re looking for
              </Text>
            </Animated.View>
          </View>
          <View className="px-6" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <Button
              onPress={() => {
                setDir('fwd');
                setStep('browse');
              }}
              variant="primary"
              size="lg"
              fullWidth
              shape="pill"
            >
              See my mentors
            </Button>
          </View>
        </View>
      )}

      {step === 'detail' && detail && (
        <View className="flex-1 bg-white">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {/* Hero, mirroring mono mentor-details HeroCard */}
            <View
              className="overflow-hidden rounded-b-[24px]"
              style={{ backgroundColor: detail.color, minHeight: insets.top + 560 }}
            >
              <Pressable
                onPress={() => {
                  setDir('back');
                  setStep('browse');
                }}
                className="absolute z-20 h-11 w-11 items-center justify-center rounded-full active:opacity-60"
                style={{ top: insets.top + 12, left: 16 }}
                hitSlop={8}
              >
                <ChevronLeft size={26} color="#fff" strokeWidth={2} />
              </Pressable>

              <View className="items-center px-4 z-10" style={{ paddingTop: insets.top + 40 }}>
                <Text className="text-[36px] font-avantt-bold text-white text-center tracking-[-0.9px] leading-[1.1]">
                  {detail.candidate.firstName}
                </Text>
                <Text
                  className="text-primary mt-1"
                  style={{ fontFamily: 'TWKLausanne-400', fontSize: 14 }}
                >
                  🥇 {detail.candidate.credential}
                </Text>
                <View className="mt-3 w-full bg-white/15 rounded-[20px] px-4 py-3">
                  <Text
                    className="text-base text-white leading-[1.4]"
                    style={{ fontFamily: 'TWKLausanne-400' }}
                  >
                    {detail.candidate.bio}
                  </Text>
                </View>
                <View className="mt-4 w-full" style={{ gap: 10 }}>
                  {detail.candidate.interests.map(interest => (
                    <View
                      key={interest.label}
                      className="flex-row items-center self-start border border-[#ece8e1] rounded-full"
                      style={{ gap: 8, paddingHorizontal: 16, paddingVertical: 9 }}
                    >
                      <Image source={interest.icon} style={{ width: 24, height: 24 }} contentFit="contain" />
                      <Text
                        className="text-white leading-[1.4]"
                        style={{ fontFamily: 'TWKLausanne-400', fontSize: 16 }}
                      >
                        {interest.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <Image
                source={SPRAY}
                style={{ position: 'absolute', bottom: -40, right: -70, width: '100%', height: '58%' }}
                contentFit="contain"
                tintColor="#ffffff"
              />
              <Image
                source={detail.candidate.photo}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '64%',
                  height: '46%',
                  borderTopLeftRadius: 28,
                }}
                contentFit="cover"
              />
            </View>

            {/* Vinyl overlapping the hero edge, like the real screen */}
            <View className="relative bg-white">
              <Image
                source={Scribbles.blueScribble}
                style={{ position: 'absolute', right: -200, top: 180, width: 480, height: 480, opacity: 0.5 }}
                contentFit="contain"
              />
              <View style={{ marginTop: -100, marginLeft: 16, zIndex: 10, alignSelf: 'flex-start' }}>
                <SpotifyVinyl spotifyUrl={detail.candidate.spotifyUrl} size="lg" />
              </View>

              <Animated.View entering={FadeInUp.delay(200).duration(400)} className="px-5" style={{ marginTop: 28 }}>
                <Text
                  className="text-primary mb-3"
                  style={{ fontFamily: 'TWKLausanne-400', fontSize: 16 }}
                >
                  hear from {detail.candidate.firstName}
                </Text>
                <AudioRow />
              </Animated.View>

              {/* Horizontal photo strip, per the sales-demo profile */}
              <Animated.View entering={FadeInUp.delay(300).duration(400)} style={{ marginTop: 32 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
                >
                  {detail.candidate.gallery.map((photo, i) => (
                    <Image
                      key={photo}
                      source={{ uri: photo }}
                      style={{
                        width: 150,
                        height: [190, 160, 178][i % 3],
                        borderRadius: 16,
                        marginTop: [0, 16, 6][i % 3],
                      }}
                      contentFit="cover"
                    />
                  ))}
                </ScrollView>
              </Animated.View>

              {/* "my interests" stacked photo cards */}
              <Animated.View entering={FadeInUp.delay(380).duration(400)} className="px-5" style={{ marginTop: 40 }}>
                <Text
                  className="text-primary mb-4"
                  style={{ fontFamily: 'TWKLausanne-400', fontSize: 16 }}
                >
                  my interests
                </Text>
                <View style={{ height: 430 }}>
                  {detail.candidate.interestPhotos.slice(1, 3).map((photo, i) => (
                    <Image
                      key={photo}
                      source={{ uri: photo }}
                      style={{
                        position: 'absolute',
                        top: i === 0 ? 14 : 8,
                        left: i === 0 ? -8 : 10,
                        right: i === 0 ? 10 : -8,
                        height: 405,
                        borderRadius: 24,
                        transform: [{ rotate: i === 0 ? '-4deg' : '3deg' }],
                      }}
                      contentFit="cover"
                    />
                  ))}
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 410,
                      borderRadius: 24,
                      overflow: 'hidden',
                      shadowColor: '#000',
                      shadowOpacity: 0.18,
                      shadowRadius: 18,
                      shadowOffset: { width: 0, height: 8 },
                      elevation: 6,
                    }}
                  >
                    <Image
                      source={{ uri: detail.candidate.interestPhotos[0] }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                    <View
                      className="absolute flex-row items-center rounded-full"
                      style={{
                        top: 16,
                        left: 16,
                        gap: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 9,
                        backgroundColor: 'rgba(255,255,255,0.22)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.85)',
                      }}
                    >
                      <Image
                        source={detail.candidate.interests[0].icon}
                        style={{ width: 24, height: 24 }}
                        contentFit="contain"
                      />
                      <Text
                        className="text-white"
                        style={{
                          fontFamily: 'TWKLausanne-400',
                          fontSize: 16,
                          textShadowColor: 'rgba(0,0,0,0.4)',
                          textShadowRadius: 4,
                        }}
                      >
                        {detail.candidate.interests[0].label}
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>

            </View>
          </ScrollView>

          <View className="px-6 py-4 bg-white" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <Button
              onPress={() => finish(detail.candidate.id)}
              size="lg"
              fullWidth
              shape="pill"
            >
              {`say hi to ${detail.candidate.firstName.toLowerCase()}`}
            </Button>
          </View>
        </View>
      )}

      {step === 'browse' && (
        <View className="flex-1 bg-white">
          <View className="items-center px-4 pb-2" style={{ paddingTop: insets.top + 8 }}>
            <Text className="text-center text-[32px] font-avantt-bold text-primary tracking-[-0.8px] leading-[34px]">
              Your matches
            </Text>
            <Animated.Text
              entering={FadeInUp.duration(400)}
              className="text-base text-[#3d3d3d] text-center mt-2"
              style={{ fontFamily: 'TWKLausanne-400' }}
            >
              You can always rematch if you want
            </Animated.Text>
          </View>
          {/* Floating white back button, per the sales-demo M1 frame */}
          <Pressable
            onPress={() => {
              setDir('back');
              setStep('match');
            }}
            className="absolute z-10 items-center justify-center rounded-full bg-white active:opacity-70"
            style={{
              top: insets.top + 6,
              left: 12,
              width: 44,
              height: 44,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
            hitSlop={8}
          >
            <ChevronLeft size={24} color="#1F1E1D" strokeWidth={2} />
          </Pressable>

          <Animated.View entering={FadeIn.delay(200).duration(600)} className="flex-1">
            <ScrollView
              ref={browseRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={browseCardWidth + 12}
              snapToAlignment="start"
              decelerationRate="fast"
              onScroll={handleBrowseScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            >
              {mentorCandidates.map((candidate, i) => (
                <MentorCard
                  key={candidate.id}
                  candidate={candidate}
                  color={MENTOR_CARD_COLORS[i % MENTOR_CARD_COLORS.length]}
                  width={browseCardWidth}
                  height={height - 320}
                  onPress={() =>
                    openDetail(
                      candidate,
                      MENTOR_CARD_COLORS[i % MENTOR_CARD_COLORS.length],
                      'browse',
                    )
                  }
                />
              ))}
              {/* "Choose for me" end card, from mono mentor-browse ListFooter */}
              <View
                style={{ width: browseCardWidth, height: height - 320 }}
                className="bg-white border border-[#ece8e1] rounded-[24px] overflow-hidden shadow-md"
              >
                <Image
                  source={Scribbles.orangeCloud}
                  style={{
                    position: 'absolute',
                    top: -60,
                    left: -100,
                    width: 560,
                    height: height - 320,
                    transform: [{ rotate: '35deg' }],
                    opacity: 0.5,
                  }}
                  contentFit="cover"
                />
                <View className="flex-1 items-center justify-center px-8">
                  <Text className="text-[34px] font-avantt-bold text-primary text-center tracking-[-0.9px] leading-[1.1]">
                    Don&apos;t want to pick?
                  </Text>
                  <Text
                    className="text-lg text-[#3d3d3d] text-center mt-3 leading-[1.4]"
                    style={{ fontFamily: 'TWKLausanne-400' }}
                  >
                    We&apos;ll choose a mentor for you — you can switch anytime
                  </Text>
                </View>
                <View className="px-16 pb-8 items-center">
                  <Button size="md" onPress={() => finish(mentorCandidates[0].id)}>
                    Choose for me
                  </Button>
                </View>
              </View>
            </ScrollView>
          </Animated.View>

          <View className="flex-row items-center justify-center py-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            {[...mentorCandidates, null].map((c, i) => (
              <View
                key={c ? c.id : 'end'}
                className="mx-1 h-1.5 rounded-full"
                style={{
                  width: i === browsePage ? 16 : 6,
                  backgroundColor: i === browsePage ? '#1F1E1D' : '#D8D3CA',
                }}
              />
            ))}
          </View>
        </View>
      )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
