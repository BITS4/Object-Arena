import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  emoji?: string;
}

const GRADIENTS: Record<Variant, [string, string]> = {
  primary: [Colors.primaryLight, Colors.primary],
  secondary: [Colors.bgCardLight, Colors.bgCard],
  danger: [Colors.dangerLight, Colors.danger],
  ghost: ['transparent', 'transparent'],
  gold: [Colors.goldLight, Colors.gold],
};

const SIZES = {
  sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, borderRadius: 12 },
  md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 16, borderRadius: 14 },
  lg: { paddingVertical: 18, paddingHorizontal: 28, fontSize: 18, borderRadius: 16 },
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  emoji,
}: Props) {
  const sizeStyle = SIZES[size];
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[styles.wrapper, { borderRadius: sizeStyle.borderRadius, opacity: disabled ? 0.5 : 1 }, style]}
    >
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
            borderRadius: sizeStyle.borderRadius,
            borderWidth: isGhost ? 1.5 : 0,
            borderColor: isGhost ? Colors.border : 'transparent',
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <Text
            style={[
              styles.label,
              { fontSize: sizeStyle.fontSize },
              isGhost && { color: Colors.textSecondary },
              textStyle,
            ]}
          >
            {emoji ? `${emoji}  ` : ''}{label}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
