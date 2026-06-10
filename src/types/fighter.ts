export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Absurd';

export type FighterClass =
  | 'Tank'
  | 'Trickster'
  | 'Speedster'
  | 'Blaster'
  | 'Cursed'
  | 'Snack Lord'
  | 'Household Menace';

export interface FighterStats {
  power: number;
  defense: number;
  speed: number;
  chaos: number;
  luck: number;
}

export interface Fighter {
  id: string;
  name: string;
  objectType: string;
  imageUri: string | null;
  rarity: Rarity;
  class: FighterClass;
  stats: FighterStats;
  hp: number;
  maxHp: number;
  specialMove: string;
  specialMoveDescription: string;
  personality: string;
  funnyQuote: string;
  colorTheme: string;
  level: number;
  xp: number;
  xpToNext: number;
  totalWins: number;
  totalLosses: number;
  isFavorite: boolean;
  isLocked: boolean;
  createdAt: number;
  battleHistory: BattleHistoryEntry[];
  cosmetics: string[];
}

export interface BattleHistoryEntry {
  battleId: string;
  opponentName: string;
  won: boolean;
  date: number;
}

export interface GeneratedFighter extends Fighter {
  isNew: boolean;
}
