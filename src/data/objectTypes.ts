import { FighterClass, Rarity } from '../types/fighter';

export interface ObjectTypeData {
  id: string;
  label: string;
  emoji: string;
  primaryStat: string;
  secondaryStat: string;
  preferredClass: FighterClass;
  colorTheme: string;
  namePool: string[];
  specialMoves: string[];
  personalityTraits: string[];
  funnyQuotes: string[];
}

export const OBJECT_TYPES: Record<string, ObjectTypeData> = {
  shoe: {
    id: 'shoe',
    label: 'Shoe',
    emoji: '👟',
    primaryStat: 'speed',
    secondaryStat: 'chaos',
    preferredClass: 'Speedster',
    colorTheme: '#f97316',
    namePool: [
      'Sole Destroyer', 'The Left Forgotten', 'Scuffmaster 3000', 'Heel of Doom',
      'Sir Stomps-a-Lot', 'The Unlaced One', 'Velcro Vengeance', 'Toe Trauma',
      'The Old Reliable', 'Stinkfoot Supreme',
    ],
    specialMoves: ['Sole Slam', 'Lace Whip', 'Stomp Storm', 'Heel Drop'],
    personalityTraits: ['chaotic', 'relentless', 'smelly but proud'],
    funnyQuotes: [
      "I've walked a thousand miles and I'm MAD about it.",
      "You think you can out-run me? I AM running.",
      "Every step is a war crime.",
    ],
  },
  cup: {
    id: 'cup',
    label: 'Cup',
    emoji: '☕',
    primaryStat: 'defense',
    secondaryStat: 'luck',
    preferredClass: 'Tank',
    colorTheme: '#06b6d4',
    namePool: [
      'The Unrinsed', 'Sir Drips-a-Lot', 'Half Full Harold', 'The Ceramic Menace',
      'Mug Shot', 'The Cold One', 'Last Drop Larry', 'Chipped Rim Charlie',
      'Thermos of Terror', 'The Office Hoarder',
    ],
    specialMoves: ['Boiling Splash', 'Steam Shield', 'Ceramic Crush', 'The Morning Dump'],
    personalityTraits: ['passive-aggressive', 'defensive', 'always 80% full'],
    funnyQuotes: [
      "I have been sitting on this desk for 3 days and I am NOT moving.",
      "My handle is chipped. Your fate is sealed.",
      "I contain multitudes. Mostly old coffee.",
    ],
  },
  keyboard: {
    id: 'keyboard',
    label: 'Keyboard',
    emoji: '⌨️',
    primaryStat: 'power',
    secondaryStat: 'chaos',
    preferredClass: 'Blaster',
    colorTheme: '#8b5cf6',
    namePool: [
      'Ctrl+Alt+Delete', 'The Crumb Hoarder', 'Clack Attack', 'KeyMaster 9000',
      'Sticky Keys McKinley', 'The Mechanical Beast', 'NumLock the Destroyer',
      'F5 Forever', 'Backspace Banisher', 'The Missing Key',
    ],
    specialMoves: ['Spam Attack', 'CAPS LOCK FURY', 'Ctrl+Alt+Defeat', 'Key Barrage'],
    personalityTraits: ['loud', 'chaotic', 'crumb-infested', 'unhinged'],
    funnyQuotes: [
      "AAAAAAAAAAAAAAAA",
      "Every key press is a threat. Every click is a promise.",
      "I've written your doom in Comic Sans.",
    ],
  },
  bottle: {
    id: 'bottle',
    label: 'Bottle',
    emoji: '🍶',
    primaryStat: 'defense',
    secondaryStat: 'speed',
    preferredClass: 'Tank',
    colorTheme: '#10b981',
    namePool: [
      'Hydra the Hydrator', 'Splash Gordon', 'The Leaker', 'Unscrew This',
      'Drip Commander', 'Nalgene Nightmare', 'The Refiller', 'Bottle McBottleface',
      'Condensation Station', 'The Shaker',
    ],
    specialMoves: ['Tidal Slam', 'Pressure Burst', 'The Refill Flood', 'Aqua Armor'],
    personalityTraits: ['calm until unstoppered', 'dependable', 'hydrated and ready'],
    funnyQuotes: [
      "I am 60% of your body. Show some respect.",
      "They said I was half empty. I showed them.",
      "Hydration is not a suggestion. It is a war.",
    ],
  },
  book: {
    id: 'book',
    label: 'Book',
    emoji: '📚',
    primaryStat: 'power',
    secondaryStat: 'luck',
    preferredClass: 'Trickster',
    colorTheme: '#3b82f6',
    namePool: [
      'Unread Champion', 'The Dusty Sage', 'Chapter One', 'Spine Breaker',
      'The Annotated Menace', 'Cliff Notes Carl', 'Overdue Larry', 'Index The Destroyer',
      'The Hardcover Horror', 'Footnote Fighter',
    ],
    specialMoves: ['Knowledge Bomb', 'Paper Cut Assault', 'Plot Twist', 'The Epilogue'],
    personalityTraits: ['pretentious', 'wise but smug', 'full of ancient secrets'],
    funnyQuotes: [
      "I contain more power than you can possibly comprehend. Also I was $40.",
      "Every page is a trap.",
      "My bookmark has been on page 47 for three years.",
    ],
  },
  toy: {
    id: 'toy',
    label: 'Toy',
    emoji: '🧸',
    primaryStat: 'chaos',
    secondaryStat: 'luck',
    preferredClass: 'Trickster',
    colorTheme: '#ec4899',
    namePool: [
      'The Forgotten One', 'Sad Teddy', 'Broken Arm Billy', 'The Under-Couch Dweller',
      'Squeaky McSqueakface', 'The Battery-Dead', 'Fluffy Destructor', 'Lost Piece Larry',
      'The Collector\'s Nightmare', 'Happy Meal Avenger',
    ],
    specialMoves: ['Chaos Squeak', 'Missing Piece Attack', 'Tears of Children', 'The Tantrum'],
    personalityTraits: ['chaotically cute', 'unpredictable', 'powered by nostalgia'],
    funnyQuotes: [
      "I have been stepped on in the dark. I remember everything.",
      "You think I'm cute? I ended marriages.",
      "My batteries are dead but my rage is not.",
    ],
  },
  chair: {
    id: 'chair',
    label: 'Chair',
    emoji: '🪑',
    primaryStat: 'defense',
    secondaryStat: 'power',
    preferredClass: 'Tank',
    colorTheme: '#84cc16',
    namePool: [
      'The Unmovable', 'Spinny McSpinface', 'Sir Sits-a-Lot', 'The Wobbly One',
      'Armrest Avenger', 'The Creaker', 'Fold-Up Fury', 'The Backbreaker',
      'Posture Destroyer', 'The Office Tyrant',
    ],
    specialMoves: ['Leg Splinter', 'Seat Slam', 'The Recline', 'Wobbly Fury'],
    personalityTraits: ['sturdy', 'territorial', 'passive until sat on'],
    funnyQuotes: [
      "I have held up more weight than you can imagine. Emotionally and physically.",
      "The wobble is a warning.",
      "You will sit down and you will thank me.",
    ],
  },
  snack: {
    id: 'snack',
    label: 'Snack',
    emoji: '🍟',
    primaryStat: 'luck',
    secondaryStat: 'chaos',
    preferredClass: 'Snack Lord',
    colorTheme: '#f59e0b',
    namePool: [
      'The Last Chip', 'Crunchy Commander', 'Expired But Edgy', 'Salt Lord 3000',
      'The Soggy One', 'Crumb Master', 'Extra Sauce', 'The Forbidden Snack',
      'Snack Lord Supreme', 'Midnight Munchie',
    ],
    specialMoves: ['Crunch Avalanche', 'Salt Assault', 'The Last Bite', 'Flavor Explosion'],
    personalityTraits: ['unpredictably powerful', 'delicious but dangerous', 'salty'],
    funnyQuotes: [
      "I was in the back of the pantry for three months. I have evolved.",
      "They said I was a snack. They were right. I am deadly.",
      "Crunchy on the outside. Chaos on the inside.",
    ],
  },
  phone: {
    id: 'phone',
    label: 'Phone',
    emoji: '📱',
    primaryStat: 'speed',
    secondaryStat: 'power',
    preferredClass: 'Blaster',
    colorTheme: '#6366f1',
    namePool: [
      'Cracked Screen Warrior', 'Low Battery Larry', 'Notification Storm',
      'The Algorithm', 'Autocorrect Assassin', 'Dead Zone Defender',
      'Screen Time Terror', 'The Pocket Heater', 'Signal Zero', 'Ghost Mode',
    ],
    specialMoves: ['Notification Flood', 'Low Battery Panic', 'Autocorrect Attack', 'Screen Glare'],
    personalityTraits: ['overstimulated', 'constantly buzzing', 'knows too much'],
    funnyQuotes: [
      "I have your search history. Choose wisely.",
      "Battery at 3%. I am UNSTOPPABLE.",
      "I have been dropped face-down on concrete. I am forged in trauma.",
    ],
  },
  mystery: {
    id: 'mystery',
    label: 'Mystery Object',
    emoji: '❓',
    primaryStat: 'chaos',
    secondaryStat: 'luck',
    preferredClass: 'Cursed',
    colorTheme: '#e879f9',
    namePool: [
      'The Unknown', 'Thing #1', 'What Even Is This', 'The Anomaly',
      'Form Unknown', 'The Glitch', 'Object Zero', 'The Unclassified',
      'Error 404', 'The Placeholder',
    ],
    specialMoves: ['Undefined Attack', 'Null Pointer Strike', 'The Mystery Move', 'Chaos Incarnate'],
    personalityTraits: ['unknowable', 'chaotic neutral', 'defies classification'],
    funnyQuotes: [
      "I am undefined. That makes me dangerous.",
      "No one knows what I am. Including me.",
      "Classification failed. Battle mode: CHAOS.",
    ],
  },
};

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  Common: 50,
  Rare: 30,
  Epic: 15,
  Legendary: 4,
  Absurd: 1,
};

export const RARITY_STAT_MULTIPLIERS: Record<Rarity, { min: number; max: number }> = {
  Common: { min: 0.4, max: 0.65 },
  Rare: { min: 0.55, max: 0.75 },
  Epic: { min: 0.65, max: 0.85 },
  Legendary: { min: 0.78, max: 0.95 },
  Absurd: { min: 0.5, max: 1.0 },
};

export const SPECIAL_MOVES: string[] = [
  'Omega Slam', 'Final Form', 'The Big Reveal', 'Chaos Wave', 'Lucky Strike',
  'Berserker Mode', 'Absolute Zero', 'Hyperdrive', 'The Reckoning', 'Judgment Day',
  'Phantom Strike', 'Soul Crush', 'Thunder Clap', 'Void Blast', 'Reality Break',
  'The Finisher', 'Overdrive', 'Last Resort', 'Critical Overload', 'Nemesis Protocol',
  'Doom Spiral', 'Berserk Protocol', 'Meltdown Mode',
];

export const ALL_OBJECT_TYPE_IDS = Object.keys(OBJECT_TYPES);
