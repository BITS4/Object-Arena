import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../src/store/gameStore';
import { Colors } from '../../src/theme/colors';
import { getMockLeaderboard, WEIRD_FIGHTER_OF_DAY } from '../../src/game/progression';

type Tab = 'global' | 'friends' | 'daily';

export default function LeaderboardScreen() {
  const { player, fighters } = useGameStore();
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const entries = getMockLeaderboard();

  const TABS: { key: Tab; label: string; emoji: string }[] = [
    { key: 'global', label: 'Global', emoji: '🌍' },
    { key: 'friends', label: 'Friends', emoji: '👥' },
    { key: 'daily', label: 'Daily', emoji: '⚡' },
  ];

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top fighters across all arenas</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setActiveTab(t.key)}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
          >
            <Text style={styles.tabEmoji}>{t.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Weird Fighter of the Day */}
        <LinearGradient
          colors={[Colors.accent + '33', Colors.bgCard]}
          style={styles.weirdCard}
        >
          <Text style={styles.weirdLabel}>👾 WEIRDEST FIGHTER TODAY</Text>
          <View style={styles.weirdRow}>
            <Text style={styles.weirdEmoji}>{WEIRD_FIGHTER_OF_DAY.emoji}</Text>
            <View>
              <Text style={styles.weirdName}>{WEIRD_FIGHTER_OF_DAY.name}</Text>
              <Text style={styles.weirdRarity}>{WEIRD_FIGHTER_OF_DAY.rarity} {WEIRD_FIGHTER_OF_DAY.objectType}</Text>
              <Text style={styles.weirdQuote}>"{WEIRD_FIGHTER_OF_DAY.quote}"</Text>
              <Text style={styles.weirdBy}>by @{WEIRD_FIGHTER_OF_DAY.submittedBy}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Your Rank */}
        <View style={styles.yourRankCard}>
          <Text style={styles.yourRankLabel}>Your Standing</Text>
          <View style={styles.yourRankRow}>
            <Text style={styles.yourRankNum}>#247</Text>
            <View>
              <Text style={styles.yourRankName}>{player.username}</Text>
              <Text style={styles.yourRankSub}>
                {fighters.length} fighters · {player.totalWins} wins · Lv.{player.level}
              </Text>
            </View>
          </View>
        </View>

        {activeTab === 'global' && (
          <>
            {entries.map((e) => (
              <View key={e.rank} style={styles.entryRow}>
                <Text
                  style={[
                    styles.rankNum,
                    e.rank === 1 && { color: Colors.gold },
                    e.rank === 2 && { color: '#c0c0c0' },
                    e.rank === 3 && { color: '#cd7f32' },
                  ]}
                >
                  {e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : `#${e.rank}`}
                </Text>
                <View style={styles.entryMain}>
                  <Text style={styles.entryEmoji}>{e.emoji}</Text>
                  <View>
                    <Text style={styles.entryUsername}>{e.username}</Text>
                    <Text style={styles.entryFighter}>{e.fighterName}</Text>
                  </View>
                </View>
                <View style={styles.entryStats}>
                  <Text style={styles.entryWins}>{e.wins} W</Text>
                  <Text style={styles.entryLevel}>Lv.{e.level}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'friends' && (
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonEmoji}>👥</Text>
            <Text style={styles.comingSoonTitle}>Friend Leaderboard Coming Soon</Text>
            <Text style={styles.comingSoonSub}>
              Connect with friends and see who has the best collection.
              Share your profile link to invite them!
            </Text>
          </View>
        )}

        {activeTab === 'daily' && (
          <View style={styles.dailyLeaderboard}>
            <LinearGradient
              colors={[Colors.primary + '44', Colors.bgCard]}
              style={styles.dailyBanner}
            >
              <Text style={styles.dailyBannerTitle}>⚡ Today's Tournament</Text>
              <Text style={styles.dailyBannerTheme}>Kitchen Chaos</Text>
              <Text style={styles.dailyBannerSub}>Only kitchen fighters compete today</Text>
            </LinearGradient>
            {entries.slice(0, 5).map((e, i) => (
              <View key={e.rank} style={styles.entryRow}>
                <Text style={styles.rankNum}>{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</Text>
                <View style={styles.entryMain}>
                  <Text style={styles.entryEmoji}>{e.emoji}</Text>
                  <View>
                    <Text style={styles.entryUsername}>{e.username}</Text>
                    <Text style={styles.entryFighter}>{e.fighterName}</Text>
                  </View>
                </View>
                <View style={styles.entryStats}>
                  <Text style={styles.entryWins}>{Math.round(e.wins / 3)} W</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    borderColor: Colors.primaryLight,
    backgroundColor: `${Colors.primaryLight}22`,
  },
  tabEmoji: { fontSize: 14 },
  tabLabel: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  tabLabelActive: { color: Colors.primaryLight },
  scroll: { paddingHorizontal: 20, paddingBottom: 24, gap: 10 },
  weirdCard: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.accent + '44',
  },
  weirdLabel: { fontSize: 11, fontWeight: '800', color: Colors.accent, letterSpacing: 1.5 },
  weirdRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  weirdEmoji: { fontSize: 40 },
  weirdName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  weirdRarity: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  weirdQuote: { fontSize: 12, color: Colors.textSecondary, fontStyle: 'italic', marginTop: 4, lineHeight: 18 },
  weirdBy: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  yourRankCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight + '44',
    gap: 8,
  },
  yourRankLabel: { fontSize: 11, fontWeight: '800', color: Colors.primaryLight, letterSpacing: 1.5 },
  yourRankRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  yourRankNum: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary, width: 56 },
  yourRankName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  yourRankSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankNum: { fontSize: 18, fontWeight: '900', color: Colors.textMuted, width: 36, textAlign: 'center' },
  entryMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  entryEmoji: { fontSize: 28 },
  entryUsername: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  entryFighter: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  entryStats: { alignItems: 'flex-end', gap: 2 },
  entryWins: { fontSize: 14, fontWeight: '800', color: Colors.success },
  entryLevel: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
  comingSoonCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  comingSoonEmoji: { fontSize: 48 },
  comingSoonTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  comingSoonSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
  dailyLeaderboard: { gap: 10 },
  dailyBanner: {
    borderRadius: 16,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  dailyBannerTitle: { fontSize: 11, fontWeight: '800', color: Colors.primaryLight, letterSpacing: 1.5 },
  dailyBannerTheme: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  dailyBannerSub: { fontSize: 13, color: Colors.textMuted },
});
