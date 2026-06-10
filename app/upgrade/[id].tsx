import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../src/store/gameStore';
import Button from '../../src/components/Button';
import ScreenHeader from '../../src/components/ScreenHeader';
import StatBar from '../../src/components/StatBar';
import { Colors } from '../../src/theme/colors';
import { getUpgradeTiers, applyUpgrade } from '../../src/game/economy';
import { UpgradeTier } from '../../src/types/economy';

export default function UpgradeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fighters, player, spendCoins: spendCoinsStore, updateFighter } = useGameStore();
  const [justUpgraded, setJustUpgraded] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const fighter = fighters.find((f) => f.id === id);

  if (!fighter) {
    return (
      <LinearGradient colors={[Colors.bgDeep, Colors.bgDeep]} style={styles.center}>
        <Text style={styles.errorText}>Fighter not found.</Text>
        <Button label="Back" onPress={() => router.back()} variant="primary" />
      </LinearGradient>
    );
  }

  const tiers = getUpgradeTiers(fighter);
  const accentColor = fighter.colorTheme;

  function playUpgradeAnimation() {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]),
    ]).start();
  }

  function handleUpgrade(tier: UpgradeTier) {
    const canAfford = player.currency.coins >= tier.cost;
    if (!canAfford) {
      Alert.alert(
        'Not Enough Coins',
        `You need ${tier.cost} coins but only have ${player.currency.coins}. Battle or watch an ad to earn more!`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (fighter.level >= 50) {
      Alert.alert('Max Level', 'This fighter has reached the maximum level!');
      return;
    }

    Alert.alert(
      `Apply ${tier.label}?`,
      `This will cost ${tier.cost} coins and boost: ${Object.entries(tier.statBoost)
        .map(([k, v]) => `${k.toUpperCase()} +${v}`)
        .join(', ')}`,
      [
        {
          text: 'Upgrade!',
          onPress: () => {
            const success = spendCoinsStore(tier.cost);
            if (!success) return;
            const upgraded = applyUpgrade(fighter, tier);
            updateFighter({ ...upgraded, level: fighter.level + 1 });
            setJustUpgraded(true);
            playUpgradeAnimation();
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <ScreenHeader title="Upgrade" subtitle={fighter.name} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Currency */}
        <View style={styles.coinRow}>
          <Text style={styles.coinEmoji}>🪙</Text>
          <Text style={styles.coinAmount}>{player.currency.coins.toLocaleString()} coins</Text>
        </View>

        {/* Fighter */}
        <Animated.View
          style={[
            styles.fighterCard,
            {
              transform: [{ scale: scaleAnim }],
              borderColor: accentColor,
              opacity: flashAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }),
            },
          ]}
        >
          <LinearGradient
            colors={[`${accentColor}33`, Colors.bgCard]}
            style={styles.fighterCardGrad}
          >
            {justUpgraded && (
              <View style={styles.upgradedBadge}>
                <Text style={styles.upgradedText}>✨ UPGRADED!</Text>
              </View>
            )}
            <Text style={styles.fighterLevel}>Lv.{fighter.level}</Text>
            <Text style={styles.fighterName}>{fighter.name}</Text>
            <View style={styles.statsWrap}>
              <StatBar label="Power" value={fighter.stats.power} color={Colors.danger} animate={false} />
              <StatBar label="Defense" value={fighter.stats.defense} color={Colors.gem} animate={false} />
              <StatBar label="Speed" value={fighter.stats.speed} color={Colors.success} animate={false} />
              <StatBar label="Chaos" value={fighter.stats.chaos} color={Colors.accent} animate={false} />
              <StatBar label="Luck" value={fighter.stats.luck} color={Colors.gold} animate={false} />
            </View>
            <View style={styles.hpRow}>
              <Text style={styles.hpLabel}>❤️ HP: </Text>
              <Text style={styles.hpValue}>{fighter.maxHp}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Level cap notice */}
        {fighter.level >= 50 && (
          <View style={styles.maxLevelBanner}>
            <Text style={styles.maxLevelText}>🏆 MAX LEVEL REACHED — This fighter is at its peak!</Text>
          </View>
        )}

        {/* Upgrade Tiers */}
        <Text style={styles.sectionTitle}>Available Upgrades</Text>
        {tiers.map((tier) => {
          const canAfford = player.currency.coins >= tier.cost;
          return (
            <LinearGradient
              key={tier.tier}
              colors={canAfford ? [`${Colors.primary}22`, Colors.bgCard] : [Colors.bgSurface, Colors.bgCard]}
              style={[styles.tierCard, !canAfford && styles.tierCardDisabled]}
            >
              <View style={styles.tierHeader}>
                <View>
                  <Text style={styles.tierName}>{tier.label}</Text>
                  <Text style={styles.tierBoosts}>
                    {Object.entries(tier.statBoost)
                      .map(([k, v]) => `${k.toUpperCase()} +${v}`)
                      .join('  ')}
                  </Text>
                </View>
                <View style={styles.tierCostWrap}>
                  <Text style={styles.tierCostEmoji}>🪙</Text>
                  <Text style={[styles.tierCost, !canAfford && { color: Colors.danger }]}>
                    {tier.cost}
                  </Text>
                </View>
              </View>
              <Button
                label={canAfford ? 'Apply Upgrade' : 'Not Enough Coins'}
                onPress={() => handleUpgrade(tier)}
                variant={canAfford ? 'primary' : 'ghost'}
                size="sm"
                disabled={!canAfford || fighter.level >= 50}
              />
            </LinearGradient>
          );
        })}

        {/* Cosmetics placeholder */}
        <View style={styles.cosmeticsCard}>
          <Text style={styles.cosmeticsTitle}>🎨 Cosmetics</Text>
          <Text style={styles.cosmeticsSub}>
            Equip auras, crowns, and battle effects from the Shop. Coming soon!
          </Text>
        </View>

        {/* Ad for coins */}
        <View style={styles.adCard}>
          <Text style={styles.adEmoji}>📺</Text>
          <View>
            <Text style={styles.adTitle}>Watch an ad for +100 coins</Text>
            <Text style={styles.adSub}>Rewarded ad placeholder</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  coinEmoji: { fontSize: 18 },
  coinAmount: { fontSize: 18, fontWeight: '800', color: Colors.gold },
  fighterCard: {
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  fighterCardGrad: { padding: 20, gap: 8 },
  upgradedBadge: {
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 4,
  },
  upgradedText: { fontSize: 13, fontWeight: '900', color: Colors.bgDeep },
  fighterLevel: { fontSize: 13, color: Colors.primaryLight, fontWeight: '800', textAlign: 'center' },
  fighterName: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  statsWrap: { gap: 2 },
  hpRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  hpLabel: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  hpValue: { fontSize: 18, fontWeight: '900', color: Colors.dangerLight },
  maxLevelBanner: {
    backgroundColor: `${Colors.gold}22`,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.gold,
    alignItems: 'center',
  },
  maxLevelText: { fontSize: 14, fontWeight: '800', color: Colors.gold, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  tierCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tierCardDisabled: { opacity: 0.6 },
  tierHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tierName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  tierBoosts: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  tierCostWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tierCostEmoji: { fontSize: 16 },
  tierCost: { fontSize: 18, fontWeight: '900', color: Colors.gold },
  cosmeticsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    gap: 6,
    alignItems: 'center',
  },
  cosmeticsTitle: { fontSize: 15, fontWeight: '800', color: Colors.textSecondary },
  cosmeticsSub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  adCard: {
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
  errorText: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
});
