import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import Button from '../src/components/Button';
import ScreenHeader from '../src/components/ScreenHeader';
import FighterCard from '../src/components/FighterCard';
import { Colors } from '../src/theme/colors';
import { MOCK_OPPONENTS } from '../src/data/mockOpponents';
import { calculateWinChance } from '../src/game/fighterGenerator';
import { Fighter } from '../src/types/fighter';
import { randomFrom } from '../src/utils/random';
import { OpponentType } from '../src/types/battle';

export default function BattleSetupScreen() {
  const { fighters, pendingFighter } = useGameStore();
  const [selectedFighterId, setSelectedFighterId] = useState(
    pendingFighter?.id ?? fighters[fighters.length - 1]?.id ?? null
  );
  const [opponentType, setOpponentType] = useState<OpponentType>('ai');

  const myFighters = pendingFighter
    ? [pendingFighter, ...fighters.filter((f) => f.id !== pendingFighter.id)]
    : fighters;

  const myFighter = myFighters.find((f) => f.id === selectedFighterId) ?? myFighters[0];

  const opponent: Fighter =
    opponentType === 'daily-boss'
      ? MOCK_OPPONENTS.find((o) => o.id === 'opp_boss_daily')!
      : randomFrom(MOCK_OPPONENTS.filter((o) => o.id !== 'opp_boss_daily'));

  const winChance = myFighter ? calculateWinChance(myFighter, opponent) : 50;

  function handleStartBattle() {
    if (!myFighter) return;
    router.push({
      pathname: '/battle',
      params: {
        fighterId: myFighter.id,
        opponentId: opponent.id,
        opponentType,
      },
    });
  }

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <ScreenHeader title="Battle Setup" subtitle="Choose your fighter and opponent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* YOUR FIGHTER */}
        <Text style={styles.sectionTitle}>Your Fighter</Text>
        {myFighters.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>No fighters! Scan an object first.</Text>
            <Button label="Scan Object" onPress={() => router.push('/scan')} variant="primary" size="sm" />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {myFighters.map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setSelectedFighterId(f.id)}
                style={styles.carouselItem}
                activeOpacity={0.8}
              >
                <FighterCard fighter={f} selected={f.id === selectedFighterId} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* OPPONENT TYPE */}
        <Text style={styles.sectionTitle}>Choose Opponent</Text>
        <View style={styles.opponentTypes}>
          {[
            { type: 'ai' as OpponentType, label: 'Random AI', emoji: '🤖', desc: 'Face a random object champion' },
            { type: 'friend' as OpponentType, label: 'Challenge Friend', emoji: '👥', desc: 'Send a challenge link (coming soon)', disabled: true },
            { type: 'daily-boss' as OpponentType, label: 'Daily Boss', emoji: '👹', desc: 'Face today\'s boss fighter' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.type}
              onPress={() => !opt.disabled && setOpponentType(opt.type)}
              activeOpacity={opt.disabled ? 1 : 0.8}
              style={[
                styles.opponentTypeBtn,
                opponentType === opt.type && styles.opponentTypeBtnActive,
                opt.disabled && styles.opponentTypeBtnDisabled,
              ]}
            >
              <Text style={styles.optEmoji}>{opt.emoji}</Text>
              <Text style={styles.optLabel}>{opt.label}</Text>
              <Text style={styles.optDesc}>{opt.desc}</Text>
              {opt.disabled && <Text style={styles.comingSoon}>Soon</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* OPPONENT PREVIEW */}
        <View style={styles.opponentPreview}>
          <Text style={styles.sectionTitle}>Opponent</Text>
          <View style={styles.opponentCard}>
            <Text style={styles.opponentEmoji}>
              {opponent.imageUri ? '🖼️' : '❓'}
            </Text>
            <View style={styles.opponentInfo}>
              <Text style={styles.opponentName}>{opponent.name}</Text>
              <Text style={styles.opponentClass}>{opponent.rarity} {opponent.class}</Text>
              <Text style={styles.opponentWins}>⚔️ {opponent.totalWins}W / {opponent.totalLosses}L</Text>
            </View>
            <View style={styles.opponentHP}>
              <Text style={styles.hpLabel}>HP</Text>
              <Text style={styles.hpValue}>{opponent.maxHp}</Text>
            </View>
          </View>
        </View>

        {/* WIN CHANCE */}
        {myFighter && (
          <View style={styles.winChanceCard}>
            <Text style={styles.winChanceLabel}>Win Probability</Text>
            <View style={styles.winChanceBar}>
              <View style={[styles.winFill, { width: `${winChance}%` }]} />
              <View style={[styles.loseFill, { width: `${100 - winChance}%` }]} />
            </View>
            <View style={styles.winChanceLabels}>
              <Text style={[styles.winPct, { color: Colors.success }]}>{winChance}% You</Text>
              <Text style={[styles.winPct, { color: Colors.danger }]}>{100 - winChance}% Them</Text>
            </View>
            <Text style={styles.winDisclaimer}>
              {winChance >= 60
                ? '🔥 Looking good. Go crush them.'
                : winChance >= 40
                ? '⚡ Could go either way. Chaos may decide.'
                : '💀 Long shot. But chaos is unpredictable.'}
            </Text>
          </View>
        )}

        <Button
          label="START BATTLE ⚔️"
          onPress={handleStartBattle}
          variant="primary"
          size="lg"
          disabled={!myFighter}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  carousel: { marginHorizontal: -4 },
  carouselItem: { width: 160, marginHorizontal: 4 },
  emptyCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  opponentTypes: { flexDirection: 'row', gap: 8 },
  opponentTypeBtn: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  opponentTypeBtnActive: {
    borderColor: Colors.primaryLight,
    backgroundColor: `${Colors.primaryLight}22`,
  },
  opponentTypeBtnDisabled: { opacity: 0.4 },
  optEmoji: { fontSize: 24 },
  optLabel: { fontSize: 12, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  optDesc: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', lineHeight: 14 },
  comingSoon: {
    fontSize: 9,
    color: Colors.gold,
    fontWeight: '800',
    backgroundColor: `${Colors.gold}22`,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 2,
  },
  opponentPreview: { gap: 10 },
  opponentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  opponentEmoji: { fontSize: 40 },
  opponentInfo: { flex: 1 },
  opponentName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  opponentClass: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  opponentWins: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  opponentHP: { alignItems: 'center' },
  hpLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700' },
  hpValue: { fontSize: 20, fontWeight: '900', color: Colors.dangerLight },
  winChanceCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  winChanceLabel: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  winChanceBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  winFill: { backgroundColor: Colors.success, height: '100%' },
  loseFill: { backgroundColor: Colors.danger, height: '100%' },
  winChanceLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  winPct: { fontSize: 13, fontWeight: '800' },
  winDisclaimer: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
