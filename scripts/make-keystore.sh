#!/usr/bin/env bash
# Creates your Play "upload key" and prints the values for GitHub secrets.
# Run once on YOUR computer (needs Java's keytool). Keep the .jks file safe forever.
set -euo pipefail
OUT="${1:-shero-baba-upload.jks}"
ALIAS="${2:-shero-upload}"
if [ -f "$OUT" ]; then echo "$OUT already exists. Refusing to overwrite."; exit 1; fi
read -r -s -p "Choose a keystore password (min 6 chars): " PASS; echo
read -r -s -p "Type it again: " PASS2; echo
[ "$PASS" = "$PASS2" ] || { echo "Passwords do not match"; exit 1; }
keytool -genkeypair -v -keystore "$OUT" -alias "$ALIAS" \
  -keyalg RSA -keysize 4096 -validity 10000 -storetype PKCS12 \
  -storepass "$PASS" -keypass "$PASS" \
  -dname "CN=Shero Baba, OU=Games, O=Shero Baba, L=Islamabad, C=PK"
base64 < "$OUT" | tr -d '\n' > "$OUT.base64.txt"
echo
echo "Done. Add these 4 GitHub secrets (Settings > Secrets and variables > Actions):"
echo "  ANDROID_KEYSTORE_BASE64   = contents of $OUT.base64.txt"
echo "  ANDROID_KEYSTORE_PASSWORD = the password you just typed"
echo "  ANDROID_KEY_ALIAS         = $ALIAS"
echo "  ANDROID_KEY_PASSWORD      = the same password"
echo
echo "Then DELETE $OUT.base64.txt and back up $OUT + the password in two safe places."
keytool -list -v -keystore "$OUT" -storepass "$PASS" | grep -E "SHA1|SHA256" || true
