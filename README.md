# 🏃 STICK RUSH

**Ghana's Ultimate Stickman Party Game for Kids!**

Made by Manny Harry Games | Ages 8–16 | Designed for West Africa

---

## 🎮 Game Features

- **3 Mini-Games:** Sprint Dash, Jump Fever, Reflex Blaster
- **Educational Q&A:** Math + English questions (3 difficulty tiers by age)
- **22 Stickman Costumes:** Common to Mythic rarity
- **Leaderboard:** Compete with friends
- **Payment System:** MTN MoMo, Vodafone Cash, AirtelTigo Money (GHS 5/round)
- **Round 1 FREE** — no payment needed to start playing!

---

## 📂 Project Structure

```
MANNY HARRY GAME/
├── index.html           # Main game (open in browser to play)
├── style.css            # Game styles
├── js/
│   ├── game.js          # Main game controller
│   ├── audio.js         # Sound effects + voice
│   ├── costumes.js      # 22 stickman costumes
│   ├── questions.js     # 60 educational questions
│   └── games/
│       ├── sprint.js    # Sprint Dash mini-game
│       ├── jump.js      # Jump Fever mini-game
│       └── reflex.js    # Reflex Blaster mini-game
├── www/                 # Capacitor web assets (copy of above)
├── android/             # Android (Capacitor) native project
├── .github/workflows/   # GitHub Actions CI/CD (auto-builds APK)
└── store-listing/       # App store listing metadata + icon generator
```

---

## 🚀 Play Instantly (Browser)

Just open `index.html` in any browser — works offline, no server needed.

---

## 📱 Android Build

### Quick Build (Double-click)
Run `BUILD-APK.bat` to build the debug APK.

### VS Code Terminal
See `VS-CODE-COMMANDS.md` for all commands.

### GitHub Actions (Auto-build)
Every push to `master` triggers an automatic APK + AAB build.
Download from: [Actions tab](https://github.com/KofiBusia/Stick-Rush/actions)

---

## 🏪 Google Play Submission

1. Build signed AAB (see `VS-CODE-COMMANDS.md`)
2. Go to [Google Play Console](https://play.google.com/console)
3. Create app: **Stick Rush** (`com.mannyharry.stickrush`)
4. Upload AAB, fill in listing from `store-listing/google-play-listing.md`
5. Submit for review

**⚠️ KEYSTORE:** See `KEYSTORE-INFO.txt` — back this up! Without it, you can't update the app.

---

## 🍎 App Store (iOS)

iOS builds require macOS + Xcode. See `store-listing/app-store-listing.md`.

---

## 🌍 Made in Ghana 🇬🇭

Educational content aligned with Ghana Education Service curriculum.
Supports MTN MoMo, Vodafone Cash, AirtelTigo Money payments.
