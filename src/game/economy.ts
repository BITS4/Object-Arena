import { PlayerCurrency, UpgradeTier } from '../types/economy';
import { Fighter, FighterStats } from '../types/fighter';
import { clamp } from '../utils/random';

export const STARTING_CURRENCY: PlayerCurrency = {
  coins: 500,
  gems: 20,
  scanCredits: 10,
};

export const DAILY_BONUS = {
  coins: 100,
  gems: 5,
  scanCredits: 2,
};

export const BATTLE_REWARDS = {
  win: { coins: { min: 30, max: 80 }, xp: { min: 50, max: 120 } },
  loss: { coins: { min: 10, max: 25 }, xp: { min: 15, max: 40 } },
};

export function canAfford(currency: PlayerCurrency, cost: number, type: 'coins' | 'gems'): boolean {
  return currency[type] >= cost;
}

export function spendCoins(currency: PlayerCurrency, amount: number): PlayerCurrency | null {
  if (currency.coins < amount) return null;
  return { ...currency, coins: currency.coins - amount };
}

export function spendGems(currency: PlayerCurrency, amount: number): PlayerCurrency | null {
  if (currency.gems < amount) return null;
  return { ...currency, gems: currency.gems - amount };
}

export function addCoins(currency: PlayerCurrency, amount: number): PlayerCurrency {
  return { ...currency, coins: currency.coins + amount };
}

export function addGems(currency: PlayerCurrency, amount: number): PlayerCurrency {
  return { ...currency, gems: currency.gems + amount };
}

export function consumeScanCredit(currency: PlayerCurrency): PlayerCurrency | null {
  if (currency.scanCredits <= 0) return null;
  return { ...currency, scanCredits: currency.scanCredits - 1 };
}

// ─── Upgrade System ──────────────────────────────────────────────────────────

export function getUpgradeTiers(fighter: Fighter): UpgradeTier[] {
  const currentTier = Math.floor((fighter.level - 1) / 2);

  return [
    {
      tier: 1,
      cost: 100 + currentTier * 50,
      statBoost: { power: 5, defense: 3 },
      label: 'Power Boost I',
    },
    {
      tier: 2,
      cost: 150 + currentTier * 75,
      statBoost: { speed: 5, luck: 5 },
      label: 'Agility Rush',
    },
    {
      tier: 3,
      cost: 200 + currentTier * 100,
      statBoost: { chaos: 8, power: 4 },
      label: 'Chaos Injection',
    },
    {
      tier: 4,
      cost: 350 + currentTier * 150,
      statBoost: { power: 8, defense: 8, speed: 5 },
      label: 'Full Upgrade',
    },
    {
      tier: 5,
      cost: 500 + currentTier * 200,
      statBoost: { power: 12, defense: 10, speed: 8, chaos: 6, luck: 6 },
      label: 'Max Potential',
    },
  ];
}

export function applyUpgrade(fighter: Fighter, tier: UpgradeTier): Fighter {
  const newStats: FighterStats = { ...fighter.stats };
  for (const [stat, boost] of Object.entries(tier.statBoost)) {
    const key = stat as keyof FighterStats;
    newStats[key] = clamp(newStats[key] + boost, 0, 100);
  }

  // Recalculate HP
  const newMaxHp = Math.round(fighter.maxHp + tier.statBoost.defense ? (tier.statBoost.defense ?? 0) * 5 : 0);

  return {
    ...fighter,
    stats: newStats,
    maxHp: newMaxHp,
    hp: newMaxHp, // heal on upgrade
  };
}

// ─── XP & Leveling ──────────────────────────────────────────────────────────

export function xpToNextLevel(level: number): number {
  return Math.round(100 + level * 50 + level * level * 5);
}

export function addXpToFighter(fighter: Fighter, xpGained: number): Fighter {
  let newXp = fighter.xp + xpGained;
  let newLevel = fighter.level;
  let newXpToNext = fighter.xpToNext;

  while (newXp >= newXpToNext && newLevel < 50) {
    newXp -= newXpToNext;
    newLevel++;
    newXpToNext = xpToNextLevel(newLevel);
  }

  if (newLevel >= 50) {
    newXp = 0;
    newXpToNext = 0;
  }

  return { ...fighter, xp: newXp, level: newLevel, xpToNext: newXpToNext };
}

export function addXpToPlayer(
  currentLevel: number,
  currentXp: number,
  currentXpToNext: number,
  xpGained: number
): { level: number; xp: number; xpToNext: number; leveledUp: boolean } {
  let newXp = currentXp + xpGained;
  let newLevel = currentLevel;
  let newXpToNext = currentXpToNext;
  let leveledUp = false;

  while (newXp >= newXpToNext && newLevel < 100) {
    newXp -= newXpToNext;
    newLevel++;
    newXpToNext = xpToNextLevel(newLevel);
    leveledUp = true;
  }

  return { level: newLevel, xp: newXp, xpToNext: newXpToNext, leveledUp };
}
