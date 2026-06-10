import { create } from 'zustand';
import { Fighter } from '../types/fighter';
import { PlayerProfile } from '../types/economy';
import { BattleResult } from '../types/battle';
import {
  loadPlayer,
  savePlayer,
  loadFighters,
  saveFighters,
  loadBattleHistory,
  saveBattleHistory,
  clearAllData,
} from '../storage/localStorage';
import { STARTING_CURRENCY } from '../game/economy';
import { uid } from '../utils/random';
import { addXpToFighter, addXpToPlayer, spendCoins, addCoins } from '../game/economy';

const DEFAULT_PLAYER: PlayerProfile = {
  id: uid(),
  username: 'ArenaWarrior',
  avatarEmoji: '⚔️',
  level: 1,
  xp: 0,
  xpToNext: 150,
  totalWins: 0,
  totalBattles: 0,
  currency: STARTING_CURRENCY,
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    reducedMotion: false,
    hapticEnabled: true,
  },
  hasCompletedOnboarding: false,
  joinedAt: Date.now(),
  lastDailyBonusAt: null,
};

interface GameState {
  player: PlayerProfile;
  fighters: Fighter[];
  battleHistory: BattleResult[];
  pendingFighter: Fighter | null;
  lastBattleResult: BattleResult | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Init
  initialize: () => Promise<void>;

  // Onboarding
  completeOnboarding: () => void;

  // Fighter management
  addFighter: (fighter: Fighter) => void;
  updateFighter: (fighter: Fighter) => void;
  deleteFighter: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleLocked: (id: string) => void;
  renameFighter: (id: string, name: string) => void;
  setPendingFighter: (fighter: Fighter | null) => void;

  // Battle
  recordBattleResult: (result: BattleResult, yourFighterId: string) => void;
  setLastBattleResult: (result: BattleResult | null) => void;

  // Economy
  spendCoins: (amount: number) => boolean;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;

  // Profile
  updateUsername: (name: string) => void;
  updateSettings: (settings: Partial<PlayerProfile['settings']>) => void;

  // Reset
  resetAllData: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  player: DEFAULT_PLAYER,
  fighters: [],
  battleHistory: [],
  pendingFighter: null,
  lastBattleResult: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    set({ isLoading: true });
    const [savedPlayer, savedFighters, savedHistory] = await Promise.all([
      loadPlayer(),
      loadFighters(),
      loadBattleHistory(),
    ]);
    set({
      player: savedPlayer ?? DEFAULT_PLAYER,
      fighters: savedFighters ?? [],
      battleHistory: savedHistory ?? [],
      isLoading: false,
      isInitialized: true,
    });
  },

  completeOnboarding: () => {
    const player = { ...get().player, hasCompletedOnboarding: true };
    set({ player });
    savePlayer(player);
  },

  addFighter: (fighter) => {
    const fighters = [...get().fighters, fighter];
    set({ fighters });
    saveFighters(fighters);
  },

  updateFighter: (fighter) => {
    const fighters = get().fighters.map((f) => (f.id === fighter.id ? fighter : f));
    set({ fighters });
    saveFighters(fighters);
  },

  deleteFighter: (id) => {
    const fighters = get().fighters.filter((f) => f.id !== id);
    set({ fighters });
    saveFighters(fighters);
  },

  toggleFavorite: (id) => {
    const fighters = get().fighters.map((f) =>
      f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
    );
    set({ fighters });
    saveFighters(fighters);
  },

  toggleLocked: (id) => {
    const fighters = get().fighters.map((f) =>
      f.id === id ? { ...f, isLocked: !f.isLocked } : f
    );
    set({ fighters });
    saveFighters(fighters);
  },

  renameFighter: (id, name) => {
    const fighters = get().fighters.map((f) => (f.id === id ? { ...f, name } : f));
    set({ fighters });
    saveFighters(fighters);
  },

  setPendingFighter: (fighter) => set({ pendingFighter: fighter }),

  recordBattleResult: (result, yourFighterId) => {
    const { player, fighters, battleHistory } = get();
    const isWin = result.winnerId === yourFighterId;

    // Update fighter XP and stats
    const updatedFighters = fighters.map((f) => {
      if (f.id !== yourFighterId) return f;
      const xpGained = isWin ? result.xpEarned : Math.round(result.xpEarned * 0.4);
      const updated = addXpToFighter(f, xpGained);
      return {
        ...updated,
        totalWins: isWin ? updated.totalWins + 1 : updated.totalWins,
        totalLosses: !isWin ? updated.totalLosses + 1 : updated.totalLosses,
        battleHistory: [
          ...updated.battleHistory.slice(-19),
          {
            battleId: result.id,
            opponentName: isWin ? result.loserName : result.winnerName,
            won: isWin,
            date: result.date,
          },
        ],
      };
    });

    // Update player XP and coins
    const coinsGained = isWin ? result.coinsEarned : Math.round(result.coinsEarned * 0.3);
    const playerXpGained = isWin ? result.xpEarned : Math.round(result.xpEarned * 0.3);
    const { level, xp, xpToNext } = addXpToPlayer(
      player.level,
      player.xp,
      player.xpToNext,
      playerXpGained
    );

    const updatedPlayer: PlayerProfile = {
      ...player,
      level,
      xp,
      xpToNext,
      totalWins: isWin ? player.totalWins + 1 : player.totalWins,
      totalBattles: player.totalBattles + 1,
      currency: addCoins(player.currency, coinsGained),
    };

    const newHistory = [result, ...battleHistory].slice(0, 50);

    set({
      fighters: updatedFighters,
      player: updatedPlayer,
      battleHistory: newHistory,
      lastBattleResult: result,
    });

    saveFighters(updatedFighters);
    savePlayer(updatedPlayer);
    saveBattleHistory(newHistory);
  },

  setLastBattleResult: (result) => set({ lastBattleResult: result }),

  spendCoins: (amount) => {
    const { player } = get();
    const newCurrency = spendCoins(player.currency, amount);
    if (!newCurrency) return false;
    const updated = { ...player, currency: newCurrency };
    set({ player: updated });
    savePlayer(updated);
    return true;
  },

  addCoins: (amount) => {
    const { player } = get();
    const updated = { ...player, currency: addCoins(player.currency, amount) };
    set({ player: updated });
    savePlayer(updated);
  },

  addGems: (amount) => {
    const { player } = get();
    const updated = {
      ...player,
      currency: { ...player.currency, gems: player.currency.gems + amount },
    };
    set({ player: updated });
    savePlayer(updated);
  },

  spendGems: (amount) => {
    const { player } = get();
    if (player.currency.gems < amount) return false;
    const updated = {
      ...player,
      currency: { ...player.currency, gems: player.currency.gems - amount },
    };
    set({ player: updated });
    savePlayer(updated);
    return true;
  },

  updateUsername: (username) => {
    const player = { ...get().player, username };
    set({ player });
    savePlayer(player);
  },

  updateSettings: (settings) => {
    const player = { ...get().player, settings: { ...get().player.settings, ...settings } };
    set({ player });
    savePlayer(player);
  },

  resetAllData: async () => {
    await clearAllData();
    set({
      player: { ...DEFAULT_PLAYER, id: uid(), joinedAt: Date.now() },
      fighters: [],
      battleHistory: [],
      pendingFighter: null,
      lastBattleResult: null,
    });
  },
}));
