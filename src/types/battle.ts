import { Fighter } from './fighter';

export type BattleEventType =
  | 'attack'
  | 'special'
  | 'crit'
  | 'miss'
  | 'chaos'
  | 'defend'
  | 'taunt';

export interface BattleEvent {
  round: number;
  attackerId: string;
  attackerName: string;
  defenderId: string;
  defenderName: string;
  damage: number;
  type: BattleEventType;
  caption: string;
  attackerHpAfter: number;
  defenderHpAfter: number;
}

export interface BattleResult {
  id: string;
  winnerId: string;
  winnerName: string;
  loserId: string;
  loserName: string;
  rounds: number;
  events: BattleEvent[];
  coinsEarned: number;
  xpEarned: number;
  shareCaption: string;
  funnyRecap: string;
  date: number;
}

export type OpponentType = 'ai' | 'friend' | 'daily-boss';

export interface BattleSetup {
  yourFighterId: string;
  opponentId: string;
  opponentType: OpponentType;
  winChance: number;
}
