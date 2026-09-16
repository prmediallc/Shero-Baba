# Shero Baba: Lion Run

An offline, no-sign-up endless runner across Pakistan, built with HTML5 Canvas and wrapped for Android with Capacitor 8.

## What's in here

| Path | What it is |
|---|---|
| `www/` | The whole game (`index.html`, `style.css`, `game.js`, bundled fonts) |
| `www/audio/` | Drop your Suno MP3s here (`menu.mp3`, `run.mp3`, `win.mp3`, `lose.mp3`) |
| `assets/` | Source images for the launcher icon and splash screen |
| `store/` | Play Store icon, feature graphic, 8 screenshots, listing text (EN + UR) |
| `scripts/prepare-android.sh` | Generates and configures the Android project |
| `scripts/make-keystore.sh` | Creates your Play upload key |
| `.github/workflows/android.yml` | Builds signed APK + AAB on GitHub |
| `docs/PLAY_LISTING.md` | Every Play Console form, answered |
| `docs/KEYS_AND_SIGNING.md` | Keystore, GitHub secrets, optional auto-upload |
| `docs/SUNO_AUDIO_PROMPTS.md` | Music prompts and how to trim loops |
| `docs/privacy-policy.html` | Privacy policy to host on GitHub Pages |

## Quick start

### 1. Play it in your browser
```bash
npx serve www
```
Open the link on your computer or phone (same Wi-Fi). Arrow keys or WASD to move, Space to ROAR, Esc to pause.

### 2. Build the Android app on GitHub (recommended)
1. Create a new GitHub repo and push this folder to the `main` branch.
2. Follow `docs/KEYS_AND_SIGNING.md` to create your keystore and add the 4 secrets.
3. Open **Actions → Build Android (APK + AAB) → Run workflow**.
4. Download the artifact: `.aab` goes to Play Console, `.apk` installs on your phone.

For a named release: `git tag v1.0.0 && git push origin v1.0.0`.

### 3. Build on your own computer (optional)
Needs Node 22, JDK 21 and Android Studio.
```bash
npm ci
bash scripts/prepare-android.sh
npx cap open android      # then Build > Generate Signed Bundle / APK
```
After changing anything in `www/`, run `npx cap sync android`.

## Music
`www/audio/menu.mp3` and `run.mp3` are the Suno tracks, trimmed for gapless looping (loop points in `LOOPS` in `www/game.js`). Optional `win.mp3` and `lose.mp3` can be added the same way; see `docs/SUNO_AUDIO_PROMPTS.md`. Any missing file falls back to the built-in dhol music.

## Changing things
- **App name / ID:** `capacitor.config.json` (change `appId` only before your first Play upload)
- **Version:** `version` in `package.json` or a `v*` git tag
- **Stops, upgrades, outfits, missions:** the `LEVELS`, `UPGRADES`, `OUTFITS`, `MISSIONS` lists at the top of `www/game.js`
- **Store graphics:** re-capture screenshots after big visual changes

## Privacy
No accounts, ads, analytics, purchases or network calls. Progress is stored only on the device.
