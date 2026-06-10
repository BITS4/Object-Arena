import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Fighter } from '../types/fighter';
import { Colors } from '../theme/colors';
import RarityBadge from './RarityBadge';
import { OBJECT_TYPES } from '../data/objectTypes';

interface Props {
  fighter: Fighter;
  compact?: boolean;
  onPress?: () => void;
  selected?: boolean;
}

export default function FighterCard({ fighter, compact = false, onPress, selected = false }: Props) {
  const typeData = OBJECT_TYPES[fighter.objectType];
  const accentColor = fighter.colorTheme;

  const card = (
    <LinearGradient
      colors={[`${accentColor}33`, Colors.bgCard, Colors.bgDeep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        compact && styles.cardCompact,
        selected && { borderColor: accentColor, borderWidth: 2.5 },
      ]}
    >
      {/* Emoji / Image */}
      <View style={[styles.imageArea, { backgroundColor: `${accentColor}22` }]}>
        {fighter.imageUri ? (
          <Image source={{ uri: fighter.imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.emoji}>{typeData?.emoji ?? '❓'}</Text>
        )}
        {fighter.isFavorite && (
          <View style={styles.favBadge}>
            <Text style={{ fontSize: 12 }}>⭐</Text>
          </View>
        )}
        {fighter.isLocked && (
          <View style={styles.lockBadge}>
            <Text style={{ fontSize: 11 }}>🔒</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{fighter.name}</Text>
        <RarityBadge rarity={fighter.rarity} size="sm" />
        {!compact && (
          <>
            <Text style={styles.class}>⚔️ {fighter.class}</Text>
            <View style={styles.statsRow}>
              <StatChip label="PWR" value={fighter.stats.power} color={Colors.danger} />
              <StatChip label="SPD" value={fighter.stats.speed} color={Colors.success} />
              <StatChip label="DEF" value={fighter.stats.defense} color={Colors.gem} />
            </View>
          </>
        )}
        {compact && (
          <Text style={styles.level}>Lv.{fighter.level}</Text>
        )}
      </View>
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
        {card}
      </TouchableOpacity>
    );
  }
  return card;
}

function StatChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.statChip, { borderColor: `${color}44` }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  touchable: { flex: 1 },
  card: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  cardCompact: {
    padding: 10,
    gap: 6,
  },
  imageArea: {
    height: 90,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  emoji: {
    fontSize: 44,
  },
  favBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    padding: 2,
  },
  lockBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    padding: 2,
  },
  info: {
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  class: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  level: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.bgSurface,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
