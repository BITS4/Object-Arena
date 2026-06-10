import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../src/store/gameStore';
import Button from '../../src/components/Button';
import ScreenHeader from '../../src/components/ScreenHeader';
import RarityBadge from '../../src/components/RarityBadge';
import StatBar from '../../src/components/StatBar';
import { Colors } from '../../src/theme/colors';
import { OBJECT_TYPES } from '../../src/data/objectTypes';
import { generateFighterShareCaption } from '../../src/utils/shareText';

export default function FighterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fighters, toggleFavorite, toggleLocked, deleteFighter, renameFighter } = useGameStore();
  const [renameModal, setRenameModal] = useState(false);
  const [newName, setNewName] = useState('');

  const fighter = fighters.find((f) => f.id === id);

  if (!fighter) {
    return (
      <LinearGradient colors={[Colors.bgDeep, Colors.bgDeep]} style={styles.center}>
        <Text style={styles.errorText}>Fighter not found.</Text>
        <Button label="Back" onPress={() => router.back()} variant="primary" />
      </LinearGradient>
    );
  }

  const typeData = OBJECT_TYPES[fighter.objectType];
  const accentColor = fighter.colorTheme;

  function handleDelete() {
    if (fighter.isLocked) {
      Alert.alert('Locked', 'Unlock this fighter before deleting.');
      return;
    }
    Alert.alert(
      `Delete ${fighter.name}?`,
      'This cannot be undone.',
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => { deleteFighter(fighter.id); router.back(); },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  function handleRename() {
    setNewName(fighter.name);
    setRenameModal(true);
  }

  function confirmRename() {
    if (newName.trim()) {
      renameFighter(fighter.id, newName.trim());
    }
    setRenameModal(false);
  }

  async function handleShare() {
    const caption = generateFighterShareCaption(fighter);
    await Share.share({ message: caption });
  }

  const winRate = fighter.totalBattles > 0
    ? Math.round((fighter.totalWins / (fighter.totalWins + fighter.totalLosses)) * 100)
    : 0;

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <ScreenHeader
        title={fighter.name}
        subtitle={`${fighter.rarity} ${fighter.class}`}
        rightElement={
          <Text
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(fighter.id)}
          >
            {fighter.isFavorite ? '⭐' : '☆'}
          </Text>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <LinearGradient
          colors={[`${accentColor}44`, Colors.bgCard]}
          style={styles.heroCard}
        >
          <Text style={styles.heroEmoji}>{typeData?.emoji ?? '❓'}</Text>
          <RarityBadge rarity={fighter.rarity} size="lg" />
          <Text style={styles.heroClass}>⚔️ {fighter.class}</Text>
          <Text style={styles.heroQuote}>"{fighter.funnyQuote}"</Text>
        </LinearGradient>

        {/* Level & XP */}
        <View style={styles.levelCard}>
          <View style={styles.levelRow}>
            <Text style={styles.levelLabel}>Level {fighter.level}</Text>
            <Text style={styles.xpText}>
              {fighter.xpToNext === 0 ? 'MAX' : `${fighter.xp} / ${fighter.xpToNext} XP`}
            </Text>
          </View>
          {fighter.xpToNext > 0 && (
            <View style={styles.xpTrack}>
              <View
                style={[styles.xpFill, { width: `${(fighter.xp / fighter.xpToNext) * 100}%` }]}
              />
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Combat Stats</Text>
          <StatBar label="Power" value={fighter.stats.power} color={Colors.danger} />
          <StatBar label="Defense" value={fighter.stats.defense} color={Colors.gem} />
          <StatBar label="Speed" value={fighter.stats.speed} color={Colors.success} />
          <StatBar label="Chaos" value={fighter.stats.chaos} color={Colors.accent} />
          <StatBar label="Luck" value={fighter.stats.luck} color={Colors.gold} />
        </View>

        {/* Special Move */}
        <LinearGradient colors={[`${accentColor}33`, Colors.bgCard]} style={styles.specialCard}>
          <Text style={styles.specialLabel}>⚡ SPECIAL MOVE</Text>
          <Text style={styles.specialName}>{fighter.specialMove}</Text>
          <Text style={styles.specialDesc}>{fighter.specialMoveDescription}</Text>
        </LinearGradient>

        {/* Battle record */}
        <View style={styles.recordCard}>
          <Text style={styles.cardTitle}>Battle Record</Text>
          <View style={styles.recordRow}>
            <View style={styles.recordStat}>
              <Text style={[styles.recordNum, { color: Colors.success }]}>{fighter.totalWins}</Text>
              <Text style={styles.recordLbl}>Wins</Text>
            </View>
            <View style={styles.recordStat}>
              <Text style={[styles.recordNum, { color: Colors.danger }]}>{fighter.totalLosses}</Text>
              <Text style={styles.recordLbl}>Losses</Text>
            </View>
            <View style={styles.recordStat}>
              <Text style={styles.recordNum}>{winRate}%</Text>
              <Text style={styles.recordLbl}>Win Rate</Text>
            </View>
            <View style={styles.recordStat}>
              <Text style={[styles.recordNum, { color: Colors.dangerLight }]}>{fighter.maxHp}</Text>
              <Text style={styles.recordLbl}>Max HP</Text>
            </View>
          </View>
        </View>

        {/* Recent battles */}
        {fighter.battleHistory.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Battles</Text>
            {fighter.battleHistory.slice(-5).reverse().map((b, i) => (
              <View key={b.battleId + i} style={styles.historyRow}>
                <Text style={styles.historyResult}>{b.won ? '✅' : '❌'}</Text>
                <Text style={styles.historyOpponent}>vs {b.opponentName}</Text>
                <Text style={styles.historyDate}>
                  {new Date(b.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        <Button
          label="Battle Now"
          onPress={() => router.push('/battle-setup')}
          emoji="⚔️"
          variant="primary"
          size="lg"
        />
        <Button
          label="Upgrade Fighter"
          onPress={() => router.push(`/upgrade/${fighter.id}` as any)}
          emoji="⬆️"
          variant="secondary"
          size="md"
        />

        <View style={styles.actionRow}>
          <View style={{ flex: 1 }}>
            <Button label="Rename" onPress={handleRename} variant="ghost" size="sm" emoji="✏️" />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label={fighter.isLocked ? 'Unlock' : 'Lock'}
              onPress={() => toggleLocked(fighter.id)}
              variant="ghost"
              size="sm"
              emoji={fighter.isLocked ? '🔓' : '🔒'}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Share" onPress={handleShare} variant="ghost" size="sm" emoji="📤" />
          </View>
        </View>

        <Button label="Delete Fighter" onPress={handleDelete} variant="danger" size="md" emoji="🗑️" />
      </ScrollView>

      {/* Rename Modal */}
      <Modal visible={renameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename Fighter</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={styles.modalInput}
              maxLength={24}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Button label="Cancel" onPress={() => setRenameModal(false)} variant="ghost" size="sm" />
              <Button label="Save" onPress={confirmRename} variant="primary" size="sm" />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },
  favoriteBtn: { fontSize: 28 },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroEmoji: { fontSize: 80 },
  heroClass: { fontSize: 14, color: Colors.textSecondary, fontWeight: '700' },
  heroQuote: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  levelCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelLabel: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  xpText: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  xpTrack: {
    height: 8,
    backgroundColor: Colors.bgSurface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', backgroundColor: Colors.primaryLight, borderRadius: 4 },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: { fontSize: 13, fontWeight: '800', color: Colors.textMuted, marginBottom: 8, letterSpacing: 1 },
  specialCard: {
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specialLabel: { fontSize: 11, fontWeight: '800', color: Colors.primaryLight, letterSpacing: 1.5 },
  specialName: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  specialDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  recordCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recordRow: { flexDirection: 'row', justifyContent: 'space-between' },
  recordStat: { alignItems: 'center' },
  recordNum: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  recordLbl: { fontSize: 11, color: Colors.textMuted, fontWeight: '700', marginTop: 2 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgSurface,
  },
  historyResult: { fontSize: 16 },
  historyOpponent: { flex: 1, fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  historyDate: { fontSize: 11, color: Colors.textMuted },
  actionRow: { flexDirection: 'row', gap: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  modalInput: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalButtons: { flexDirection: 'row', gap: 12 },
  errorText: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
});
