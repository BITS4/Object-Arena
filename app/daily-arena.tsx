import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../src/components/Button';
import ScreenHeader from '../src/components/ScreenHeader';
import { Colors } from '../src/theme/colors';
import { DAILY_THEMES } from '../src/data/mockOpponents';

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const ms = midnight.getTime() - now.getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function DailyArenaScreen() {
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  const todayTheme = DAILY_THEMES[new Date().getDay() % DAILY_THEMES.length];

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <ScreenHeader title="Daily Arena" subtitle="New boss every day" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Today's Theme */}
        <LinearGradient
          colors={[Colors.primary + '55', Colors.bgCard]}
          style={styles.themeCard}
        >
          <Text style={styles.themeEmoji}>🏟️</Text>
          <Text style={styles.themeTodayLabel}>TODAY'S THEME</Text>
          <Text style={styles.themeTitle}>{todayTheme.label}</Text>
          <Text style={styles.themeDesc}>{todayTheme.description}</Text>
        </LinearGradient>

        {/* Countdown */}
        <View style={styles.countdownCard}>
          <Text style={styles.countdownLabel}>Resets In</Text>
          <Text style={styles.countdown}>{countdown}</Text>
          <Text style={styles.countdownSub}>New theme, new boss, new rewards daily</Text>
        </View>

        {/* Boss */}
        <LinearGradient
          colors={[Colors.danger + '33', Colors.bgCard]}
          style={styles.bossCard}
        >
          <View style={styles.bossHeader}>
            <Text style={styles.bossLabel}>👹 TODAY'S BOSS</Text>
          </View>
          <View style={styles.bossRow}>
            <Text style={styles.bossEmoji}>🍟</Text>
            <View style={styles.bossInfo}>
              <Text style={styles.bossName}>The Kitchen Overlord</Text>
              <Text style={styles.bossRarity}>ABSURD · Snack Lord</Text>
              <Text style={styles.bossStats}>
                HP: 500  |  PWR: 95  |  SPD: 85
              </Text>
            </View>
          </View>
          <Text style={styles.bossQuote}>
            "I have been in the back of the pantry since 2019. I have seen things."
          </Text>
        </LinearGradient>

        {/* Rewards */}
        <View style={styles.rewardsCard}>
          <Text style={styles.rewardsTitle}>🎁 Daily Rewards</Text>
          <View style={styles.rewardsGrid}>
            {[
              { label: 'Coins', value: '+200', emoji: '🪙' },
              { label: 'Gems', value: '+50', emoji: '💎' },
              { label: 'XP', value: '+500', emoji: '⚡' },
              { label: 'Exclusive\nTitle', value: 'Chef of\nDoom', emoji: '👨‍🍳' },
            ].map((r) => (
              <View key={r.label} style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>{r.emoji}</Text>
                <Text style={styles.rewardValue}>{r.value}</Text>
                <Text style={styles.rewardLabel}>{r.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rules */}
        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>📋 Rules</Text>
          {[
            'One attempt per day',
            'Any fighter can enter',
            'Rewards reset at midnight',
            'Beat the boss for full rewards',
            'Participation rewards even on loss',
          ].map((rule, i) => (
            <View key={rule} style={styles.ruleRow}>
              <Text style={styles.ruleDot}>•</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Button
          label="Enter Daily Arena ⚔️"
          onPress={() => router.push({
            pathname: '/battle',
            params: {
              fighterId: '',
              opponentId: 'opp_boss_daily',
              opponentType: 'daily-boss',
            },
          })}
          variant="primary"
          size="lg"
          emoji="🏟️"
        />

        {/* Past themes */}
        <View style={styles.pastCard}>
          <Text style={styles.pastTitle}>📅 Upcoming Themes</Text>
          {DAILY_THEMES.slice(0, 4).map((t) => (
            <View key={t.id} style={styles.pastRow}>
              <Text style={styles.pastEmoji}>{t.label.split(' ')[0]}</Text>
              <Text style={styles.pastTheme}>{t.label.split(' ').slice(1).join(' ')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },
  themeCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  themeEmoji: { fontSize: 56 },
  themeTodayLabel: { fontSize: 11, fontWeight: '800', color: Colors.primaryLight, letterSpacing: 2 },
  themeTitle: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary },
  themeDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  countdownCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countdownLabel: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1.5 },
  countdown: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.dangerLight,
    fontVariant: ['tabular-nums'],
  },
  countdownSub: { fontSize: 12, color: Colors.textMuted },
  bossCard: {
    borderRadius: 20,
    padding: 18,
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.danger + '44',
  },
  bossHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  bossLabel: { fontSize: 12, fontWeight: '800', color: Colors.danger, letterSpacing: 1.5 },
  bossRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bossEmoji: { fontSize: 56 },
  bossInfo: { flex: 1 },
  bossName: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  bossRarity: { fontSize: 12, color: Colors.dangerLight, fontWeight: '700', marginTop: 2 },
  bossStats: { fontSize: 12, color: Colors.textMuted, marginTop: 6 },
  bossQuote: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
  rewardsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rewardsTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  rewardsGrid: { flexDirection: 'row', gap: 8 },
  rewardItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 4,
  },
  rewardEmoji: { fontSize: 22 },
  rewardValue: { fontSize: 14, fontWeight: '900', color: Colors.gold, textAlign: 'center' },
  rewardLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', textAlign: 'center' },
  rulesCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rulesTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  ruleDot: { fontSize: 16, color: Colors.primaryLight, lineHeight: 20 },
  ruleText: { fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 20 },
  pastCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pastTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  pastRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pastEmoji: { fontSize: 20, width: 28 },
  pastTheme: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
});
