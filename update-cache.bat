@echo off
echo 🚀 Updating cache version for Now Or Never Magazine...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Run the cache version updater
node update-cache-version.js

echo.
echo ✅ Cache version update complete!
echo.
echo 💡 Next steps:
echo    1. Test your website locally
echo    2. Commit changes to Git
echo    3. Push to your live server
echo    4. Clear CDN cache if using one
echo.
pause
