export interface PlayerCurrency {
  coins: number;
  gems: number;
  scanCredits: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'cosmetic' | 'voice_pack' | 'battle_effect' | 'scan_credits' | 'currency' | 'battle_pass' | 'remove_ads';
  price: number;
  currency: 'coins' | 'gems' | 'usd';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isOwned?: boolean;
  isFeatured?: boolean;
  emoji: string;
}

export interface UpgradeTier {
  tier: number;
  cost: number;
  statBoost: { [key: string]: number };
  label: string;
}

export interface PlayerProfile {
  id: string;
  username: string;
  avatarEmoji: string;
  level: number;
  xp: number;
  xpToNext: number;
  totalWins: number;
  totalBattles: number;
  currency: PlayerCurrency;
  settings: PlayerSettings;
  hasCompletedOnboarding: boolean;
  joinedAt: number;
  lastDailyBonusAt: number | null;
}

export interface PlayerSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  reducedMotion: boolean;
  hapticEnabled: boolean;
}
