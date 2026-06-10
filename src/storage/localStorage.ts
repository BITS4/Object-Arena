/**
 * Persistence layer using AsyncStorage.
 * All data stored locally on device for MVP.
 *
 * PRODUCTION MIGRATION: Replace with API calls to your backend.
 * Use React Query or SWR to wrap these calls with cache + sync.
 * Encrypt sensitive data before storage using expo-secure-store.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fighter } from '../types/fighter';
import { PlayerProfile } from '../types/economy';
import { BattleResult } from '../types/battle';

const KEYS = {
  PLAYER: 'oa_player',
  FIGHTERS: 'oa_fighters',
  BATTLE_HISTORY: 'oa_battle_history',
  SETTINGS: 'oa_settings',
  DAILY_STATE: 'oa_daily',
} as const;

// ─── Player Profile ─────────────────────────────────────────────────────────

export async function loadPlayer(): Promise<PlayerProfile | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.PLAYER);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function savePlayer(profile: PlayerProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PLAYER, JSON.stringify(profile));
}

// ─── Fighter Collection ──────────────────────────────────────────────────────

export async function loadFighters(): Promise<Fighter[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.FIGHTERS);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveFighters(fighters: Fighter[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.FIGHTERS, JSON.stringify(fighters));
}

// ─── Battle History ──────────────────────────────────────────────────────────

export async function loadBattleHistory(): Promise<BattleResult[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.BATTLE_HISTORY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveBattleHistory(history: BattleResult[]): Promise<void> {
  const trimmed = history.slice(-50); // keep last 50 battles
  await AsyncStorage.setItem(KEYS.BATTLE_HISTORY, JSON.stringify(trimmed));
}

// ─── Daily State ─────────────────────────────────────────────────────────────

export interface DailyState {
  date: string; // YYYY-MM-DD
  battlesFought: number;
  dailyChallengeCompleted: boolean;
  dailyBonusClaimed: boolean;
}

export async function loadDailyState(): Promise<DailyState | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.DAILY_STATE);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function saveDailyState(state: DailyState): Promise<void> {
  await AsyncStorage.setItem(KEYS.DAILY_STATE, JSON.stringify(state));
}

// ─── Full Reset ──────────────────────────────────────────────────────────────

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
