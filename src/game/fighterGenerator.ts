/**
 * Fighter generation system.
 *
 * MVP: Uses mock object detection + procedural generation.
 * PRODUCTION: Replace detectObjectCategory() call with real AI vision API result.
 * The generator itself stays the same — it just consumes the detected category.
 */

import { Fighter, FighterClass, FighterStats, Rarity } from '../types/fighter';
import {
  OBJECT_TYPES,
  RARITY_WEIGHTS,
  RARITY_STAT_MULTIPLIERS,
  ALL_OBJECT_TYPE_IDS,
} from '../data/objectTypes';
import { randomInt, randomFloat, randomFrom, weightedRandom, uid, clamp } from '../utils/random';

function rollRarity(): Rarity {
  const rarities: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Absurd'];
  const weights = rarities.map((r) => RARITY_WEIGHTS[r]);
  return weightedRandom(rarities, weights);
}

function rollStats(rarity: Rarity, objectType: string): FighterStats {
  const { min, max } = RARITY_STAT_MULTIPLIERS[rarity];
  const typeData = OBJECT_TYPES[objectType];

  const base = () => clamp(Math.round(randomFloat(min, max) * 100), 10, 100);

  const stats: FighterStats = {
    power: base(),
    defense: base(),
    speed: base(),
    chaos: base(),
    luck: base(),
  };

  // Boost primary and secondary stats for the object type
  if (typeData) {
    const primary = typeData.primaryStat as keyof FighterStats;
    const secondary = typeData.secondaryStat as keyof FighterStats;
    stats[primary] = clamp(stats[primary] + randomInt(10, 20), 10, 100);
    stats[secondary] = clamp(stats[secondary] + randomInt(5, 15), 10, 100);
  }

  // Absurd: one stat goes to 95-100, others chaotic
  if (rarity === 'Absurd') {
    const keys = Object.keys(stats) as (keyof FighterStats)[];
    const breakoutStat = randomFrom(keys);
    stats[breakoutStat] = randomInt(92, 100);
    // Also randomize one other stat wildly
    const otherKeys = keys.filter((k) => k !== breakoutStat);
    const chaosStat = randomFrom(otherKeys);
    stats[chaosStat] = randomInt(5, 30);
  }

  return stats;
}

function calculateMaxHp(stats: FighterStats, rarity: Rarity): number {
  const rarityHpBonus: Record<Rarity, number> = {
    Common: 150,
    Rare: 200,
    Epic: 250,
    Legendary: 300,
    Absurd: 320,
  };
  const base = rarityHpBonus[rarity];
  return Math.round(base + stats.defense * 2.5 + stats.power * 1.0);
}

function pickClass(objectType: string, stats: FighterStats, rarity: Rarity): FighterClass {
  const typeData = OBJECT_TYPES[objectType];
  if (!typeData) return 'Cursed';

  // Absurd rarity sometimes overrides class
  if (rarity === 'Absurd' && Math.random() < 0.4) return 'Cursed';

  // Usually use the preferred class, but high chaos can override
  if (stats.chaos > 80 && Math.random() < 0.3) return 'Trickster';
  if (stats.speed > 85 && Math.random() < 0.3) return 'Speedster';

  return typeData.preferredClass;
}

function pickSpecialMove(objectType: string): { name: string; description: string } {
  const typeData = OBJECT_TYPES[objectType];
  const moveName = typeData ? randomFrom(typeData.specialMoves) : 'Chaos Incarnate';
  const descriptions: Record<string, string> = {
    'Sole Slam': 'Delivers a devastating ground-pound. The floor is not okay.',
    'Lace Whip': 'Extends shoelaces to lethal length. Nobody expected this.',
    'Stomp Storm': 'Executes 47 rapid stomps per second. Seismically dangerous.',
    'Heel Drop': 'Drops from maximum height heel-first. There is no recovery.',
    'Boiling Splash': 'Flings day-old coffee at ludicrous temperatures. Horrifying.',
    'Steam Shield': 'Generates a scalding steam barrier. Enemies hesitate.',
    'Ceramic Crush': 'Brings full ceramic density to bear. More than expected.',
    'The Morning Dump': 'Psychic attack. The opponent remembers every morning they had bad coffee.',
    'Spam Attack': 'Fires 10,000 keystrokes per second. Overwhelming.',
    'CAPS LOCK FURY': 'Locks opponent in a loop of eternal capitals. No escape.',
    'Ctrl+Alt+Defeat': 'Force-quits the opponent\'s will to fight.',
    'Key Barrage': 'All 104 keys launch simultaneously. Catastrophic.',
    'Tidal Slam': 'Full bottle impact. Pressure differential is extreme.',
    'Pressure Burst': 'Uncaps at full pressure. The spray radius is concerning.',
    'The Refill Flood': 'Endlessly refills. The flood does not stop.',
    'Aqua Armor': 'Full hydration mode. Defense through pure water pressure.',
    'Knowledge Bomb': 'Hurls 700 pages of accumulated wisdom. Physically painful.',
    'Paper Cut Assault': 'Thousands of paper cuts simultaneously. Technically not lethal.',
    'Plot Twist': 'The narrative shifts. The opponent never saw this coming.',
    'The Epilogue': 'Everything ends. Including the opponent.',
    'Chaos Squeak': 'Emits a frequency only the soul can hear. Horrifying.',
    'Missing Piece Attack': 'The missing piece was never found. This is the reckoning.',
    'Tears of Children': 'Emotional damage. The opponent is devastated.',
    'The Tantrum': 'Full tantrum mode. Uncontrollable. Unstoppable.',
    'Leg Splinter': 'Detaches a leg and uses it as a weapon. Improvisation.',
    'Seat Slam': 'The full weight of every person ever seated. Tremendous.',
    'The Recline': 'Reclines into the opponent at maximum speed.',
    'Wobbly Fury': 'The wobble builds to dangerous resonance.',
    'Crunch Avalanche': 'Unleashes a devastating wave of crumbs. Blinding. Delicious.',
    'Salt Assault': 'So much salt. Physically and emotionally.',
    'The Last Bite': 'There is only one bite left. It carries everything.',
    'Flavor Explosion': 'The forbidden flavor achieves critical mass.',
    'Notification Flood': 'Every app notifies simultaneously. Sensory overload.',
    'Low Battery Panic': 'Achieves maximum output exactly once before dying.',
    'Autocorrect Attack': 'Sends gibberish. Enemy spends the round confused.',
    'Screen Glare': 'Reflects sunlight directly into opponent\'s eyes.',
    'Undefined Attack': 'Error: AttackType is undefined. Damages opponent anyway.',
    'Null Pointer Strike': 'Crashes opponent\'s attack routine.',
    'The Mystery Move': 'Effect unknown until executed. Terrifying.',
    'Chaos Incarnate': 'Nothing makes sense. Maximum chaos achieved.',
  };

  return {
    name: moveName,
    description:
      descriptions[moveName] ??
      `${moveName}: a move so powerful it defies description. The enemy fears it.`,
  };
}

export interface GeneratorInput {
  imageUri: string | null;
  detectedObjectType?: string; // from AI vision API or mock
}

export function generateFighter(input: GeneratorInput): Fighter {
  const objectType =
    input.detectedObjectType ??
    randomFrom(ALL_OBJECT_TYPE_IDS);

  const typeData = OBJECT_TYPES[objectType];
  const rarity = rollRarity();
  const stats = rollStats(rarity, objectType);
  const fighterClass = pickClass(objectType, stats, rarity);
  const maxHp = calculateMaxHp(stats, rarity);
  const { name: specialMove, description: specialMoveDescription } = pickSpecialMove(objectType);

  const name = typeData ? randomFrom(typeData.namePool) : randomFrom(['The Unknown', 'Chaos Entity', 'Object Zero']);
  const personality = typeData ? randomFrom(typeData.personalityTraits) : 'unknowable';
  const funnyQuote = typeData ? randomFrom(typeData.funnyQuotes) : 'I exist. That is enough.';
  const colorTheme = typeData?.colorTheme ?? '#e879f9';

  const xpToNext = 100 + (1 * 50); // level 1 → needs 150 XP

  return {
    id: uid(),
    name,
    objectType,
    imageUri: input.imageUri,
    rarity,
    class: fighterClass,
    stats,
    hp: maxHp,
    maxHp,
    specialMove,
    specialMoveDescription,
    personality,
    funnyQuote,
    colorTheme,
    level: 1,
    xp: 0,
    xpToNext,
    totalWins: 0,
    totalLosses: 0,
    isFavorite: false,
    isLocked: false,
    createdAt: Date.now(),
    battleHistory: [],
    cosmetics: [],
  };
}

export function calculateWinChance(yourFighter: Fighter, opponent: Fighter): number {
  const yourPower =
    yourFighter.stats.power * 0.35 +
    yourFighter.stats.defense * 0.25 +
    yourFighter.stats.speed * 0.2 +
    yourFighter.stats.luck * 0.1 +
    yourFighter.stats.chaos * 0.1 +
    yourFighter.level * 5;

  const oppPower =
    opponent.stats.power * 0.35 +
    opponent.stats.defense * 0.25 +
    opponent.stats.speed * 0.2 +
    opponent.stats.luck * 0.1 +
    opponent.stats.chaos * 0.1 +
    opponent.level * 5;

  const raw = yourPower / (yourPower + oppPower);
  return Math.round(clamp(raw * 100, 10, 90));
}
