import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import Button from '../src/components/Button';
import { Colors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '📸',
    title: 'Scan Anything',
    subtitle: 'Point your camera at any real-world object — shoe, snack, keyboard, mystery blob...',
    accent: Colors.primaryLight,
    bg: '#1a0840',
  },
  {
    emoji: '⚔️',
    title: 'Turn It Into a Fighter',
    subtitle: 'Our arena engine transforms your object into a unique battle character with stats, powers, and personality.',
    accent: Colors.accent,
    bg: '#2a0820',
  },
  {
    emoji: '🏆',
    title: 'Battle & Share',
    subtitle: 'Destroy opponents, collect legendary fighters, challenge friends, and go viral.',
    accent: Colors.gold,
    bg: '#1a1008',
  },
];

export default function OnboardingScreen() {
  const [slide, setSlide] = useState(0);
  const { completeOnboarding } = useGameStore();
  const scrollRef = useRef<ScrollView>(null);

  function goTo(index: number) {
    setSlide(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  }

  function handleNext() {
    if (slide < SLIDES.length - 1) {
      goTo(slide + 1);
    } else {
      handleStart();
    }
  }

  function handleStart() {
    completeOnboarding();
    router.replace('/(tabs)');
  }

  const current = SLIDES[slide];

  return (
    <LinearGradient colors={[current.bg, Colors.bgDeep, Colors.bgDeep]} style={styles.container}>
      {/* Skip */}
      <TouchableOpacity onPress={handleStart} style={styles.skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{s.emoji}</Text>
            <Text style={[styles.title, { color: s.accent }]}>{s.title}</Text>
            <Text style={styles.subtitle}>{s.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goTo(i)}>
            <View
              style={[
                styles.dot,
                i === slide && { backgroundColor: current.accent, width: 20 },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Button
          label={slide === SLIDES.length - 1 ? "Let's Go! ⚔️" : 'Next'}
          onPress={handleNext}
          variant="primary"
          size="lg"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 40 },
  skip: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  emoji: { fontSize: 100 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  cta: {
    paddingHorizontal: 32,
  },
});
