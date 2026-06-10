import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Share,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../src/store/gameStore';
import CurrencyDisplay from '../../src/components/CurrencyDisplay';
import { Colors } from '../../src/theme/colors';
import { getPlayerTitle } from '../../src/game/progression';

const AVATARS = ['⚔️', '🏆', '🔥', '⚡', '💀', '👑', '🎯', '🌪️', '🦁', '🐉'];

export default function ProfileScreen() {
  const { player, fighters, updateUsername, updateSettings } = useGameStore();
  const [editNameModal, setEditNameModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [newName, setNewName] = useState(player.username);

  const bestFighter = fighters.reduce(
    (best, f) => {
      const power = f.stats.power + f.stats.defense + f.stats.speed;
      const bestPower = best ? best.stats.power + best.stats.defense + best.stats.speed : -1;
      return power > bestPower ? f : best;
    },
    null as (typeof fighters)[0] | null
  );

  const winRate = player.totalBattles > 0
    ? Math.round((player.totalWins / player.totalBattles) * 100)
    : 0;

  async function handleShareProfile() {
    await Share.share({
      message: `Check out my Object Arena profile! ${player.username} — ${getPlayerTitle(player.level)} with ${player.totalWins} wins and ${fighters.length} fighters. #ObjectArena`,
    });
  }

  function saveUsername() {
    if (newName.trim()) {
      updateUsername(newName.trim());
    }
    setEditNameModal(false);
  }

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <CurrencyDisplay />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar & name */}
        <LinearGradient
          colors={[Colors.primary + '44', Colors.bgCard]}
          style={styles.avatarCard}
        >
          <TouchableOpacity onPress={() => setAvatarModal(true)} style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{player.avatarEmoji}</Text>
            <View style={styles.avatarEdit}>
              <Text style={styles.avatarEditText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.nameRow}>
            <Text style={styles.username}>{player.username}</Text>
            <TouchableOpacity onPress={() => { setNewName(player.username); setEditNameModal(true); }}>
              <Text style={styles.editBtn}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.playerTitle}>{getPlayerTitle(player.level)} · Level {player.level}</Text>
          <View style={styles.xpRow}>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${(player.xp / player.xpToNext) * 100}%` }]} />
            </View>
            <Text style={styles.xpText}>{player.xp}/{player.xpToNext} XP</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Total Wins', value: player.totalWins, emoji: '🏆' },
            { label: 'Total Battles', value: player.totalBattles, emoji: '⚔️' },
            { label: 'Win Rate', value: `${winRate}%`, emoji: '📊' },
            { label: 'Fighters', value: fighters.length, emoji: '📦' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Best Fighter */}
        <View style={styles.bestFighterCard}>
          <Text style={styles.sectionTitle}>Best Fighter</Text>
          {bestFighter ? (
            <TouchableOpacity
              onPress={() => router.push(`/fighter/${bestFighter.id}` as any)}
              style={styles.bestFighterRow}
              activeOpacity={0.8}
            >
              <View style={[styles.bestFighterImg, { backgroundColor: bestFighter.colorTheme + '33' }]}>
                <Text style={{ fontSize: 36 }}>
                  {bestFighter.imageUri ? '🖼️' : '❓'}
                </Text>
              </View>
              <View style={styles.bestFighterInfo}>
                <Text style={styles.bestFighterName}>{bestFighter.name}</Text>
                <Text style={styles.bestFighterClass}>{bestFighter.rarity} {bestFighter.class}</Text>
                <Text style={styles.bestFighterStats}>
                  {bestFighter.totalWins}W · Lv.{bestFighter.level}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noFighters}>Scan your first object to get started!</Text>
          )}
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.actionRow} onPress={handleShareProfile} activeOpacity={0.8}>
          <Text style={styles.actionEmoji}>📤</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Share Profile</Text>
            <Text style={styles.actionSub}>Challenge friends to beat your record</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/settings')} activeOpacity={0.8}>
          <Text style={styles.actionEmoji}>⚙️</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Settings</Text>
            <Text style={styles.actionSub}>Sound, privacy, and more</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/shop')} activeOpacity={0.8}>
          <Text style={styles.actionEmoji}>🛒</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Shop</Text>
            <Text style={styles.actionSub}>Cosmetics, credits, and gems</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit name modal */}
      <Modal visible={editNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change Username</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={styles.modalInput}
              maxLength={20}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                onPress={() => setEditNameModal(false)}
                style={[styles.modalBtn, { borderColor: Colors.border }]}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveUsername}
                style={[styles.modalBtn, { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
              >
                <Text style={[styles.modalBtnText, { color: Colors.white }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar modal */}
      <Modal visible={avatarModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setAvatarModal(false)} activeOpacity={1}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((a) => (
                <TouchableOpacity
                  key={a}
                  onPress={() => { updateSettings({}); setAvatarModal(false); }}
                  style={[styles.avatarOption, player.avatarEmoji === a && styles.avatarOptionActive]}
                >
                  <Text style={styles.avatarOptionEmoji}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },
  avatarCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    position: 'relative',
  },
  avatarEmoji: { fontSize: 48 },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarEditText: { fontSize: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  username: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary },
  editBtn: { fontSize: 18 },
  playerTitle: { fontSize: 14, color: Colors.primaryLight, fontWeight: '700' },
  xpRow: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%' },
  xpTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.bgSurface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', backgroundColor: Colors.primaryLight, borderRadius: 3 },
  xpText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: {
    width: '48%',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
  bestFighterCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },
  bestFighterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bestFighterImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestFighterInfo: { flex: 1 },
  bestFighterName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  bestFighterClass: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  bestFighterStats: { fontSize: 13, color: Colors.success, marginTop: 4, fontWeight: '700' },
  noFighters: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic' },
  arrow: { fontSize: 22, color: Colors.textMuted },
  actionRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionEmoji: { fontSize: 28 },
  actionInfo: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  actionSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
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
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  modalBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  avatarOptionActive: { borderColor: Colors.primaryLight },
  avatarOptionEmoji: { fontSize: 30 },
});
