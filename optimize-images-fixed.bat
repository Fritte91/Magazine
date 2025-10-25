@echo off
echo ========================================
echo IMAGE OPTIMIZATION SCRIPT (FIXED)
echo ========================================
echo.

echo [1/4] Creating optimized directory...
if not exist "image\optimized" mkdir "image\optimized"

echo [2/4] Analyzing current image sizes...
powershell -Command "Get-ChildItem -Path 'image' -File | Measure-Object -Property Length -Sum | ForEach-Object { Write-Host 'Total current size:' ([math]::Round($_.Sum / 1MB, 2)) 'MB' }"

echo.
echo [3/4] Starting image optimization...
echo.

echo Optimizing hero-background.jpg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hero-background.jpg'); $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }; $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1); $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 80); $img.Save('image\optimized\hero-background-opt.jpg', $codec, $encoderParams); $img.Dispose()"

echo Optimizing MagazineCover.jpg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\MagazineCover.jpg'); $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }; $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1); $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85); $img.Save('image\optimized\MagazineCover-opt.jpg', $codec, $encoderParams); $img.Dispose()"

echo Optimizing hightimes1.jpg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hightimes1.jpg'); $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }; $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1); $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85); $img.Save('image\optimized\hightimes1-opt.jpg', $codec, $encoderParams); $img.Dispose()"

echo Optimizing hightimes2.jpg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hightimes2.jpg'); $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }; $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1); $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85); $img.Save('image\optimized\hightimes2-opt.jpg', $codec, $encoderParams); $img.Dispose()"

echo Optimizing hightimes3.jpeg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hightimes3.jpeg'); $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }; $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1); $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85); $img.Save('image\optimized\hightimes3-opt.jpeg', $codec, $encoderParams); $img.Dispose()"

echo Optimizing hightimes4.jpeg...
powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('image\hightimes4.jpeg'); $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }; $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1); $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85); $img.Save('image\optimized\hightimes4-opt.jpeg', $codec, $encoderParams); $img.Dispose()"

echo.
echo [4/4] Analyzing optimized sizes...
powershell -Command "Get-ChildItem -Path 'image\optimized' -File | Measure-Object -Property Length -Sum | ForEach-Object { Write-Host 'Total optimized size:' ([math]::Round($_.Sum / 1MB, 2)) 'MB' }"

echo.
echo ✅ Optimization complete!
echo.
echo Next steps:
echo 1. Check image\optimized\ folder for optimized images
echo 2. Test the optimized images in your browser
echo 3. If quality looks good, replace the originals
echo.
pause
