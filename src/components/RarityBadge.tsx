import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rarity } from '../types/fighter';
import { Colors } from '../theme/colors';

const RARITY_EMOJI: Record<Rarity, string> = {
  Common: '⚪',
  Rare: '🔵',
  Epic: '🟣',
  Legendary: '🟡',
  Absurd: '🌸',
};

interface Props {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { fontSize: 10, padding: 4, paddingH: 8, borderRadius: 6 },
  md: { fontSize: 12, padding: 5, paddingH: 10, borderRadius: 8 },
  lg: { fontSize: 14, padding: 6, paddingH: 14, borderRadius: 10 },
};

export default function RarityBadge({ rarity, size = 'md' }: Props) {
  const color = Colors.rarity[rarity];
  const s = SIZES[size];
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}22`,
          borderColor: color,
          paddingVertical: s.padding,
          paddingHorizontal: s.paddingH,
          borderRadius: s.borderRadius,
        },
      ]}
    >
      <Text style={[styles.text, { color, fontSize: s.fontSize }]}>
        {RARITY_EMOJI[rarity]} {rarity.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '800',
    letterSpacing: 1,
  },
});
