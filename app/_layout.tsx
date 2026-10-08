import '../global.css';
import '../src/lib/nativewind-interop';
import '../src/web/app-shell';

import { Disclaimer } from '@/components/proto/disclaimer';

import { Caveat_600SemiBold } from '@expo-google-fonts/caveat';
import { PortalProvider } from '@gorhom/portal';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { LogBox, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

// Set by src/web/app-shell.ts when the desktop phone frame is active —
// fakes iPhone insets so content clears the Dynamic Island / home indicator.
const frameInsets =
  typeof window !== 'undefined'
    ? (window as any).__PHONE_FRAME_INSETS__
    : undefined;

SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'TWKLausanne-400': require('@assets/fonts/TWKLausanne-400.ttf'),
    'TWKLausanne-400Italic': require('@assets/fonts/TWKLausanne-400Italic.ttf'),
    'Avantt-Bold': require('@assets/fonts/Avantt-Bold.ttf'),
    'Avantt-BoldItalic': require('@assets/fonts/Avantt-BoldItalic.ttf'),
    'GeistMono-Medium': require('@assets/fonts/GeistMono-Medium.ttf'),
    'CedarvilleCursive-Regular': require('@assets/fonts/CedarvilleCursive-Regular.ttf'),
    Caveat_600SemiBold,
  });

  if (!fontsLoaded) {
    return <View className="flex-1 bg-white" />;
  }

  SplashScreen.hideAsync();

  const app = (
    <PortalProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#FFFFFF' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="calm" options={{ animation: 'none' }} />
            <Stack.Screen
              name="onboarding"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="profile"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="schedule/index"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="schedule/confirm"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="hub/start-swap"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="hub/swap/[id]"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="hub/share-moment"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="hub/compose-moment"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="hub/create-note"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="hub/note-preview"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="hub/surprise-swap"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="hub/custom-swap"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="hub/story/[id]"
              options={{ presentation: 'fullScreenModal', animation: 'fade' }}
            />
            <Stack.Screen
              name="resources"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="selfcare/index"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="selfcare/breathe"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="selfcare/vent"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="selfcare/ground"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="selfcare/notalone"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="selfcare/paint"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="know/questions"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="know/songs"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="know/boards"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="know/story"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="selfcare/calmdeck"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="selfcare/star"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="selfcare/done"
              options={{ presentation: 'card', animation: 'fade' }}
            />
            <Stack.Screen
              name="hub/note/[id]"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="hub/moment/[id]"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="corner/deck"
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
          </Stack>
          <Disclaimer />
    </PortalProvider>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {frameInsets ? (
          <SafeAreaInsetsContext.Provider value={frameInsets}>
            {app}
          </SafeAreaInsetsContext.Provider>
        ) : (
          app
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
