import { mentor, teen } from '@/data/mock';
import { assetUri, Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

const WELCOME_BG = assetUri(require('@assets/illustrations/welcome-new.png'));

/** Bare screen art (no bezel) so the flight overlay can reuse it. */
export function WelcomeScreenArt() {
  return (
    <View className="flex-1">
      <Image source={WELCOME_BG} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      <View className="absolute inset-0 items-center justify-end pb-10 px-3">
        <Text
          className="font-avantt-bold text-white text-center"
          style={{ fontSize: 15, lineHeight: 19, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 6 }}
        >
          Whoever you are,{'\n'}you are enough.
        </Text>
      </View>
    </View>
  );
}

export function ChatScreenArt({ width }: { width: number }) {
  return (
    <View className="flex-1 bg-white px-3 pt-9">
      <View className="items-center mb-4">
        <Image
          source={{ uri: mentor.avatar }}
          style={{ width: 30, height: 30, borderRadius: 15 }}
        />
      </View>
      <View className="self-end items-end">
        <Image
          source={{ uri: 'https://picsum.photos/seed/moment-tease/200/240' }}
          style={{ width: width * 0.42, height: width * 0.5, borderRadius: 12 }}
        />
        <View className="mt-2 rounded-full bg-[#5E65FC] px-3 py-1.5">
          <Text className="text-white" style={{ fontSize: 10 }}>
            this is sooo me!!!
          </Text>
        </View>
        <Text className="text-tertiary mt-1" style={{ fontSize: 8 }}>
          9:51 PM
        </Text>
      </View>
      <View className="self-start mt-4 rounded-full bg-surfaces-z3 px-3 py-1.5">
        <Text className="text-primary" style={{ fontSize: 10 }}>
          Right!! Are you cat or dog person?
        </Text>
      </View>
      <Text className="text-tertiary mt-1" style={{ fontSize: 8 }}>
        7:10 AM
      </Text>
    </View>
  );
}

export function HubScreenArt({ height }: { height: number }) {
  return (
    <View className="flex-1 items-center justify-center px-3" style={{ backgroundColor: '#BDE3FF' }}>
      <View className="absolute top-9 left-0 right-0 flex-row items-center justify-center">
        <Image
          source={{ uri: teen.avatar }}
          style={{ width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#BDE3FF' }}
        />
        <Image
          source={{ uri: mentor.avatar }}
          style={{ width: 26, height: 26, borderRadius: 13, marginLeft: -8, borderWidth: 2, borderColor: '#BDE3FF' }}
        />
      </View>
      <Image
        source={Scribbles.purpleSwoosh}
        style={{ position: 'absolute', top: height * 0.22, left: 10, width: 54, height: 54, transform: [{ rotate: '-20deg' }] }}
        contentFit="contain"
      />
      <Text className="text-geist text-primary" style={{ fontSize: 8, letterSpacing: 1 }}>
        WELCOME TO SOMETHINGS
      </Text>
      <Text
        className="font-avantt-bold text-primary text-center mt-1"
        style={{ fontSize: 21, lineHeight: 24 }}
      >
        get to know{'\n'}{mentor.name.toLowerCase()}
      </Text>
    </View>
  );
}

export function PhoneFrame({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: 40,
        borderWidth: 7,
        borderColor: '#17171a',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 10,
      }}
    >
      {children}
      <View
        style={{
          position: 'absolute',
          top: 8,
          alignSelf: 'center',
          width: width * 0.32,
          height: 14,
          borderRadius: 8,
          backgroundColor: '#17171a',
        }}
      />
    </View>
  );
}
