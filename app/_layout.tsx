import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useGameStore } from '../src/store/gameStore';
import { Colors } from '../src/theme/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { initialize, isInitialized } = useGameStore();

  useEffect(() => {
    initialize().then(() => SplashScreen.hideAsync());
  }, []);

  if (!isInitialized) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bgDeep },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="reveal" />
        <Stack.Screen name="battle-setup" />
        <Stack.Screen name="battle" />
        <Stack.Screen name="battle-result" />
        <Stack.Screen name="fighter/[id]" />
        <Stack.Screen name="upgrade/[id]" />
        <Stack.Screen name="daily-arena" />
        <Stack.Screen name="shop" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}
