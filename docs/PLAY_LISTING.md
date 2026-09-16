# Google Play listing: everything to fill in

Copy-paste text lives in `store/listing/`. Graphics live in `store/`. This page walks through every Play Console form in the order you will meet it.

---

## 1. Create app (Play Console → Create app)

| Field | Answer |
|---|---|
| App name | **Shero Baba: Lion Run** (20/30 characters) |
| Default language | English (United States) – en-US |
| App or game | **Game** |
| Free or paid | **Free** (this cannot be changed to paid later) |
| Declarations | Tick both (Developer Program Policies, US export laws) |

Package name (set by the first upload, permanent): **`com.sherobaba.runner`**

> Before you commit to the name, search Play Store and the web for "Shero Baba" to make sure nobody else is using it for a game.

---

## 2. Main store listing (Grow users → Store presence → Main store listing)

| Field | Limit | Use |
|---|---|---|
| App name | 30 | `store/listing/title-en.txt` |
| Short description | 80 | `store/listing/short-en.txt` (76 chars) |
| Full description | 4000 | `store/listing/full-en.txt` (≈1,850 chars) |
| App icon | 512×512 PNG, ≤1 MB | `store/icon-512.png` |
| Feature graphic | 1024×500 PNG/JPG, no transparency | `store/feature-graphic-1024x500.png` |
| Phone screenshots | 2–8, 9:16 | `store/screenshots/01…08` (1080×1920) |
| Video (optional) | YouTube link | A 30-second gameplay clip helps a lot, see §10 |

Upload the screenshots in numbered order. The first three show in search results, so they are the action shots.

**Tablet screenshots:** optional. Skip them for launch; you can add 7" and 10" shots later if you want tablet featuring.

### Add Urdu translation
Store listing → **Manage translations → Add your own translations → Urdu (ur)**, then paste:
- Title: `store/listing/title-ur.txt`
- Short: `store/listing/short-ur.txt`
- Full: `store/listing/full-ur.txt`

You can reuse the same screenshots for Urdu, or swap screenshot 8 to the front.

---

## 3. Store settings (Store presence → Store settings)

| Field | Answer |
|---|---|
| App category | **Game → Arcade** |
| Tags (up to 5) | Endless runner · Arcade · Casual · Offline · Single player |
| Email | your support email (required, shown publicly) |
| Website | your GitHub Pages link (optional) |
| Phone | leave empty |
| External marketing | leave ON |

**Why Arcade, not Action:** Play groups endless runners (Subway Surfers, Temple Run) under Arcade, so that is where players browse for this kind of game.

**Niche positioning:** a Pakistani-culture endless runner. Truck art, rickshaws, real city stops, Urdu support, and fully offline play for players on limited data. Lean on "Pakistan", "truck art", "offline" and "Urdu" in any promotion.

---

## 4. App content (Policy → App content)

Answer each section exactly like this. Every answer is true for the code in this repo.

### Privacy policy
Paste your hosted URL. The policy is ready in `docs/privacy-policy.html`, see §7 for hosting it free.

### App access
**All functionality in my app is available without any access restrictions.**
(No login, no account, nothing locked behind a server.)

### Ads
**No, my app does not contain ads.**

### Content rating (IARC questionnaire)
- Email: your email
- Category: **Game**

| Question area | Answer |
|---|---|
| Violence | **No** (the lion bumps into vehicles and obstacles; no characters are hurt, no blood) |
| Fear / horror | No |
| Sexuality, nudity | No |
| Language (profanity) | No |
| Controlled substances (drugs, alcohol, tobacco) | No |
| Crude humour | No |
| Gambling / simulated gambling | No |
| Users can interact or exchange content | **No** |
| Shares user's location with others | **No** |
| Allows digital purchases | **No** |
| Is this a web browser or search engine | No |
| Unrestricted internet access | No |

Expected result: **Everyone / PEGI 3 / IARC 3+**.

### Target audience and content
- Target age groups: **6–8, 9–12, 13–15, 16–17, 18 and over**
- "Could your store listing unintentionally appeal to children?" Not asked if you include children. If you instead pick 13+ only, answer **Yes**, because a cartoon lion clearly appeals to kids.

Including children puts the app under the **Families policy**. This game already meets it:
no ads, no analytics, no data collection, no account, no network calls, no external links, and the only text input (the player name on the Records screen) never leaves the device.
If Play asks, answer **"No" to "Does your app use any SDKs that collect data"**.

> If you would rather avoid the Families review entirely, choose **13 and over** only. Either choice is fine for this game; including 6–12 widens your audience.

### News app
**No**

### COVID-19 contact tracing
**No**

### Data safety
Answer the first screen:

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **No** |

That is the whole form. Play then shows "No data collected, No data shared" on your listing.

Why this is accurate: the game saves coins, stars, settings, the local player name and top runs in the phone's WebView storage only. Google's definition of "collected" means data that leaves the device, and nothing does.

### Government app
**No**

### Financial features
**My app doesn't provide any financial features**

### Health apps
**My app does not have any health features**

### Advertising ID
**No**, the app does not use advertising ID. (Capacitor does not add the `AD_ID` permission.)

### Permissions the APK declares
| Permission | Why |
|---|---|
| `INTERNET` | Standard Capacitor WebView requirement. The game makes zero network requests. |
| `VIBRATE` | Added by the Haptics plugin for crash/power-up vibration (can be turned off in Settings) |

Neither is a sensitive permission, so no extra declaration forms appear.

---

## 5. Releases: the order to do things

New **personal** developer accounts (created after 13 Nov 2023) must run a **closed test with at least 12 testers opted in for 14 days in a row** before Production unlocks. Organisation accounts are exempt.

1. **Internal testing** (Test and release → Testing → Internal testing)
   - Create release → **Choose signing key → "Use Google-generated key"** (Play App Signing, recommended)
   - Upload `SheroBaba-x.y.z-N.aab` from GitHub Actions
   - Release notes: `Initial release`
   - Add your own Gmail as a tester, install from the link, play through once.
2. **Closed testing** (create a track, e.g. "Beta")
   - Promote the same release, add a Google Group or email list with **15–20 people** (friends, family, cousins, classmates). Aim above 12 because anyone who drops out resets the 14-day clock.
   - Ask them to open the game a few times across the two weeks and send feedback.
   - Use real people you know. Paid "tester" services put your account at risk.
3. **Apply for production** (Dashboard → Apply for production) after 14 days. You will answer a short form about how you tested and what you changed.
4. **Production** → Countries: start with **Pakistan**, then add all countries if you like → Rollout 100%.

Review usually takes a few days for a first app.

### Every update after that
1. Push a tag: `git tag v1.0.1 && git push origin v1.0.1`
2. GitHub Actions builds a new AAB with a higher version code automatically
3. Upload it in Play Console (or let the optional auto-upload step send it to Internal testing)

---

## 6. Release notes templates

**v1.0.0**
```
Shero Baba's first run! 8 stops across Pakistan, endless mode, ROAR power, daily missions, English and Urdu. Plays fully offline.
```

**Urdu**
```
شیرو بابا کی پہلی دوڑ! پاکستان کے 8 پڑاؤ، لامحدود دوڑ، دھاڑ کی طاقت، روزانہ مشن، انگریزی اور اردو۔ مکمل آف لائن۔
```

---

## 7. Host the privacy policy (free, 3 minutes)

1. Edit `docs/privacy-policy.html`: replace `YOUR-EMAIL@example.com` and the date.
2. Push to GitHub.
3. Repo **Settings → Pages → Source: Deploy from a branch → Branch: `main`, Folder: `/docs`** → Save.
4. After a minute your policy is at
   `https://<your-username>.github.io/<repo-name>/privacy-policy.html`
5. Paste that URL into Play Console → App content → Privacy policy, and into the Store settings website field if you like.

On a free GitHub plan, Pages only works for public repos. Making this repo public is safe because no keys or passwords are in the code. If you want to keep it private, host the HTML file anywhere else (Google Sites, Netlify, your own site).

---

## 8. Pre-launch checklist

- [ ] Suno music added in `www/audio/` (optional, the game has built-in music)
- [ ] Privacy policy hosted and URL added
- [ ] Support email set
- [ ] Keystore backed up in two places (see `KEYS_AND_SIGNING.md`)
- [ ] Played the internal test build on a real phone: tutorial, one story stop, endless, workshop purchase, missions claim, Urdu toggle, airplane mode
- [ ] Every App content section shows a green tick
- [ ] Closed test running with 15+ testers

---

## 9. Promotional text you can reuse

**One-liner:** Pakistan's own lion runner. Dodge truck-art trucks and rickshaws from Karachi to Islamabad, no internet needed.

**Social post (EN):** Shero Baba is here! 🦁 Run from Karachi Sea View to the Margalla Hills, dodge painted trucks, slide under shaadi banners and ROAR through traffic. No sign-up, no ads, plays offline. On Google Play now.

**Social post (UR):** شیرو بابا آ گیا! 🦁 کراچی سے مارگلہ تک دوڑیں، ٹرکوں سے بچیں، شادی کی جھنڈیوں کے نیچے سے نکلیں اور دھاڑیں! نہ سائن اپ، نہ اشتہار، مکمل آف لائن۔

---

## 10. Optional promo video

Record gameplay on your phone (Android's built-in screen recorder), trim to 30 seconds, add the Suno theme song from `SUNO_AUDIO_PROMPTS.md` (track 5), upload to YouTube as **Public or Unlisted** with ads turned off, and paste the link in the listing.
