# Suno AI audio prompts

> **Status:** `menu.mp3` and `run.mp3` are done and in `www/audio/`. `win.mp3` and `lose.mp3` are still optional (the game uses built-in jingles).
>
> The two music files were processed for gapless looping: each plays its intro once, then repeats its best section (Menu 69.6–121.6 s, Run 28.0–53.2 s) with a crossfade baked into the loop start. The loop points live in the `LOOPS` table in `www/game.js`. If you replace a file with a new song, the game notices the different length and simply loops the whole file instead; ask for new loop points if you want the intro-then-loop behaviour again.

The game already has built-in dhol-and-tumbi music made in code, so it works with no audio files at all. Adding Suno tracks replaces the built-in music automatically. No code changes needed.

## What the game looks for

Put these files in **`www/audio/`** (exact lowercase names):

| File | Plays when | Target length | Loops? |
|---|---|---|---|
| `menu.mp3` | Home, map, workshop, missions, records | 60–120 s | Yes |
| `run.mp3` | During a run | 60–120 s | Yes |
| `win.mp3` | Stop completed | 3–6 s | No |
| `lose.mp3` | Run ends in a crash | 2–4 s | No |

Any file you leave out falls back to the built-in sound. Sound effects (coins, jump, crash) are always generated in code, since Suno is built for music, not tiny effects.

---

## How to use each prompt in Suno

1. Open Suno → **Create** → switch on **Custom** mode.
2. Turn on **Instrumental** for tracks 1–4.
3. Paste **Style** into the "Style of Music" box, **Exclude** into "Exclude styles" (if your plan shows it), and the **Title**.
4. Generate. Suno gives two versions; keep the one with the steadiest rhythm.
5. Download as MP3.

Prompts avoid naming real artists on purpose; Suno blocks those.

---

## 1. `menu.mp3`: main theme

**Title:** `Shero Baba Main Theme`

**Style:**
```
Playful Punjabi bhangra folk-pop instrumental, cheerful cartoon adventure game menu music, 100 BPM, bouncy dhol groove, bright tumbi riff, bansuri flute melody, chimta jingles, handclaps, light harmonium chords, warm and heroic, steady loopable groove, clean mix, no vocals
```

**Exclude:**
```
vocals, singing, rap, spoken word, heavy distortion, dubstep drop, long intro, fade out
```

**Lyrics box (Instrumental on):** leave empty, or type `[Instrumental]`.

---

## 2. `run.mp3`: chase music

**Title:** `Shero Baba Highway Chase`

**Style:**
```
High-energy bhangra trap instrumental for a mobile endless runner game, 132 BPM, driving double dhol, punchy 808 bass, fast catchy tumbi hook, sitar stabs, brass hits like rickshaw horns, rising energy, constant momentum from the first second, no breakdown, seamless loop, no vocals
```

**Exclude:**
```
vocals, singing, rap, slow intro, ambient, breakdown, fade out, lo-fi
```

**Tip:** if a version has a quiet intro, use Suno's **Extend** or just trim it off (see below).

---

## 3. `win.mp3`: stop complete jingle

**Title:** `Shero Baba Victory`

**Style:**
```
Short triumphant bhangra fanfare, quick dhol roll into a bright shehnai and tumbi celebration phrase, big cymbal hit ending, cartoon game level complete jingle, joyful, punchy, no vocals
```

**Exclude:**
```
vocals, singing, long song, slow
```

Suno always makes a longer track, so **cut the best 3–6 seconds** (usually the opening roll and the first big hit) and fade out the last 0.3 s.

---

## 4. `lose.mp3`: game over sting

**Title:** `Shero Baba Oops`

**Style:**
```
Short comedic game over sting, descending tumbi and harmonium notes, soft dhol thud, cartoon sad trombone feel, gentle and funny not scary, no vocals
```

**Exclude:**
```
vocals, singing, horror, dark, long song
```

Cut the best **2–4 seconds**.

---

## 5. Theme song with vocals (for your promo video, not inside the game)

**Title:** `Shero Baba`

**Style:**
```
Energetic Punjabi bhangra pop, 128 BPM, confident male lead vocal with group chants, dhol, tumbi, bansuri, handclaps, catchy sing-along hook, family friendly, festive
```

**Lyrics (paste into the Lyrics box, Instrumental off):**
```
[Intro]
(Dhol) Shero! Shero!

[Verse 1]
Karachi se chala, samandar ki hawa
Multan ki galiyan, dil hai jawan
Truckon ke rang aur rickshaw ka shor
Shero Baba bhaage, sab se aage aur

[Pre-Chorus]
Daayen, baayen, upar, neeche
Koi na roke, koi na kheenche

[Chorus]
Shero Baba, dhaar maar ke!
Sadak pe chal, dar ko haar ke!
Lahore se Pindi, Margalla tak
Shero Baba, sher hai asli yaar!

[Verse 2]
Barrage ka paani, Jhang ki dhoop
Ghanta Ghar ki tik tik, bazaar ka roop
Qissa Khwani mein chai ka cup
Sikke utha le, ab rukna nahin, up!

[Bridge]
Ring bhar gaya... (Dhaaaar!)
Raasta khol do, Shero aaya yaar!

[Chorus]
Shero Baba, dhaar maar ke!
Sadak pe chal, dar ko haar ke!
Lahore se Pindi, Margalla tak
Shero Baba, sher hai asli yaar!

[Outro]
Shero! Shero! Shero Baba!
```

Roman Urdu/Punjabi usually gives Suno clearer pronunciation than Urdu script.

---

## Trim and loop the music (free, with Audacity)

1. Install [Audacity](https://www.audacityteam.org/) and open the MP3.
2. **For loops (`menu`, `run`):**
   - Skip the intro and outro. Select a middle section that starts exactly on a strong dhol hit and ends right before the same hit comes around again (8, 16 or 32 bars).
   - Zoom in and press **Z** (snap to zero crossings) so the loop point doesn't click.
   - **Edit → Remove special → Trim audio** to keep only the selection.
   - **Effect → Fading → Fade In** on the first 5 ms, **Fade Out** on the last 5 ms.
   - Press **Shift+L** (loop play) and listen for a bump at the join. Adjust if needed.
3. **For jingles (`win`, `lose`):** select the few seconds you want, trim, fade out the last 0.3 s.
4. **Effect → Volume and Compression → Normalize** to −1 dB so all tracks are similar loudness.
5. **File → Export Audio → MP3**, 128 kbps, stereo for music (mono is fine for the jingles).
6. Save with the exact names above into `www/audio/`.

Size check: a 90-second loop at 128 kbps is about 1.4 MB. Keep all four files under ~6 MB total so the download stays small.

## Test it

- **In a browser:** from the project folder run `npx serve www`, open the link, tap once (browsers need a tap before sound), and listen on the home screen, during a run, and at the end.
- **On the phone:** commit the files, push, and install the new APK from GitHub Actions.

In-game volume: music plays at 45% and jingles at 70%. To change that, edit `a.volume` in the `track()` function in `www/game.js`.

## Licence note

Check Suno's current terms before publishing. At the time of writing, songs made on Suno's **free** plan are for non-commercial use, while songs made during a **paid** (Pro/Premier) subscription can be used commercially. A Play Store game counts as distribution, so generate your final tracks while on a paid plan and keep a screenshot of your subscription for your records.
