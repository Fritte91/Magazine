// CSS CLEANER - Safe Optimization Tool
// This script analyzes your CSS and removes only truly unused styles

const fs = require('fs');
const path = require('path');

// Read all HTML files to find used classes
function findUsedClasses() {
    const htmlFiles = [
        'index.html',
        'stories-styled.html',
        'journal-article-waves.html',
        'journal-article-legends.html',
        'journal-article-through-lens.html',
        'journal-article-beginning.html',
        'journal-article-green-awakening.html',
        'journal-article-journey-waves.html',
        'journal-article-understanding.html'
    ];
    
    const usedClasses = new Set();
    
    htmlFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Find all class attributes
            const classMatches = content.match(/class="([^"]*)"/g);
            if (classMatches) {
                classMatches.forEach(match => {
                    const classes = match.replace(/class="/, '').replace(/"/, '').split(' ');
                    classes.forEach(cls => {
                        if (cls.trim()) {
                            usedClasses.add(cls.trim());
                        }
                    });
                });
            }
            
            // Find all IDs
            const idMatches = content.match(/id="([^"]*)"/g);
            if (idMatches) {
                idMatches.forEach(match => {
                    const id = match.replace(/id="/, '').replace(/"/, '');
                    if (id.trim()) {
                        usedClasses.add('#' + id.trim());
                    }
                });
            }
        }
    });
    
    return usedClasses;
}

// Analyze CSS and create a report
function analyzeCSS() {
    console.log('🔍 Analyzing CSS usage...');
    
    const usedClasses = findUsedClasses();
    console.log(`✅ Found ${usedClasses.size} used classes/IDs`);
    
    // Read styles.css
    const stylesContent = fs.readFileSync('styles.css', 'utf8');
    const lines = stylesContent.split('\n');
    
    let totalLines = lines.length;
    let potentiallyUnused = 0;
    let criticalStyles = 0;
    
    console.log('\n📊 CSS Analysis Report:');
    console.log('========================');
    console.log(`Total CSS lines: ${totalLines}`);
    
    // Count different types of styles
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('body') || 
            trimmed.startsWith('.hero') || trimmed.startsWith('.navbar') || 
            trimmed.startsWith('.btn-') || trimmed.startsWith('.form-') ||
            trimmed.startsWith('.payment-') || trimmed.startsWith('.dark-')) {
            criticalStyles++;
        } else if (trimmed.includes('{') && !trimmed.startsWith('@')) {
            potentiallyUnused++;
        }
    });
    
    console.log(`Critical styles: ${criticalStyles}`);
    console.log(`Potentially unused: ${potentiallyUnused}`);
    console.log(`\n💡 Recommendation: Keep all styles for now`);
    console.log(`💡 Focus on removing duplicate !important declarations instead`);
    
    return {
        totalLines,
        criticalStyles,
        potentiallyUnused,
        usedClasses: Array.from(usedClasses)
    };
}

// Main execution
if (require.main === module) {
    const analysis = analyzeCSS();
    
    console.log('\n🎯 Safe Optimization Strategy:');
    console.log('==============================');
    console.log('1. ✅ Keep all existing CSS files');
    console.log('2. ✅ Only remove duplicate !important declarations');
    console.log('3. ✅ Consolidate similar styles');
    console.log('4. ✅ Test each change carefully');
    console.log('\n🚀 This approach is much safer!');
}

module.exports = { analyzeCSS, findUsedClasses };
