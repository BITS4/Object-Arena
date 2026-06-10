import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  label: string;
  value: number;
  max?: number;
  color?: string;
  showValue?: boolean;
  animate?: boolean;
}

export default function StatBar({
  label,
  value,
  max = 100,
  color = Colors.primary,
  showValue = true,
  animate = true,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const pct = Math.min(value / max, 1);

  useEffect(() => {
    if (animate) {
      Animated.timing(progress, {
        toValue: pct,
        duration: 600,
        delay: 200,
        useNativeDriver: false,
      }).start();
    } else {
      progress.setValue(pct);
    }
  }, [pct]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.trackWrap}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
        </View>
      </View>
      {showValue && <Text style={[styles.value, { color }]}>{value}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: 64,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  trackWrap: {
    flex: 1,
    marginHorizontal: 10,
  },
  track: {
    height: 8,
    backgroundColor: Colors.bgSurface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  value: {
    width: 28,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
});
