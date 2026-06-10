export const Colors = {
  // Backgrounds
  bgDeep: '#0f0a1e',
  bgCard: '#1a1035',
  bgCardLight: '#231546',
  bgSurface: '#16102a',

  // Primary brand
  primary: '#7c3aed',
  primaryLight: '#a855f7',
  primaryDark: '#5b21b6',

  // Accents
  accent: '#ec4899',
  accentLight: '#f472b6',
  accentDark: '#be185d',

  // Gold / Economy
  gold: '#f59e0b',
  goldLight: '#fbbf24',
  gem: '#06b6d4',
  gemLight: '#22d3ee',

  // Status
  success: '#10b981',
  successLight: '#34d399',
  danger: '#ef4444',
  dangerLight: '#f87171',
  warning: '#f59e0b',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#c4b5fd',
  textMuted: '#7c6fa0',
  textDanger: '#f87171',

  // Rarity colors
  rarity: {
    Common: '#9ca3af',
    Rare: '#3b82f6',
    Epic: '#a855f7',
    Legendary: '#f59e0b',
    Absurd: '#ec4899',
  },

  // Object type themes
  objectThemes: {
    shoe: '#f97316',
    cup: '#06b6d4',
    keyboard: '#8b5cf6',
    bottle: '#10b981',
    book: '#3b82f6',
    toy: '#ec4899',
    chair: '#84cc16',
    snack: '#f59e0b',
    phone: '#6366f1',
    mystery: '#e879f9',
  },

  // UI chrome
  border: '#3d2a6e',
  borderLight: '#5b3fa0',
  overlay: 'rgba(0,0,0,0.6)',
  overlayLight: 'rgba(0,0,0,0.3)',

  // Transparent
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
