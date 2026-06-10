/**
 * Progression tracking utilities.
 * Calculates titles, achievements, and milestone checks.
 */

export function getPlayerTitle(level: number): string {
  if (level >= 50) return 'Arena Legend';
  if (level >= 35) return 'Grand Collector';
  if (level >= 25) return 'Elite Warrior';
  if (level >= 15) return 'Object Hunter';
  if (level >= 10) return 'Arena Regular';
  if (level >= 5) return 'Rookie Scanner';
  return 'Fresh Recruit';
}

export function getWinStreakBonus(streak: number): { coins: number; xp: number; label: string } {
  if (streak >= 10) return { coins: 200, xp: 300, label: 'LEGENDARY STREAK x10' };
  if (streak >= 5) return { coins: 100, xp: 150, label: 'HOT STREAK x5' };
  if (streak >= 3) return { coins: 50, xp: 75, label: 'On Fire x3' };
  return { coins: 0, xp: 0, label: '' };
}

export function getRarityXpBonus(rarity: string): number {
  switch (rarity) {
    case 'Absurd': return 2.0;
    case 'Legendary': return 1.75;
    case 'Epic': return 1.5;
    case 'Rare': return 1.25;
    default: return 1.0;
  }
}

export function formatXpProgress(xp: number, xpToNext: number): string {
  if (xpToNext === 0) return 'MAX LEVEL';
  const pct = Math.round((xp / xpToNext) * 100);
  return `${xp} / ${xpToNext} XP (${pct}%)`;
}

export function getMockLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, username: 'CrunchMaster99', fighterName: 'Snack Lord Supreme', wins: 247, level: 42, emoji: '🍟' },
    { rank: 2, username: 'KeyboardWarrior', fighterName: 'Ctrl+Alt+Delete', wins: 198, level: 38, emoji: '⌨️' },
    { rank: 3, username: 'HydroSlayer', fighterName: 'Hydra the Hydrator', wins: 176, level: 35, emoji: '🍶' },
    { rank: 4, username: 'SoleKing', fighterName: 'Sole Destroyer', wins: 154, level: 31, emoji: '👟' },
    { rank: 5, username: 'MugLife', fighterName: 'The Unrinsed', wins: 132, level: 28, emoji: '☕' },
    { rank: 6, username: 'PhoneEnjoyer', fighterName: 'Cracked Screen Warrior', wins: 118, level: 25, emoji: '📱' },
    { rank: 7, username: 'BookNerd', fighterName: 'Unread Champion', wins: 104, level: 22, emoji: '📚' },
    { rank: 8, username: 'ToyBoss', fighterName: 'Sad Teddy', wins: 89, level: 19, emoji: '🧸' },
    { rank: 9, username: 'ChairLord', fighterName: 'The Unmovable', wins: 76, level: 16, emoji: '🪑' },
    { rank: 10, username: 'MysteryPlayer', fighterName: 'The Anomaly', wins: 65, level: 14, emoji: '❓' },
  ];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  fighterName: string;
  wins: number;
  level: number;
  emoji: string;
}

export const WEIRD_FIGHTER_OF_DAY = {
  name: 'Expired But Edgy',
  objectType: 'snack',
  rarity: 'Absurd',
  wins: 12,
  submittedBy: 'SnackLord_Dave',
  emoji: '🍟',
  quote: 'Best before 2022. Still going.',
};
