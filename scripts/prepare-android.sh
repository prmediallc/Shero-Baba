#!/usr/bin/env bash
# Generates the native Android project from www/ and applies Shero Baba settings.
# Used by GitHub Actions and works the same on your own computer.
#
#   VERSION_CODE  whole number that must go up with every Play upload (CI uses the run number)
#   VERSION_NAME  version users see, e.g. 1.0.3 (defaults to package.json "version")
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION_NAME="${VERSION_NAME:-$(node -p "require('./package.json').version")}"
VERSION_CODE="${VERSION_CODE:-1}"
echo "Preparing Android project: versionName=$VERSION_NAME versionCode=$VERSION_CODE"

# 1. Create the android/ folder if it does not exist yet
if [ ! -d android ]; then
  npx cap add android
fi

# 2. Launcher icons + splash screens from assets/
npx @capacitor/assets generate --android \
  --iconBackgroundColor '#C2410C' --iconBackgroundColorDark '#C2410C' \
  --splashBackgroundColor '#C2410C' --splashBackgroundColorDark '#C2410C'

GRADLE=android/app/build.gradle
MANIFEST=android/app/src/main/AndroidManifest.xml

# 3. Version numbers
sed -i.bak -E "s/versionCode [0-9]+/versionCode ${VERSION_CODE}/" "$GRADLE"
sed -i.bak -E "s/versionName \"[^\"]*\"/versionName \"${VERSION_NAME}\"/" "$GRADLE"

# 4. Release signing, read from environment variables (never stored in git)
if ! grep -q "SHERO_SIGNING" "$GRADLE"; then
cat >> "$GRADLE" <<'GRADLE_EOF'

// SHERO_SIGNING: release signing from environment variables
def sheroKeystore = System.getenv("ANDROID_KEYSTORE_PATH")
android {
    signingConfigs {
        if (sheroKeystore) {
            release {
                storeFile file(sheroKeystore)
                storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias System.getenv("ANDROID_KEY_ALIAS")
                keyPassword System.getenv("ANDROID_KEY_PASSWORD")
            }
        }
    }
    buildTypes {
        release {
            if (sheroKeystore) {
                signingConfig signingConfigs.release
            }
        }
    }
}
GRADLE_EOF
fi

# 5. Portrait game, keep screen on is handled in-app; no extra permissions added
if ! grep -q 'android:screenOrientation' "$MANIFEST"; then
  sed -i.bak 's/android:name=".MainActivity"/android:name=".MainActivity"\n            android:screenOrientation="portrait"/' "$MANIFEST"
fi
rm -f "$GRADLE.bak" "$MANIFEST.bak"

# 6. Copy web files + plugins into the native project
npx cap sync android
chmod +x android/gradlew
echo "Android project ready."
