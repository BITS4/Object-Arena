# Object Arena — MVP

> Scan anything. Turn it into a fighter. Battle. Share. Repeat.

A viral mobile game built with Expo React Native + TypeScript. Scan real-world objects, generate funny battle characters with stats and powers, fight auto-battles, collect fighters, and share results.

---

## Setup

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator / Android Emulator or Expo Go on a physical device

### Install & Run

```bash
npm install
npm start
# Press 'i' for iOS, 'a' for Android, or scan QR with Expo Go
```

---

## Project Structure

```
app/                    # Expo Router screens (16 screens)
  (tabs)/               # Tab nav: Home, Collection, Leaderboard, Profile
  index.tsx             # Splash → onboarding or home
  onboarding.tsx        # 3-slide onboarding
  scan.tsx              # Object scanner with mock AI
  reveal.tsx            # Fighter reveal with card animation
  battle-setup.tsx      # Pick fighter + opponent type
  battle.tsx            # Live auto-battle animation
  battle-result.tsx     # Win/loss + share + rewards
  fighter/[id].tsx      # Fighter detail + rename + history
  upgrade/[id].tsx      # Upgrade fighter with coins
  daily-arena.tsx       # Daily boss + countdown timer
  shop.tsx              # Full item shop (IAP placeholder)
  settings.tsx          # Sound, privacy, data reset

src/
  game/
    fighterGenerator.ts  # Procedural fighter generation
    battleSimulator.ts   # Auto-battle engine with chaos events
    economy.ts           # Coins, gems, XP, upgrades
    progression.ts       # Titles, leaderboard, win bonuses
  data/
    objectTypes.ts       # 10 categories, 20+ names each, 20+ moves
    mockOpponents.ts     # 6 pre-built AI opponents + daily boss
    shopItems.ts         # Full shop inventory
  storage/
    localStorage.ts      # AsyncStorage wrapper (swap for API calls)
  store/
    gameStore.ts         # Zustand global state
  utils/
    random.ts            # RNG utilities
    shareText.ts         # Viral caption + recap generator
    safety.ts            # Content moderation hooks (mock → real)
  types/
    fighter.ts, battle.ts, economy.ts
  theme/
    colors.ts, typography.ts
  components/
    Button, FighterCard, StatBar, RarityBadge, HealthBar,
    CurrencyDisplay, ScreenHeader
```

---

## Game Systems

### Fighter Generation
- **10 object categories**: shoe, cup, keyboard, bottle, book, toy, chair, snack, phone, mystery
- **5 rarity tiers**: Common → Rare → Epic → Legendary → Absurd
- **7 fighter classes**: Tank, Trickster, Speedster, Blaster, Cursed, Snack Lord, Household Menace
- **20+ special moves**, **20+ names per category**, unique quotes per object type
- Stats: Power, Defense, Speed, Chaos, Luck — rarity-weighted with per-object bonuses

### Battle Engine
- Speed determines initiative; Chaos triggers wild random events
- Luck affects critical hits; Defense reduces incoming damage
- Special move fires at ~30% HP or round 4-5
- Full event log with captions: attacks, crits, misses, chaos events, taunts
- Produces winner, full event log, XP, coins, share caption, and funny recap

### Economy
- Soft: **Coins** (battles, upgrades, some shop items)
- Premium: **Gems** (shop, premium unlocks)
- **Scan Credits**: limited resource for scanning objects
- 5 upgrade tiers per fighter; cost scales with level; stats capped at 100
- Player XP + Fighter XP both gain from battle results

### Virality
- Auto-generated captions from `shareText.ts` — unique per object type and result
- Share via native share sheet; challenge link placeholder; video clip placeholder

---

## Content Safety

All image handling goes through `src/utils/safety.ts`:
- `moderateImage()` — mock moderation (→ swap for AWS Rekognition / Google Vision)
- `detectObjectCategory()` — mock AI detection (→ swap for GPT-4o Vision / Gemini)
- UI warns users before scanning; no faces, IDs, or documents allowed
- No images sent to external servers in MVP

---

## Future Backend Plan

### Auth
Replace local profile with **Firebase Auth** or **Supabase Auth**. Support Apple + Google sign-in.

### Image Upload
- Upload to **S3** or **Firebase Storage** via presigned URL
- Store only URL in fighter record; set lifecycle policy for deletion

### AI Object Detection
Replace `detectObjectCategory()` with GPT-4o Vision, Google Cloud Vision, or AWS Rekognition:
```ts
// POST imageUrl to your backend → call AI API → return category string
const category = await fetch('/api/detect', { method: 'POST', body: JSON.stringify({ imageUrl }) });
```

### Image Moderation
Replace `moderateImage()` with:
- **AWS Rekognition** `DetectModerationLabels`
- **Google SafeSearch** API
- **OpenAI Moderation** `/v1/moderations` (free, fast)
Run before upload; reject on first flag.

### Real Multiplayer Challenges
- Generate deep links with Firebase Dynamic Links or Branch.io
- Store challenge in Firestore; both players receive results
- Real-time battle sync via Firebase Realtime Database or Liveblocks

### Video Export
- Capture frames with `react-native-view-shot`
- Stitch to video with `ffmpeg-kit-react-native`
- Upload to Cloudinary → share URL to TikTok/Reels

### Payments / IAP
- Use **RevenueCat** (`react-native-purchases`) for Apple IAP + Google Play Billing
- Map shop items to RevenueCat product IDs
- Validate entitlements server-side; handle restore purchases

### Leaderboard
- Firestore / Supabase with indexed `totalWins DESC` queries
- Cloud Functions for anti-cheat validation
- Cloud Scheduler for daily tournament resets at midnight UTC

### Push Notifications
- Expo Push Notifications + Firebase Cloud Messaging
- Daily arena reminder, challenge received, win streak milestone alerts
