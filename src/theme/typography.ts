import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  displayXL: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  displayLG: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  displayMD: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  h1: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bodyLG: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bodySM: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textMuted,
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  buttonSM: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  stat: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  number: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
});
