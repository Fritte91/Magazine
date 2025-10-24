#!/usr/bin/env node

/**
 * Cache Version Updater for Now Or Never Magazine
 * This script automatically updates version numbers in HTML files
 * Run this script whenever you make changes to force cache refresh
 */

const fs = require('fs');
const path = require('path');

// Configuration
const VERSION_FILE = 'cache-version.txt';
const HTML_FILES = [
    'index.html',
    'stories-styled.html',
    'stories.html',
    'journal-article.html',
    'journal-article-beginning.html',
    'journal-article-green-awakening.html',
    'journal-article-journey-waves.html',
    'journal-article-legends.html',
    'journal-article-through-lens.html',
    'journal-article-understanding.html',
    'journal-article-waves.html',
    'thank-you.html'
];

// Get current version or create new one
function getCurrentVersion() {
    try {
        if (fs.existsSync(VERSION_FILE)) {
            const content = fs.readFileSync(VERSION_FILE, 'utf8');
            const version = parseFloat(content.trim());
            return isNaN(version) ? 2.0 : version;
        }
    } catch (error) {
        console.log('No version file found, starting with version 2.0');
    }
    return 2.0;
}

// Increment version
function incrementVersion(currentVersion) {
    const newVersion = (currentVersion + 0.1).toFixed(1);
    fs.writeFileSync(VERSION_FILE, newVersion);
    return newVersion;
}

// Update version in HTML files
function updateHTMLFiles(newVersion) {
    let updatedFiles = 0;
    
    HTML_FILES.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Update CSS and JS version parameters
                content = content.replace(/v=2\.\d+/g, `v=${newVersion}`);
                
                // Update cache-buster.js version
                content = content.replace(/CACHE_VERSION = '2\.\d+'/g, `CACHE_VERSION = '${newVersion}'`);
                
                fs.writeFileSync(filePath, content);
                console.log(`✅ Updated ${filePath}`);
                updatedFiles++;
            } catch (error) {
                console.error(`❌ Error updating ${filePath}:`, error.message);
            }
        } else {
            console.log(`⚠️  File not found: ${filePath}`);
        }
    });
    
    return updatedFiles;
}

// Update cache-buster.js
function updateCacheBuster(newVersion) {
    const cacheBusterFile = 'cache-buster.js';
    if (fs.existsSync(cacheBusterFile)) {
        try {
            let content = fs.readFileSync(cacheBusterFile, 'utf8');
            content = content.replace(/CACHE_VERSION = '2\.\d+'/g, `CACHE_VERSION = '${newVersion}'`);
            fs.writeFileSync(cacheBusterFile, content);
            console.log(`✅ Updated ${cacheBusterFile}`);
            return true;
        } catch (error) {
            console.error(`❌ Error updating ${cacheBusterFile}:`, error.message);
            return false;
        }
    }
    return false;
}

// Main function
function main() {
    console.log('🚀 Starting cache version update...\n');
    
    const currentVersion = getCurrentVersion();
    const newVersion = incrementVersion(currentVersion);
    
    console.log(`📝 Current version: ${currentVersion}`);
    console.log(`🔄 New version: ${newVersion}\n`);
    
    const updatedFiles = updateHTMLFiles(newVersion);
    const cacheBusterUpdated = updateCacheBuster(newVersion);
    
    console.log(`\n✨ Cache version update complete!`);
    console.log(`📊 Updated ${updatedFiles} HTML files`);
    console.log(`🔧 Cache buster script: ${cacheBusterUpdated ? 'Updated' : 'Not found'}`);
    console.log(`🎯 New version: ${newVersion}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Test your website locally`);
    console.log(`   2. Commit changes to Git`);
    console.log(`   3. Push to your live server`);
    console.log(`   4. Clear CDN cache if using one`);
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { getCurrentVersion, incrementVersion, updateHTMLFiles, updateCacheBuster };
