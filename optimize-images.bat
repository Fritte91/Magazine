@echo off
echo ========================================
echo IMAGE OPTIMIZATION SCRIPT
echo ========================================
echo.

echo [1/5] Creating optimized directory...
if not exist "image\optimized" mkdir "image\optimized"

echo [2/5] Analyzing current image sizes...
powershell -Command "Get-ChildItem -Path 'image' -File | Measure-Object -Property Length -Sum | ForEach-Object { Write-Host 'Total current size:' ([math]::Round($_.Sum / 1MB, 2)) 'MB' }"

echo.
echo [3/5] Starting image optimization...
echo.

echo Optimizing hero-background.jpg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hero-background.jpg'); $img.Save('image\optimized\hero-background-opt.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg, [System.Drawing.Imaging.Encoder]::Quality, 80); $img.Dispose()"

echo Optimizing MagazineCover.jpg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\MagazineCover.jpg'); $img.Save('image\optimized\MagazineCover-opt.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg, [System.Drawing.Imaging.Encoder]::Quality, 85); $img.Dispose()"

echo Optimizing hightimes1.jpg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hightimes1.jpg'); $img.Save('image\optimized\hightimes1-opt.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg, [System.Drawing.Imaging.Encoder]::Quality, 85); $img.Dispose()"

echo Optimizing hightimes2.jpg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hightimes2.jpg'); $img.Save('image\optimized\hightimes2-opt.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg, [System.Drawing.Imaging.Encoder]::Quality, 85); $img.Dispose()"

echo Optimizing hightimes3.jpeg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hightimes3.jpeg'); $img.Save('image\optimized\hightimes3-opt.jpeg', [System.Drawing.Imaging.ImageFormat]::Jpeg, [System.Drawing.Imaging.Encoder]::Quality, 85); $img.Dispose()"

echo Optimizing hightimes4.jpeg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hightimes4.jpeg'); $img.Save('image\optimized\hightimes4-opt.jpeg', [System.Drawing.Imaging.ImageFormat]::Jpeg, [System.Drawing.Imaging.Encoder]::Quality, 85); $img.Dispose()"

echo.
echo [4/5] Analyzing optimized sizes...
powershell -Command "Get-ChildItem -Path 'image\optimized' -File | Measure-Object -Property Length -Sum | ForEach-Object { Write-Host 'Total optimized size:' ([math]::Round($_.Sum / 1MB, 2)) 'MB' }"

echo.
echo [5/5] Optimization complete!
echo.
echo ✅ Optimized images saved to: image\optimized\
echo ✅ Original images backed up to: image-backup\
echo.
echo Next steps:
echo 1. Test the optimized images in your browser
echo 2. If quality looks good, replace the originals
echo 3. Update HTML files to use optimized versions
echo.
pause
