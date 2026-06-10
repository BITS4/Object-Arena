import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../src/store/gameStore';
import CurrencyDisplay from '../../src/components/CurrencyDisplay';
import FighterCard from '../../src/components/FighterCard';
import { Colors } from '../../src/theme/colors';
import { getPlayerTitle } from '../../src/game/progression';

const { width } = Dimensions.get('window');

const VIRAL_PROMPTS = [
  "What object will become legendary today?",
  "Your sock is one scan away from glory.",
  "The universe needs your stapler in the arena.",
  "Somewhere, a water bottle is waiting to fight.",
  "Scan something. Anything. The arena is hungry.",
  "Your mug has been training for this moment.",
];

const QUICK_ACTIONS = [
  { label: 'Battle', emoji: '⚔️', route: '/battle-setup' },
  { label: 'Collection', emoji: '📦', route: '/(tabs)/collection' },
  { label: 'Shop', emoji: '🛒', route: '/shop' },
  { label: 'Leaderboard', emoji: '🏆', route: '/(tabs)/leaderboard' },
];

export default function HomeScreen() {
  const { player, fighters } = useGameStore();
  const scanPulse = useRef(new Animated.Value(1)).current;
  const prompt = VIRAL_PROMPTS[Math.floor(Date.now() / 60000) % VIRAL_PROMPTS.length];
  const recentFighters = [...fighters].reverse().slice(0, 5);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanPulse, { toValue: 1.05, duration: 900, useNativeDriver: true }),
        Animated.timing(scanPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{player.username} {player.avatarEmoji}</Text>
            <Text style={styles.title}>{getPlayerTitle(player.level)} · Lv.{player.level}</Text>
          </View>
          <CurrencyDisplay />
        </View>

        {/* XP Bar */}
        <View style={styles.xpRow}>
          <View style={styles.xpTrack}>
            <View
              style={[
                styles.xpFill,
                { width: `${Math.round((player.xp / player.xpToNext) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.xpText}>{player.xp}/{player.xpToNext} XP</Text>
        </View>

        {/* Daily Challenge Card */}
        <TouchableOpacity onPress={() => router.push('/daily-arena')} activeOpacity={0.85}>
          <LinearGradient
            colors={['#4c1d95', '#7c3aed']}
            style={styles.dailyCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.dailyEmoji}>🏆</Text>
            <View style={styles.dailyInfo}>
              <Text style={styles.dailyLabel}>DAILY ARENA</Text>
              <Text style={styles.dailyTitle}>Kitchen Chaos</Text>
              <Text style={styles.dailyReward}>+200 coins  +50 gems</Text>
            </View>
            <Text style={styles.dailyArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Viral prompt */}
        <Text style={styles.viralPrompt}>"{prompt}"</Text>

        {/* SCAN BUTTON */}
        <Animated.View style={{ transform: [{ scale: scanPulse }] }}>
          <TouchableOpacity
            onPress={() => router.push('/scan')}
            activeOpacity={0.85}
            style={styles.scanWrap}
          >
            <LinearGradient
              colors={[Colors.accent, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scanBtn}
            >
              <Text style={styles.scanEmoji}>📸</Text>
              <Text style={styles.scanLabel}>SCAN OBJECT</Text>
              <Text style={styles.scanSub}>Turn anything into a fighter</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              onPress={() => router.push(a.route as any)}
              style={styles.quickBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.quickEmoji}>{a.emoji}</Text>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Fighters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Fighters</Text>
          {recentFighters.length === 0 ? (
            <View style={styles.emptyFighters}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyText}>No fighters yet.</Text>
              <Text style={styles.emptySubtext}>Scan your first object to get started!</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
              {recentFighters.map((f) => (
                <View key={f.id} style={styles.carouselItem}>
                  <FighterCard
                    fighter={f}
                    compact
                    onPress={() => router.push(`/fighter/${f.id}` as any)}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{fighters.length}</Text>
            <Text style={styles.statLbl}>Fighters</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{player.totalWins}</Text>
            <Text style={styles.statLbl}>Wins</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{player.totalBattles}</Text>
            <Text style={styles.statLbl}>Battles</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, gap: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  username: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  title: { fontSize: 12, color: Colors.primaryLight, fontWeight: '700', marginTop: 2 },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  xpTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.bgCard,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 3,
  },
  xpText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', width: 90 },
  dailyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  dailyEmoji: { fontSize: 36 },
  dailyInfo: { flex: 1 },
  dailyLabel: { fontSize: 10, color: '#c4b5fd', fontWeight: '800', letterSpacing: 1 },
  dailyTitle: { fontSize: 18, color: Colors.white, fontWeight: '800', marginTop: 2 },
  dailyReward: { fontSize: 12, color: Colors.goldLight, fontWeight: '600', marginTop: 4 },
  dailyArrow: { fontSize: 28, color: Colors.white, opacity: 0.6 },
  viralPrompt: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  scanWrap: { borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: Colors.accent, shadowOpacity: 0.4, shadowRadius: 20 },
  scanBtn: {
    paddingVertical: 28,
    alignItems: 'center',
    gap: 6,
  },
  scanEmoji: { fontSize: 52 },
  scanLabel: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 2,
  },
  scanSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickEmoji: { fontSize: 22 },
  quickLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700' },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  carousel: { marginHorizontal: -4 },
  carouselItem: { width: 150, marginHorizontal: 4 },
  emptyFighters: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    gap: 6,
  },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  emptySubtext: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNum: { fontSize: 22, fontWeight: '900', color: Colors.primaryLight },
  statLbl: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', marginTop: 2 },
});
