@echo off
echo Adding all changes to git...
git add .

echo Committing changes...
git commit -m "Fix service worker caching issues - HTML files now fetch fresh from network"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo IMPORTANT: Cache Clearing Instructions
echo ========================================
echo.
echo To clear the service worker cache:
echo 1. Open Chrome DevTools (F12)
echo 2. Go to Application tab
echo 3. Click "Service Workers" in left sidebar
echo 4. Click "Unregister" for your site
echo 5. Go to "Storage" in left sidebar
echo 6. Click "Clear storage" button
echo 7. Refresh the page (Ctrl+F5)
echo.
echo Deployment complete! Check Netlify in a few minutes.
pause
