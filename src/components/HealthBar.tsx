import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  current: number;
  max: number;
  label: string;
  flip?: boolean;
}

export default function HealthBar({ current, max, label, flip = false }: Props) {
  const progress = useRef(new Animated.Value(current / max)).current;
  const pct = Math.max(0, current / max);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: pct,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const barColor = pct > 0.5 ? Colors.success : pct > 0.25 ? Colors.gold : Colors.danger;

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, flip && styles.containerFlip]}>
      <View style={[styles.labelRow, flip && styles.labelRowFlip]}>
        <Text style={styles.name} numberOfLines={1}>{label}</Text>
        <Text style={[styles.hp, { color: barColor }]}>
          {Math.max(0, current)}/{max}
        </Text>
      </View>
      <View style={styles.track}>
        {flip ? (
          <Animated.View
            style={[
              styles.fill,
              {
                width,
                backgroundColor: barColor,
                alignSelf: 'flex-end',
                right: 0,
                left: undefined,
              },
            ]}
          />
        ) : (
          <Animated.View style={[styles.fill, { width, backgroundColor: barColor }]} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
  },
  containerFlip: {
    alignItems: 'flex-end',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRowFlip: {
    flexDirection: 'row-reverse',
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  hp: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  track: {
    height: 10,
    backgroundColor: Colors.bgSurface,
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    position: 'absolute',
    left: 0,
  },
});
