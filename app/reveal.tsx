import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
  Share,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import Button from '../src/components/Button';
import RarityBadge from '../src/components/RarityBadge';
import StatBar from '../src/components/StatBar';
import { Colors } from '../src/theme/colors';
import { OBJECT_TYPES } from '../src/data/objectTypes';
import { generateFighter } from '../src/game/fighterGenerator';
import { generateFighterShareCaption } from '../src/utils/shareText';

export default function RevealScreen() {
  const { pendingFighter, addFighter, setPendingFighter } = useGameStore();
  const cardScale = useRef(new Animated.Value(0.5)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const shimmerPos = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    if (!pendingFighter) return;

    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(glowOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerPos, { toValue: 400, duration: 2000, useNativeDriver: true }),
          Animated.timing(shimmerPos, { toValue: -200, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    });
  }, [pendingFighter]);

  if (!pendingFighter) {
    return (
      <LinearGradient colors={[Colors.bgDeep, Colors.bgDeep]} style={styles.center}>
        <Text style={styles.errorText}>No fighter found. Scan an object first!</Text>
        <Button label="Go Scan" onPress={() => router.replace('/scan')} variant="primary" />
      </LinearGradient>
    );
  }

  const f = pendingFighter;
  const typeData = OBJECT_TYPES[f.objectType];
  const accentColor = f.colorTheme;

  function handleSave() {
    addFighter(f);
    setPendingFighter(null);
    router.replace('/(tabs)/collection');
  }

  function handleBattle() {
    addFighter(f);
    router.replace('/battle-setup');
  }

  function handleRegenerate() {
    Alert.alert(
      'Regenerate Fighter',
      'This will create a new fighter from the same object. The current one will be lost.',
      [
        {
          text: 'Regenerate',
          onPress: () => {
            const newFighter = generateFighter({
              imageUri: f.imageUri,
              detectedObjectType: f.objectType,
            });
            setPendingFighter(newFighter);
          },
        },
        { text: 'Keep This One', style: 'cancel' },
      ]
    );
  }

  async function handleShare() {
    const caption = generateFighterShareCaption(f);
    await Share.share({ message: caption });
  }

  const rarityColor = Colors.rarity[f.rarity];

  return (
    <LinearGradient colors={[Colors.bgDeep, '#120920', Colors.bgDeep]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.topLabel}>✨ FIGHTER REVEALED</Text>
        </View>

        {/* MAIN CARD */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: cardScale }],
              opacity: cardOpacity,
              borderColor: `${rarityColor}88`,
              shadowColor: accentColor,
            },
          ]}
        >
          <LinearGradient
            colors={[`${accentColor}44`, Colors.bgCard, `${rarityColor}22`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            {/* Shimmer */}
            <Animated.View
              style={[styles.shimmer, { transform: [{ translateX: shimmerPos }] }]}
            />

            {/* Fighter image/emoji */}
            <Animated.View style={[styles.glowWrap, { opacity: glowOpacity }]}>
              <View style={[styles.imageContainer, { backgroundColor: `${accentColor}22` }]}>
                {f.imageUri ? (
                  <Image source={{ uri: f.imageUri }} style={styles.fighterImage} />
                ) : (
                  <Text style={styles.fighterEmoji}>{typeData?.emoji ?? '❓'}</Text>
                )}
              </View>
            </Animated.View>

            {/* Rarity badge */}
            <View style={styles.rarityRow}>
              <RarityBadge rarity={f.rarity} size="lg" />
            </View>

            {/* Name */}
            <Text style={[styles.fighterName, { color: rarityColor }]}>{f.name}</Text>
            <Text style={styles.fighterClass}>⚔️ {f.class}</Text>

            {/* Quote */}
            <View style={styles.quoteBox}>
              <Text style={styles.quote}>"{f.funnyQuote}"</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Combat Stats</Text>
          <StatBar label="Power" value={f.stats.power} color={Colors.danger} />
          <StatBar label="Defense" value={f.stats.defense} color={Colors.gem} />
          <StatBar label="Speed" value={f.stats.speed} color={Colors.success} />
          <StatBar label="Chaos" value={f.stats.chaos} color={Colors.accent} />
          <StatBar label="Luck" value={f.stats.luck} color={Colors.gold} />
        </View>

        {/* Special Move */}
        <LinearGradient
          colors={[`${accentColor}33`, Colors.bgCard]}
          style={styles.specialCard}
        >
          <Text style={styles.specialLabel}>⚡ SPECIAL MOVE</Text>
          <Text style={styles.specialName}>{f.specialMove}</Text>
          <Text style={styles.specialDesc}>{f.specialMoveDescription}</Text>
        </LinearGradient>

        {/* Personality */}
        <View style={styles.personalityCard}>
          <Text style={styles.personalityLabel}>🧠 PERSONALITY</Text>
          <Text style={styles.personalityText}>{f.personality}</Text>
        </View>

        {/* HP */}
        <View style={styles.hpCard}>
          <Text style={styles.hpLabel}>❤️ Starting HP</Text>
          <Text style={styles.hpValue}>{f.maxHp}</Text>
        </View>

        {/* Actions */}
        <Button label="Save Fighter" onPress={handleSave} emoji="💾" size="lg" variant="primary" />
        <Button label="Battle Now!" onPress={handleBattle} emoji="⚔️" size="lg" variant="secondary" />
        <View style={styles.secondaryRow}>
          <View style={{ flex: 1 }}>
            <Button label="Regenerate" onPress={handleRegenerate} variant="ghost" size="sm" emoji="🔄" />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Share" onPress={handleShare} variant="ghost" size="sm" emoji="📤" />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  scroll: { paddingTop: 56, paddingBottom: 32, paddingHorizontal: 20, gap: 14 },
  titleRow: { alignItems: 'center' },
  topLabel: { fontSize: 14, fontWeight: '800', color: Colors.gold, letterSpacing: 2 },
  card: {
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
    elevation: 12,
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  cardGradient: { padding: 20, gap: 12, alignItems: 'center', overflow: 'hidden' },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.07)',
    transform: [{ skewX: '-20deg' }],
  },
  glowWrap: { alignItems: 'center' },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  fighterImage: { width: 140, height: 140, borderRadius: 70, resizeMode: 'cover' },
  fighterEmoji: { fontSize: 72 },
  rarityRow: { marginTop: 4 },
  fighterName: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  fighterClass: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '700',
    textAlign: 'center',
  },
  quoteBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    width: '100%',
  },
  quote: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsTitle: { fontSize: 14, fontWeight: '800', color: Colors.textMuted, marginBottom: 8, letterSpacing: 1 },
  specialCard: {
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specialLabel: { fontSize: 11, fontWeight: '800', color: Colors.primaryLight, letterSpacing: 1.5 },
  specialName: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  specialDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  personalityCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  personalityLabel: { fontSize: 11, fontWeight: '800', color: Colors.textMuted },
  personalityText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  hpCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hpLabel: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  hpValue: { fontSize: 22, fontWeight: '900', color: Colors.dangerLight },
  secondaryRow: { flexDirection: 'row', gap: 12 },
  errorText: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
});
