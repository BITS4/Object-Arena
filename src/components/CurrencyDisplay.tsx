import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { useGameStore } from '../store/gameStore';
import { router } from 'expo-router';

export default function CurrencyDisplay() {
  const { player } = useGameStore();

  return (
    <TouchableOpacity onPress={() => router.push('/shop')} style={styles.container} activeOpacity={0.8}>
      <View style={styles.chip}>
        <Text style={styles.emoji}>🪙</Text>
        <Text style={styles.amount}>{player.currency.coins.toLocaleString()}</Text>
      </View>
      <View style={styles.chip}>
        <Text style={styles.emoji}>💎</Text>
        <Text style={[styles.amount, { color: Colors.gem }]}>{player.currency.gems}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emoji: {
    fontSize: 14,
  },
  amount: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.gold,
  },
});
