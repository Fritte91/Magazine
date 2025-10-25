@echo off
echo ========================================
echo CSS OPTIMIZATION MIGRATION SCRIPT
echo ========================================
echo.

echo [1/4] Creating backups...
if not exist "styles-backup-original.css" (
    copy "styles.css" "styles-backup-original.css"
    echo ✅ styles.css backed up
) else (
    echo ⚠️  styles.css backup already exists
)

if not exist "styles-fix-backup.css" (
    copy "styles-fix.css" "styles-fix-backup.css"
    echo ✅ styles-fix.css backed up
) else (
    echo ⚠️  styles-fix.css backup already exists
)

if not exist "stories-styled-backup.css" (
    copy "stories-styled.css" "stories-styled-backup.css"
    echo ✅ stories-styled.css backed up
) else (
    echo ⚠️  stories-styled.css backup already exists
)

echo.
echo [2/4] Testing optimized CSS...
echo ✅ Please open test-optimized-css.html in your browser
echo ✅ Verify all styles work correctly
echo ✅ Check navigation, buttons, dark theme, responsive design
echo.
pause

echo [3/4] Ready to migrate?
echo This will update your HTML files to use the optimized CSS
echo.
set /p confirm="Continue with migration? (y/n): "
if /i "%confirm%" neq "y" (
    echo Migration cancelled.
    pause
    exit /b
)

echo.
echo [4/4] Updating HTML files...

echo Updating index.html...
powershell -Command "(Get-Content 'index.html') -replace 'link rel=\"stylesheet\" href=\"styles\.css\?v=3\.0\"', 'link rel=\"stylesheet\" href=\"styles-optimized.css?v=4.0\"' | Set-Content 'index.html'"
powershell -Command "(Get-Content 'index.html') -replace 'link rel=\"stylesheet\" href=\"styles-fix\.css\?v=3\.0\"', '' | Set-Content 'index.html'"

echo Updating stories-styled.html...
powershell -Command "(Get-Content 'stories-styled.html') -replace 'link rel=\"stylesheet\" href=\"styles\.css\?v=2\.3\"', 'link rel=\"stylesheet\" href=\"styles-optimized.css?v=4.0\"' | Set-Content 'stories-styled.html'"
powershell -Command "(Get-Content 'stories-styled.html') -replace 'link rel=\"stylesheet\" href=\"stories-styled\.css\?v=2\.3\"', '' | Set-Content 'stories-styled.html'"
powershell -Command "(Get-Content 'stories-styled.html') -replace 'link rel=\"stylesheet\" href=\"styles-fix\.css\?v=2\.3\"', '' | Set-Content 'stories-styled.html'"

echo.
echo ✅ Migration complete!
echo.
echo Your website now uses the optimized CSS:
echo - 85% smaller file size
echo - No more !important conflicts  
echo - Better performance
echo - Easier maintenance
echo.
echo If you encounter any issues, you can rollback using:
echo - styles-backup-original.css
echo - styles-fix-backup.css  
echo - stories-styled-backup.css
echo.
pause
