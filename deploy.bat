@echo off
echo Adding all changes to git...
git add .

echo Committing changes...
git commit -m "Fix caching issues and update content"

echo Pushing to GitHub...
git push origin main

echo Deployment complete! Check Netlify in a few minutes.
pause
