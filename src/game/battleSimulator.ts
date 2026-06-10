import { Fighter } from '../types/fighter';
import { BattleEvent, BattleEventType, BattleResult } from '../types/battle';
import { randomInt, randomFloat, randomFrom, uid, clamp } from '../utils/random';
import { generateBattleRecap, generateBattleShareCaption } from '../utils/shareText';

interface BattleFighterState {
  fighter: Fighter;
  currentHp: number;
  specialUsed: boolean;
  stunned: boolean;
}

const CHAOS_EVENTS = [
  'slips on a banana peel and somehow does MORE damage',
  'accidentally powers up — nobody knows why',
  'trips but rolls into a devastating attack',
  'screams at the sky and gains temporary invincibility',
  'does something completely unexpected and it WORKS',
  'enters a random battle mode',
  'fumbles the move but the enemy still takes damage somehow',
];

const TAUNT_LINES = [
  "Is that all you've got?",
  "I've fought toasters tougher than you.",
  "You call that an attack?",
  "My grandma hits harder. She is also an object.",
  "I'm not even trying.",
  "Do better.",
  "This is embarrassing.",
  "Are you sure you want to continue?",
];

function calculateDamage(
  attacker: BattleFighterState,
  defender: BattleFighterState
): { damage: number; type: BattleEventType; chaosText?: string } {
  const af = attacker.fighter;
  const df = defender.fighter;

  // Base damage
  let base = af.stats.power * randomFloat(0.7, 1.3);

  // Defense mitigation
  const mitigation = (df.stats.defense / 200) * base;
  base = Math.max(base - mitigation, 5);

  // Crit chance based on luck
  const critChance = af.stats.luck / 300;
  const isCrit = Math.random() < critChance;
  if (isCrit) {
    base *= randomFloat(1.5, 2.2);
  }

  // Chaos events
  const chaosRoll = Math.random();
  const chaosThreshold = af.stats.chaos / 300;

  if (chaosRoll < chaosThreshold) {
    const chaosText = randomFrom(CHAOS_EVENTS);
    base *= randomFloat(0.3, 2.5); // chaos can multiply OR reduce
    return {
      damage: Math.round(clamp(base, 1, defender.currentHp - 1 > 0 ? af.stats.power * 3 : base)),
      type: 'chaos',
      chaosText,
    };
  }

  // Miss chance (low speed vs high chaos)
  const missChance = (df.stats.speed - af.stats.speed) / 500;
  if (missChance > 0 && Math.random() < missChance) {
    return { damage: 0, type: 'miss' };
  }

  return {
    damage: Math.round(clamp(base, 3, af.stats.power * 2.5)),
    type: isCrit ? 'crit' : 'attack',
  };
}

function calculateSpecialDamage(attacker: BattleFighterState): number {
  const af = attacker.fighter;
  const base = (af.stats.power + af.stats.chaos * 0.5 + af.stats.luck * 0.3) * randomFloat(1.5, 2.5);
  return Math.round(clamp(base, af.stats.power * 1.5, af.stats.power * 3));
}

function buildCaption(
  event: Omit<BattleEvent, 'caption'>,
  chaosText?: string
): string {
  const { attackerName, defenderName, damage, type } = event;
  switch (type) {
    case 'crit':
      return `💥 CRITICAL HIT! ${attackerName} lands a crushing blow on ${defenderName} for ${damage} damage!`;
    case 'miss':
      return `💨 ${attackerName} swings at ${defenderName}... and completely misses!`;
    case 'chaos':
      return `⚡ CHAOS! ${attackerName} ${chaosText ?? 'does something chaotic'} — ${damage} damage!`;
    case 'special':
      return `✨ SPECIAL MOVE! ${attackerName} unleashes power beyond comprehension! ${damage} damage to ${defenderName}!`;
    case 'defend':
      return `🛡️ ${defenderName} braces for impact! Damage reduced!`;
    case 'taunt':
      return `😤 ${attackerName} taunts: "${randomFrom(TAUNT_LINES)}"`;
    default:
      return `⚔️ ${attackerName} attacks ${defenderName} for ${damage} damage!`;
  }
}

export function simulateBattle(fighter1: Fighter, fighter2: Fighter): BattleResult {
  const state1: BattleFighterState = {
    fighter: fighter1,
    currentHp: fighter1.maxHp,
    specialUsed: false,
    stunned: false,
  };
  const state2: BattleFighterState = {
    fighter: fighter2,
    currentHp: fighter2.maxHp,
    specialUsed: false,
    stunned: false,
  };

  const events: BattleEvent[] = [];
  let round = 0;
  const maxRounds = 20;

  // Speed determines who goes first
  let [first, second] =
    state1.fighter.stats.speed >= state2.fighter.stats.speed
      ? [state1, state2]
      : [state2, state1];

  // Occasional taunt at round 1
  if (Math.random() < 0.4) {
    events.push({
      round: 0,
      attackerId: first.fighter.id,
      attackerName: first.fighter.name,
      defenderId: second.fighter.id,
      defenderName: second.fighter.name,
      damage: 0,
      type: 'taunt',
      caption: buildCaption({
        round: 0,
        attackerId: first.fighter.id,
        attackerName: first.fighter.name,
        defenderId: second.fighter.id,
        defenderName: second.fighter.name,
        damage: 0,
        type: 'taunt',
        attackerHpAfter: first.currentHp,
        defenderHpAfter: second.currentHp,
      }),
      attackerHpAfter: first.currentHp,
      defenderHpAfter: second.currentHp,
    });
  }

  while (first.currentHp > 0 && second.currentHp > 0 && round < maxRounds) {
    round++;

    // First fighter attacks
    {
      const useSpecial =
        !first.specialUsed &&
        (first.currentHp / first.fighter.maxHp < 0.35 || round === 4);

      if (useSpecial) {
        first.specialUsed = true;
        const dmg = calculateSpecialDamage(first);
        second.currentHp = Math.max(0, second.currentHp - dmg);
        const ev: BattleEvent = {
          round,
          attackerId: first.fighter.id,
          attackerName: first.fighter.name,
          defenderId: second.fighter.id,
          defenderName: second.fighter.name,
          damage: dmg,
          type: 'special',
          caption: '',
          attackerHpAfter: first.currentHp,
          defenderHpAfter: second.currentHp,
        };
        ev.caption = buildCaption(ev);
        events.push(ev);
      } else {
        const { damage, type, chaosText } = calculateDamage(first, second);
        second.currentHp = Math.max(0, second.currentHp - damage);
        const ev: BattleEvent = {
          round,
          attackerId: first.fighter.id,
          attackerName: first.fighter.name,
          defenderId: second.fighter.id,
          defenderName: second.fighter.name,
          damage,
          type,
          caption: '',
          attackerHpAfter: first.currentHp,
          defenderHpAfter: second.currentHp,
        };
        ev.caption = buildCaption(ev, chaosText);
        events.push(ev);
      }

      if (second.currentHp <= 0) break;
    }

    // Second fighter attacks
    {
      const useSpecial =
        !second.specialUsed &&
        (second.currentHp / second.fighter.maxHp < 0.35 || round === 5);

      if (useSpecial) {
        second.specialUsed = true;
        const dmg = calculateSpecialDamage(second);
        first.currentHp = Math.max(0, first.currentHp - dmg);
        const ev: BattleEvent = {
          round,
          attackerId: second.fighter.id,
          attackerName: second.fighter.name,
          defenderId: first.fighter.id,
          defenderName: first.fighter.name,
          damage: dmg,
          type: 'special',
          caption: '',
          attackerHpAfter: second.currentHp,
          defenderHpAfter: first.currentHp,
        };
        ev.caption = buildCaption(ev);
        events.push(ev);
      } else {
        const { damage, type, chaosText } = calculateDamage(second, first);
        first.currentHp = Math.max(0, first.currentHp - damage);
        const ev: BattleEvent = {
          round,
          attackerId: second.fighter.id,
          attackerName: second.fighter.name,
          defenderId: first.fighter.id,
          defenderName: first.fighter.name,
          damage,
          type,
          caption: '',
          attackerHpAfter: second.currentHp,
          defenderHpAfter: first.currentHp,
        };
        ev.caption = buildCaption(ev, chaosText);
        events.push(ev);
      }
    }
  }

  // Determine winner: lowest HP loses, if tied use luck
  let winner: BattleFighterState;
  let loser: BattleFighterState;

  if (state1.currentHp <= 0 && state2.currentHp <= 0) {
    // Draw — fighter with higher luck wins by hair
    [winner, loser] =
      fighter1.stats.luck >= fighter2.stats.luck
        ? [state1, state2]
        : [state2, state1];
  } else if (state2.currentHp <= 0) {
    [winner, loser] = [state1, state2];
  } else if (state1.currentHp <= 0) {
    [winner, loser] = [state2, state1];
  } else {
    // Max rounds hit — whoever has more HP wins
    [winner, loser] =
      state1.currentHp >= state2.currentHp ? [state1, state2] : [state2, state1];
  }

  const coinsEarned = randomInt(15, 80);
  const xpEarned = randomInt(30, 120);
  const recap = generateBattleRecap(winner.fighter, loser.fighter, round);
  const shareCaption = generateBattleShareCaption(winner.fighter, loser.fighter, {
    id: uid(),
    winnerId: winner.fighter.id,
    winnerName: winner.fighter.name,
    loserId: loser.fighter.id,
    loserName: loser.fighter.name,
    rounds: round,
    events,
    coinsEarned,
    xpEarned,
    shareCaption: '',
    funnyRecap: recap,
    date: Date.now(),
  });

  return {
    id: uid(),
    winnerId: winner.fighter.id,
    winnerName: winner.fighter.name,
    loserId: loser.fighter.id,
    loserName: loser.fighter.name,
    rounds: round,
    events,
    coinsEarned,
    xpEarned,
    shareCaption,
    funnyRecap: recap,
    date: Date.now(),
  };
}
