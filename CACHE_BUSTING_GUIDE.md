# Cache Busting Guide for Now Or Never Magazine

## 🎯 Problem Solved

This guide addresses the caching issue where some content updates on your live website while other content doesn't, even after pushing to Git. This happens because browsers and CDNs cache static assets (images, CSS, JS) differently.

## 🔍 Root Cause

The issue occurs because:
1. **CSS/JS files** had version parameters (`?v=2.1`) but **images didn't**
2. When you update content, browsers cache images but refresh CSS/JS
3. This creates inconsistent updates where layout changes but images don't

## ✅ Solution Implemented

### 1. **Comprehensive Cache Busting**
- Added version parameters (`?v=2.2`) to ALL images in HTML files
- Updated CSS and JS version numbers consistently
- Created automatic cache-busting script

### 2. **Files Updated**
- `index.html` - All images now have `?v=2.2`
- `stories-styled.html` - All images now have `?v=2.2`
- `cache-buster.js` - Automatic cache busting script
- `.htaccess` - Server-side cache control
- `update-cache-version.js` - Automated version updater

### 3. **How It Works**
```html
<!-- Before (cached) -->
<img src="./image/cover.webp" alt="Cover">

<!-- After (cache-busted) -->
<img src="./image/cover.webp?v=2.2" alt="Cover">
```

## 🚀 How to Use

### Method 1: Automatic (Recommended)
```bash
# Run the cache updater
node update-cache-version.js

# Or on Windows
update-cache.bat
```

### Method 2: Manual
1. Update version number in all HTML files
2. Change `v=2.2` to `v=2.3` (or higher)
3. Update `cache-buster.js` version
4. Test and deploy

## 📁 Files Created/Modified

### New Files:
- `cache-buster.js` - Automatic cache busting
- `update-cache-version.js` - Version updater script
- `update-cache.bat` - Windows batch file
- `.htaccess` - Server cache control
- `CACHE_BUSTING_GUIDE.md` - This guide

### Modified Files:
- `index.html` - Added `?v=2.2` to all images
- `stories-styled.html` - Added `?v=2.2` to all images

## 🔧 Technical Details

### Cache Busting Strategy
1. **Version Parameters**: `?v=2.2` forces browser to treat as new file
2. **Automatic Script**: `cache-buster.js` adds versions to dynamic content
3. **Server Headers**: `.htaccess` controls caching behavior
4. **Consistent Versioning**: All assets use same version number

### Browser Behavior
- **Without version**: Browser caches `image.jpg` indefinitely
- **With version**: Browser treats `image.jpg?v=2.2` as new file
- **Version change**: Forces complete refresh of all assets

## 🎯 When to Update Version

Update the cache version whenever you:
- ✅ Change any image files
- ✅ Modify CSS styling
- ✅ Update JavaScript functionality
- ✅ Change HTML content
- ✅ Deploy to production

## 🚨 Important Notes

### Before Deployment:
1. **Test locally** - Make sure everything works
2. **Update version** - Run `node update-cache-version.js`
3. **Commit changes** - Git commit with new version
4. **Push to server** - Deploy to live site
5. **Clear CDN** - If using Cloudflare, clear cache

### Version Number Format:
- Use decimal format: `2.2`, `2.3`, `2.4`
- Increment by 0.1 for each update
- Never use the same version twice

## 🐛 Troubleshooting

### Images Still Not Updating?
1. Check if version parameter is added: `image.jpg?v=2.2`
2. Clear browser cache: `Ctrl+F5` or `Cmd+Shift+R`
3. Check browser developer tools for cached files
4. Verify `.htaccess` is uploaded to server

### CSS/JS Not Updating?
1. Check version numbers match across all files
2. Clear browser cache completely
3. Check server logs for errors
4. Verify file permissions

### Server Issues?
1. Ensure `.htaccess` is uploaded
2. Check if mod_rewrite is enabled
3. Verify file paths are correct
4. Check server error logs

## 📊 Performance Impact

### Benefits:
- ✅ Consistent content updates
- ✅ No more caching issues
- ✅ Better user experience
- ✅ Reliable deployments

### Considerations:
- Slightly larger file sizes (version parameters)
- More HTTP requests (but negligible impact)
- Better caching control overall

## 🔄 Workflow Integration

### Development Workflow:
1. Make changes to website
2. Run `node update-cache-version.js`
3. Test locally
4. Commit to Git
5. Push to live server
6. Verify updates work

### CI/CD Integration:
```bash
# Add to your deployment script
npm run update-cache
git add .
git commit -m "Update cache version"
git push origin main
```

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Verify all files are uploaded
3. Test with different browsers
4. Check server configuration
5. Contact your hosting provider

---

**Remember**: Always update the cache version when making changes to ensure users see the latest content!
