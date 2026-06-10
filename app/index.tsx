import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import { Colors } from '../src/theme/colors';

export default function SplashScreen() {
  const { player, isInitialized } = useGameStore();
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isInitialized) return;

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(tagOpacity, { toValue: 1, duration: 300, delay: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (!player.hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isInitialized]);

  return (
    <LinearGradient
      colors={[Colors.bgDeep, '#1a0840', Colors.bgDeep]}
      style={styles.container}
    >
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Text style={styles.logo}>⚔️</Text>
        <Text style={styles.title}>OBJECT</Text>
        <Text style={styles.titleAccent}>ARENA</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        Scan. Fight. Become Legend.
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 72,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 6,
    textAlign: 'center',
  },
  titleAccent: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.primaryLight,
    letterSpacing: 6,
    textAlign: 'center',
    marginTop: -8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 24,
    letterSpacing: 1,
  },
});
