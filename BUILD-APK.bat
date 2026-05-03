@echo off
echo ================================================
echo  STICK RUSH — Build Debug APK
echo ================================================
echo.

SET JAVA_HOME=C:\Users\kkyei\Desktop\jdk17\jdk-17.0.11+9
SET ANDROID_HOME=C:\Users\kkyei\Desktop\android-sdk
SET NODE_PATH=C:\Users\kkyei\Desktop\nodejs\node-v20.11.0-win-x64
SET PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%NODE_PATH%;%PATH%

cd /d "C:\Users\kkyei\Desktop\MANNY HARRY GAME"

echo [1/3] Syncing Capacitor assets...
npx cap sync android

echo.
echo [2/3] Building Debug APK...
cd android
call gradlew.bat assembleDebug --no-daemon

echo.
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo ================================================
    echo  SUCCESS! APK built:
    echo  android\app\build\outputs\apk\debug\app-debug.apk
    echo ================================================
    echo.
    echo Opening APK folder...
    explorer "app\build\outputs\apk\debug"
) else (
    echo BUILD FAILED — check errors above
)

pause
