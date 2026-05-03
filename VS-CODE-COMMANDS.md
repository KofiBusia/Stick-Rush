# Stick Rush — VS Code Terminal Commands

Open VS Code, press `Ctrl+`` (backtick) to open terminal, then run these commands:

---

## Setup (run once)

```powershell
# 1. Set environment variables
$env:JAVA_HOME = "C:\Users\kkyei\Desktop\jdk17\jdk-17.0.11+9"
$env:ANDROID_HOME = "C:\Users\kkyei\Desktop\android-sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;C:\Users\kkyei\Desktop\nodejs\node-v20.11.0-win-x64;$env:Path"

# 2. Go to game folder
cd "C:\Users\kkyei\Desktop\MANNY HARRY GAME"
```

---

## Play Game in Browser (instant)

```powershell
# Open game in your default browser
Start-Process "C:\Users\kkyei\Desktop\MANNY HARRY GAME\www\index.html"
```

---

## Build Android APK

```powershell
# Set environment
$env:JAVA_HOME = "C:\Users\kkyei\Desktop\jdk17\jdk-17.0.11+9"
$env:ANDROID_HOME = "C:\Users\kkyei\Desktop\android-sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;C:\Users\kkyei\Desktop\nodejs\node-v20.11.0-win-x64;$env:Path"

# Go to game folder
cd "C:\Users\kkyei\Desktop\MANNY HARRY GAME"

# Sync web assets to Android
npx cap sync android

# Build the APK
cd android
.\gradlew.bat assembleDebug --no-daemon

# The APK will be at:
# android\app\build\outputs\apk\debug\app-debug.apk
```

---

## Build Release AAB (for Google Play)

```powershell
$env:JAVA_HOME = "C:\Users\kkyei\Desktop\jdk17\jdk-17.0.11+9"
$env:ANDROID_HOME = "C:\Users\kkyei\Desktop\android-sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;C:\Users\kkyei\Desktop\nodejs\node-v20.11.0-win-x64;$env:Path"

cd "C:\Users\kkyei\Desktop\MANNY HARRY GAME\android"
.\gradlew.bat bundleRelease --no-daemon

# AAB will be at:
# android\app\build\outputs\bundle\release\app-release.aab
```

---

## Generate Signing Keystore (run ONCE before releasing)

```powershell
$env:JAVA_HOME = "C:\Users\kkyei\Desktop\jdk17\jdk-17.0.11+9"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

cd "C:\Users\kkyei\Desktop\MANNY HARRY GAME\android\app"

# Generate keystore - SAVE THE PASSWORD SOMEWHERE SAFE!
keytool -genkey -v -keystore stickrush.keystore -alias stickrush -keyalg RSA -keysize 2048 -validity 10000

# When prompted:
# Keystore password: (choose something strong, e.g. StickRush2024!)
# First/Last name: Manny Harry
# Org unit: Manny Harry Games
# Org: Manny Harry Games
# City: Accra
# State: Greater Accra
# Country: GH
```

---

## Push Updates to GitHub

```powershell
cd "C:\Users\kkyei\Desktop\MANNY HARRY GAME"
git add -A
git commit -m "Update: [describe your change]"
git push
```

---

## GitHub Actions (automatic APK build on push)

When you push to GitHub, the Actions workflow at `.github/workflows/build-android.yml` 
will automatically build the APK and AAB.

Check builds at: https://github.com/KofiBusia/Stick-Rush/actions

Download the APK from the "Artifacts" section of the latest workflow run.

---

## Google Play Submission Steps

1. Go to https://play.google.com/console
2. Create new app: "Stick Rush"
3. Fill in store listing (see `store-listing/google-play-listing.md`)
4. Upload the signed AAB from step above
5. Set price: Free, with in-app purchases
6. Submit for review (usually 1-7 days)

---

## App Store (iOS) — Requires Mac

iOS builds MUST be done on a Mac with Xcode. Steps:
1. On a Mac: `npx cap add ios`
2. `npx cap open ios` (opens Xcode)
3. Set team, sign, archive, upload to App Store Connect
4. See `store-listing/app-store-listing.md` for details

---

## Open Game Icons Generator

```powershell
Start-Process "C:\Users\kkyei\Desktop\MANNY HARRY GAME\store-listing\generate-icons.html"
```
