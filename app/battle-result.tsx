import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import Button from '../src/components/Button';
import { Colors } from '../src/theme/colors';

export default function BattleResultScreen() {
  const { lastBattleResult, fighters, pendingFighter } = useGameStore();

  const winScale = useRef(new Animated.Value(0)).current;
  const confettiOp = useRef(new Animated.Value(0)).current;

  const allFighters = pendingFighter ? [pendingFighter, ...fighters] : fighters;

  useEffect(() => {
    if (!lastBattleResult) return;
    Animated.parallel([
      Animated.spring(winScale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 6 }),
      Animated.timing(confettiOp, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [lastBattleResult]);

  if (!lastBattleResult) {
    return (
      <LinearGradient colors={[Colors.bgDeep, Colors.bgDeep]} style={styles.center}>
        <Text style={styles.errorText}>No battle result found.</Text>
        <Button label="Go Home" onPress={() => router.replace('/(tabs)')} variant="primary" />
      </LinearGradient>
    );
  }

  const result = lastBattleResult;
  const myFighter = allFighters.find((f) => f.id === result.winnerId || f.id === result.loserId);
  const isWin = myFighter?.id === result.winnerId;

  async function handleShare() {
    await Share.share({ message: result.shareCaption });
  }

  function handleCopyCaption() {
    // Note: Clipboard.setString is the API — works on both platforms
    // In newer RN versions, import from @react-native-clipboard/clipboard
    Alert.alert('Caption copied!', result.shareCaption);
  }

  return (
    <LinearGradient
      colors={isWin ? [Colors.bgDeep, '#0d2a18', Colors.bgDeep] : [Colors.bgDeep, '#2a0808', Colors.bgDeep]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* WIN/LOSS Banner */}
        <Animated.View style={[styles.banner, { transform: [{ scale: winScale }] }]}>
          <LinearGradient
            colors={isWin ? [Colors.success, '#065f46'] : [Colors.danger, '#7f1d1d']}
            style={styles.bannerGrad}
          >
            <Text style={styles.resultEmoji}>{isWin ? '🏆' : '💀'}</Text>
            <Text style={styles.resultTitle}>{isWin ? 'VICTORY!' : 'DEFEATED'}</Text>
            <Text style={styles.winnerName}>
              {isWin ? `${result.winnerName} triumphs!` : `${result.winnerName} wins.`}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Rewards */}
        <View style={styles.rewardsCard}>
          <Text style={styles.rewardsTitle}>Rewards Earned</Text>
          <View style={styles.rewardsRow}>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardEmoji}>🪙</Text>
              <Text style={[styles.rewardValue, { color: Colors.gold }]}>
                +{isWin ? result.coinsEarned : Math.round(result.coinsEarned * 0.3)}
              </Text>
              <Text style={styles.rewardLabel}>Coins</Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardEmoji}>⚡</Text>
              <Text style={[styles.rewardValue, { color: Colors.primaryLight }]}>
                +{isWin ? result.xpEarned : Math.round(result.xpEarned * 0.4)}
              </Text>
              <Text style={styles.rewardLabel}>XP</Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardEmoji}>🥊</Text>
              <Text style={[styles.rewardValue, { color: Colors.textPrimary }]}>{result.rounds}</Text>
              <Text style={styles.rewardLabel}>Rounds</Text>
            </View>
          </View>
        </View>

        {/* Recap */}
        <View style={styles.recapCard}>
          <Text style={styles.recapTitle}>📖 Battle Recap</Text>
          <Text style={styles.recapText}>{result.funnyRecap}</Text>
        </View>

        {/* Share Caption */}
        <View style={styles.captionCard}>
          <Text style={styles.captionTitle}>📤 Share Caption</Text>
          <Text style={styles.captionText}>{result.shareCaption}</Text>
        </View>

        {/* Ad Placeholder */}
        <View style={styles.adPlaceholder}>
          <Text style={styles.adEmoji}>📺</Text>
          <View>
            <Text style={styles.adTitle}>Watch a short ad for 2x rewards</Text>
            <Text style={styles.adSub}>Rewarded ad • Optional • Doubles coins & XP</Text>
          </View>
        </View>

        {/* Actions */}
        <Button label="Share Result" onPress={handleShare} emoji="📤" variant="primary" size="lg" />
        <Button label="Copy Caption" onPress={handleCopyCaption} emoji="📋" variant="ghost" size="md" />

        <View style={styles.secondaryRow}>
          <View style={{ flex: 1 }}>
            <Button
              label="Rematch"
              onPress={() => router.back()}
              variant="secondary"
              size="md"
              emoji="🔄"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="Scan New"
              onPress={() => router.push('/scan')}
              variant="secondary"
              size="md"
              emoji="📸"
            />
          </View>
        </View>

        <Button
          label="Back Home"
          onPress={() => router.replace('/(tabs)')}
          variant="ghost"
          size="md"
        />

        {/* Save clip placeholder */}
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoTitle}>🎬 Save Battle Clip</Text>
          <Text style={styles.videoSub}>Video export coming soon — share your battles on TikTok & Reels</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  scroll: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, gap: 14 },
  banner: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
  },
  bannerGrad: {
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  resultEmoji: { fontSize: 72 },
  resultTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 2,
  },
  winnerName: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
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
  rewardsTitle: { fontSize: 13, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1 },
  rewardsRow: { flexDirection: 'row', gap: 8 },
  rewardChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 4,
  },
  rewardEmoji: { fontSize: 22 },
  rewardValue: { fontSize: 20, fontWeight: '900' },
  rewardLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700' },
  recapCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recapTitle: { fontSize: 13, fontWeight: '800', color: Colors.textMuted },
  recapText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  captionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: `${Colors.primaryLight}33`,
  },
  captionTitle: { fontSize: 13, fontWeight: '800', color: Colors.primaryLight },
  captionText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  adPlaceholder: {
    flexDirection: 'row',
    backgroundColor: `${Colors.gold}15`,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: `${Colors.gold}44`,
    alignItems: 'center',
    gap: 12,
  },
  adEmoji: { fontSize: 28 },
  adTitle: { fontSize: 14, fontWeight: '700', color: Colors.gold },
  adSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  secondaryRow: { flexDirection: 'row', gap: 12 },
  videoPlaceholder: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 6,
  },
  videoTitle: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  videoSub: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  errorText: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
});
