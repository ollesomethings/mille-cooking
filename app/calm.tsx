import { useScenarioStore } from '@/stores/scenario-store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

/**
 * Shareable tester entry: https://…/calm
 *
 * Opens the prototype with everything preset — existing-teen scenario,
 * calming (mental-health) tool set — landing in chat with a pointer card
 * nudging toward the Hub. No launcher, no toggles to explain. Reloading
 * mid-session returns to the launcher; reopening the link re-seeds.
 */
export default function CalmEntry() {
  const router = useRouter();

  useEffect(() => {
    const scenario = useScenarioStore.getState();
    scenario.setMentalHealthTools(true);
    scenario.chooseScenario('existing');
    // Land in chat (the app's home) with a pointer card nudging to the Hub
    scenario.setHubHint(true);
    router.replace('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View className="flex-1 bg-white" />;
}
