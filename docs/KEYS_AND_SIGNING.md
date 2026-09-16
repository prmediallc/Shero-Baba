# Keys, secrets and signing: the complete guide

**Good news first:** this game needs **no API keys at all**. No Firebase, no AdMob, no Google Play Games, no analytics. The only "keys" you need are for **signing** your app so Google Play accepts it, plus one optional key for automatic uploads.

| What | Needed? | Where it lives |
|---|---|---|
| Upload keystore (`.jks`) | **Yes** | Your computer + backups, and a GitHub secret |
| Keystore password, alias, key password | **Yes** | GitHub secrets + your password manager |
| Play App Signing key | Yes, but **Google holds it** | Google's servers (you never touch it) |
| Play service account JSON | Optional | GitHub secret (for auto-upload) |
| Any API keys | **No** | – |

---

## How Android signing works (60-second version)

Every Android app must be signed. With **Play App Signing** (the default for new apps) there are two keys:

1. **Upload key**: *you* create this. You sign each AAB with it before uploading. Google checks it to know the upload came from you.
2. **App signing key**: *Google* creates and keeps this. Google re-signs your app with it before delivering it to phones.

Why this is good for you: if you ever lose the upload key, Google support can reset it. Without Play App Signing, losing your key would mean you could never update the game again.

---

## Step 1: Install Java (if you don't have it)

`keytool` comes with Java.

- **Windows:** install [Temurin JDK 21](https://adoptium.net/) and tick "Set JAVA_HOME" during setup.
- **Mac:** `brew install --cask temurin@21`
- **Linux:** `sudo apt install openjdk-21-jdk`

Check: `keytool -help` should print usage text.

Android Studio also includes Java, so if you installed Android Studio you can use its `jbr/bin/keytool`.

---

## Step 2: Create your upload keystore

### Easiest (Mac, Linux, or Git Bash on Windows)
From the project folder:
```bash
bash scripts/make-keystore.sh
```
It asks for a password twice, creates `shero-baba-upload.jks`, and writes `shero-baba-upload.jks.base64.txt` for GitHub.

### Manual (any system)
```bash
keytool -genkeypair -v \
  -keystore shero-baba-upload.jks \
  -alias shero-upload \
  -keyalg RSA -keysize 4096 -validity 10000 \
  -storetype PKCS12
```
Answer the questions (your name, city Islamabad, country code PK). In PKCS12 keystores the key password is the same as the keystore password.

Then turn it into text for GitHub:

- **Mac/Linux:** `base64 -i shero-baba-upload.jks | tr -d '\n' > keystore.base64.txt`
- **Windows PowerShell:**
  ```powershell
  [Convert]::ToBase64String([IO.File]::ReadAllBytes("shero-baba-upload.jks")) | Out-File -Encoding ascii keystore.base64.txt
  ```

> ⚠️ **Never commit the `.jks` file to GitHub.** `.gitignore` already blocks `*.jks` and `*.base64.txt`, but double-check before every push.

---

## Step 3: Add the GitHub secrets

GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**. Add these four, spelled exactly:

| Secret name | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | The whole contents of the `.base64.txt` file (one long line) |
| `ANDROID_KEYSTORE_PASSWORD` | Your keystore password |
| `ANDROID_KEY_ALIAS` | `shero-upload` (or whatever alias you chose) |
| `ANDROID_KEY_PASSWORD` | Same as the keystore password |

Then **delete the `.base64.txt` file** from your computer; it is only a copy.

What happens without these secrets: the workflow still runs and gives you a **debug APK** you can install on your phone for testing, with a yellow warning. Play Console will not accept debug builds.

---

## Step 4: Back up the keystore (do this today)

Keep **the `.jks` file and its password** in at least two places, for example:
- A password manager (Bitwarden, 1Password) with the file attached
- An encrypted USB drive, or a private cloud folder

Write down the alias too. If you lose them, you can still recover through Google (Step 6), but it takes days.

---

## Step 5: Build and upload your first AAB

1. Push the code to GitHub (branch `main`). The **Build Android (APK + AAB)** workflow starts automatically. You can also start it from **Actions → Build Android → Run workflow**.
2. When it finishes (about 6–10 minutes), open the run and download the artifact `shero-baba-…zip`. Inside:
   - `SheroBaba-1.0.0-N.aab` → upload this to Play Console
   - `SheroBaba-1.0.0-N.apk` → install directly on your phone to test
3. In Play Console → Internal testing → Create release, choose **"Use Google-generated key"** when asked about app signing, then upload the AAB.

**Version codes:** the workflow uses the GitHub run number, so each build gets a higher number automatically. Play rejects an AAB whose version code was used before, so always upload the newest build.

**Releases with a version name:** push a tag and the version name comes from it:
```bash
git tag v1.0.1
git push origin v1.0.1
```
The workflow also attaches the APK and AAB to a GitHub Release for that tag.

---

## Step 6: If you lose the upload key

Play Console → **Test and release → Setup → App signing → Request upload key reset**. Create a new keystore (Step 2), export its certificate:
```bash
keytool -export -rfc -keystore new-upload.jks -alias shero-upload -file upload_certificate.pem
```
upload the `.pem` in that form, and update the four GitHub secrets. Google usually approves within a few days.

---

## Step 7 (optional): Automatic upload to Play Console

The workflow can push every **tagged** build straight into the **Internal testing** track as a draft. You still review and roll out by hand.

> The Play API cannot create an app. **Upload the very first AAB manually** (Step 5), then set this up.

1. **Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com)) → create a project (e.g. `shero-baba-ci`).
2. **APIs & Services → Library** → enable **Google Play Android Developer API**.
3. **IAM & Admin → Service Accounts → Create service account** (name: `github-play-upload`). Skip the optional role steps.
4. Open the new account → **Keys → Add key → Create new key → JSON**. A file downloads. Treat it like a password.
5. **Play Console → Users and permissions → Invite new users** → paste the service account's email (ends in `iam.gserviceaccount.com`).
   - App permissions → add **Shero Baba: Lion Run**
   - Tick **Release apps to testing tracks** (and **Release to production** only if you want that)
   - Invite user
6. GitHub → add secret `PLAY_SERVICE_ACCOUNT_JSON` with the **entire JSON file contents**.
7. Delete the downloaded JSON file from your Downloads folder.

From now on, `git tag v1.0.2 && git push origin v1.0.2` builds, signs and uploads a draft to Internal testing.

---

## Troubleshooting

| Error | Fix |
|---|---|
| `Keystore was tampered with, or password was incorrect` | `ANDROID_KEYSTORE_PASSWORD` is wrong, or the base64 text got cut. Re-create the base64 file and paste it again in one piece. |
| `No key with alias ... found` | `ANDROID_KEY_ALIAS` doesn't match. Run `keytool -list -keystore shero-baba-upload.jks` to see the alias. |
| Play: "You uploaded an APK or Android App Bundle that is signed with the wrong key" | You signed with a different keystore than the first upload. Use the original, or request an upload key reset (Step 6). |
| Play: "Version code N has already been used" | Run the workflow again to get a higher run number, then upload that build. |
| Play: "must target API level 36" | This project already targets API 36 (Capacitor 8). If you upgrade tools later, keep `targetSdkVersion` at 36 or higher in `android/variables.gradle`. |
| Auto-upload: `Only releases with status draft may be created on draft app` | Expected for a new app; the workflow already uses `status: draft`. |
| Auto-upload: `The caller does not have permission` | Step 5 of the service account setup is missing, or the invite hasn't been accepted yet. Wait 24 hours after inviting. |
