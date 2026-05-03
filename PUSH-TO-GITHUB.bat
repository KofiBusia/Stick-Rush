@echo off
echo ============================================
echo  STICK RUSH — GitHub Setup & Push Script
echo ============================================
echo.

SET GH=C:\Users\kkyei\Desktop\gh-cli\bin\gh.exe
SET NODE_PATH=C:\Users\kkyei\Desktop\nodejs\node-v20.11.0-win-x64
SET PATH=%NODE_PATH%;%PATH%

echo Step 1: Login to GitHub (browser will open)...
"%GH%" auth login --web --git-protocol https
if errorlevel 1 (
    echo.
    echo Login failed. Please try again.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating GitHub repository...
"%GH%" repo create KofiBusia/stick-rush --public --description "Stick Rush - Ghana's Ultimate Stickman Party Game for Kids!" --source=. --remote=origin --push

if errorlevel 1 (
    echo.
    echo Repo may already exist. Trying to push to existing repo...
    git push -u origin master
)

echo.
echo ============================================
echo  Done! Check: https://github.com/KofiBusia/stick-rush
echo ============================================
echo.
pause
