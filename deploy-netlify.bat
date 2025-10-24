@echo off
echo 🚀 Deploying to Netlify with Cache Busting...
echo.

REM Update cache version
echo 📝 Updating cache version...
node update-cache-version.js

REM Add timestamp to force Netlify cache invalidation
echo 🔄 Adding timestamp to force cache invalidation...
echo <!-- Cache busted at %date% %time% --> >> index.html
echo <!-- Cache busted at %date% %time% --> >> stories-styled.html

REM Git operations
echo 📦 Committing changes to Git...
git add .
git commit -m "Deploy with cache busting - %date% %time%"

echo 🚀 Pushing to Netlify...
git push origin main

echo.
echo ✅ Deployment complete!
echo.
echo 💡 Next steps:
echo    1. Wait 2-3 minutes for Netlify to build
echo    2. Check your live website
echo    3. If still cached, add ?force_reload=1 to your URL
echo    4. Clear Netlify cache in dashboard if needed
echo.
echo 🔗 Force reload URL: https://nowornevermagazine.com/?force_reload=1
echo.
pause
